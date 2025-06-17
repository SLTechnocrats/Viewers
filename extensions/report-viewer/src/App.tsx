import React, { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import ViewReport from './components/ViewReport';
import { Toaster } from 'react-hot-toast';
import useParams from './hooks/useParams';

const App = () => {
  const { bearer: token } = useParams();

  useEffect(() => {
    console.log(token, 'token');
  }, [token]);

  return (
    <>
      {token ? (
        <div className="h-full max-h-[120vh] overflow-x-hidden min-w-[20rem] overflow-y-scroll bg-white text-white">
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <Toaster />
              <ViewReport />
            </PersistGate>
          </Provider>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-purple-700">
          <h1 className="text-2xl">You are not authorized to view the panel</h1>
        </div>
      )}
    </>
  );
};

export default App;
