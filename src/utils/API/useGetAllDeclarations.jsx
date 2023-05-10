import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  API_URL,
  CREATE_VOYAGE_ENDPOINT,
  ENDPOINT_DECLARATION_PATH,
} from '../../constants/AppAPIConstants';
import { YOUR_VOYAGES_URL } from '../../constants/AppUrlConstants';
import Auth from '../Auth';
import handleAuthErrors from './handleAuthErrors';

const useGetAllDeclarations = (url) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [serverError, setServerError] = useState(null);

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
    } catch (error) {
      handleAuthErrors({ error, navigate, redirectUrl: YOUR_VOYAGES_URL });
      // when deleting we don't ever return an error message to the user, auth errors are handled others are ignored
    }
    return null;
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setIsLoading(true);
    const fetchData = async () => {
      try {
        const resp = await axios.get(CREATE_VOYAGE_ENDPOINT, {
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

        setIsLoading(false);
      } catch (error) {
        if (error?.code === 'ERR_CANCELED') { return; }
        const errorResponse = handleAuthErrors({ error, navigate, redirectUrl: YOUR_VOYAGES_URL });
        setServerError({ status: errorResponse?.response?.status, message: errorResponse?.message }); // returned to user
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { controller.abort(); };
  }, [url]);

  return { isLoading, apiData, serverError };
};

export default useGetAllDeclarations;
