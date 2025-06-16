import { useLocation } from 'react-router-dom';

const useParams = (paramKey?: string) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const params: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  if (paramKey) {
    return params[paramKey];
  }

  return params;
};

export default useParams;
