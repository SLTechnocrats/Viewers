import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import ViewReport from './components/ViewReport';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="h-full min-w-[20rem] bg-white text-white">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Toaster />
          <ViewReport />
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
