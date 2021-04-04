import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from './useNotification';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { notificate } = useNotification();

  const cancelReq = useRef(null);

  const request = useCallback(async (url, method = 'get', body = {}) => {
    setLoading(true);
    try {
      const { data } = await axios({
        method,
        url,
        data: body,
        cancelToken: new axios.CancelToken(cancel => {
          cancelReq.current = cancel;
        }),
      });
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      if (!axios.isCancel(error)) {
        setError(error.message);
      }
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (error) {
      notificate('Something went wrong', error, 'error');
      clearError();
    }
  }, [error, notificate, clearError]);

  return {
    request,
    loading,
    error,
    clearError,
    cancelRequest: cancelReq.current,
  };
};
