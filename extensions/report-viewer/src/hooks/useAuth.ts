import { useSelector } from 'react-redux';
import { RootStateProps } from '../store/store';

export default function useAuth() {
  return useSelector((state: RootStateProps) => state.auth);
}
