import { FC, ReactElement, useEffect, useState } from 'react';
import axios from 'axios';

interface AxiosInterceptorProps {
  children: ReactElement;
}

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

export const AxiosInterceptor: FC<AxiosInterceptorProps> = ({ children }) => {
  const [isToken, setIsToken] = useState(false);
  
  const dummyToken = 'Token added';

  useEffect(() => {
    axiosInstance.interceptors.request.use(async (request) => {
      try {
        request.headers['Authorization'] = `Bearer ${dummyToken}`;
        return request;
      } catch (error) {
        return Promise.reject(error);
      }
    });

    setIsToken(true);
  }, []);

  return isToken ? children : <></>;
}

export default axiosInstance;
