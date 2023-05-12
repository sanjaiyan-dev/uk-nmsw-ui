import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../Auth';
import handleAuthErrors from './handleAuthErrors';

const useGetData = ({ redirectUrl, url }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // setIsLoading(true);
    const fetchData = async () => {
      try {
        const resp = await axios.get(url, {
          signal,
          headers: { Authorization: `Bearer ${Auth.retrieveToken()}` },
        });
        const data = await resp?.data;

        setApiData(data);

        // setIsLoading(false);
      } catch (err) {
        if (err?.code === 'ERR_CANCELED') { return; }
        const errorResponse = handleAuthErrors({ error: err, navigate, redirectUrl });
        setError({ status: errorResponse?.response?.status, message: errorResponse?.message });
        // setIsLoading(false);
      }
    };

    fetchData();
    return () => { controller.abort(); };
  }, [url]);

  return {
    apiData, error, isLoading,
  };
};

export default useGetData;
