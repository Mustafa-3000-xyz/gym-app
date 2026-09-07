import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./global.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "swiper/css/navigation";
import "swiper/css";
import { Provider } from 'react-redux';
import store from "./Rtk/store";
import { PrimeReactProvider } from 'primereact/api';
// ========================================================== //
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);