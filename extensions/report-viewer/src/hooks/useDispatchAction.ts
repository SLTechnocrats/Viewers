import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

export default function useDispatchAction() {
  return useDispatch<ThunkDispatch<any, any, any>>();
}
