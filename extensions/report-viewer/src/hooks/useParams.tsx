import { useLocation } from 'react-router-dom';

const useParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const params: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

export default useParams;

