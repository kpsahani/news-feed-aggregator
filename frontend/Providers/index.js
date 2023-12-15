"use client";
import { Provider } from "react-redux";
import store from "@/store";
import { persistStore } from 'redux-persist';
import { useEffect } from "react";

const Providers = ({ children })=> {

    useEffect(() => {
        // Only load Redux Persist on the client side
        if (typeof window !== 'undefined') {
            const persistor = persistStore(store);
            // Optional: You can dispatch actions here to rehydrate your store
        }
    }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default Providers
