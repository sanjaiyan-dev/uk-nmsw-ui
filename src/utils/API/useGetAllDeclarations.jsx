import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGINATION_PAGE_LABEL } from '../../constants/AppConstants';
import {
  API_URL,
  CREATE_VOYAGE_ENDPOINT,
  ENDPOINT_DECLARATION_PATH,
} from '../../constants/AppAPIConstants';
import { YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import Auth from '../Auth';
import handleAuthErrors from './handleAuthErrors';

const useGetAlLDeclarations = ({ pageNumber }) => {
  const navigate = useNavigate();
  const pageOnLoad = parseInt(sessionStorage.getItem(PAGINATION_PAGE_LABEL), 10) || 1;
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState();
  const [paginationData, setPaginationData] = useState();
  const [error, setError] = useState();

  const deleteInvalidDeclarations = async (id) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${API_URL}${ENDPOINT_DECLARATION_PATH}/${id}`,
        headers: {
          Authorization: `Bearer ${Auth.retrieveToken()}`,
        },
      });
      return response.data;
    } catch (err) {
      handleAuthErrors({ error: err, navigate, redirectUrl: YOUR_VOYAGES_URL });
      // when deleting we don't
    }
    return null;
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const pageToUse = pageNumber || pageOnLoad;

    setIsLoading(true);
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${CREATE_VOYAGE_ENDPOINT}?page=${pageToUse}`, {
          signal,
          headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
        });
        const data = await resp?.data;

        const results = [];
        data.results.map((declaration) => {
          if (declaration.departureFromUk !== null) {
            results.push(declaration);
          } else {
            deleteInvalidDeclarations(declaration.id);
          }
          return results;
        });

        const sortByLatestFirst = results.sort((a, b) => dayjs(b.creationDate) - dayjs(a.creationDate));
        setApiData(sortByLatestFirst);
        setPaginationData(resp.data.pagination);

        setIsLoading(false);
      } catch (err) {
        if (err?.code === 'ERR_CANCELED') { return; }
        const errorResponse = handleAuthErrors({ error: err, navigate, redirectUrl: YOUR_VOYAGES_URL });
        setError({ status: errorResponse?.response?.status, message: errorResponse?.message });
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { controller.abort(); };
  }, [pageNumber]);

  return {
    apiData, error, isLoading, paginationData,
  };
};

export default useGetAlLDeclarations;
