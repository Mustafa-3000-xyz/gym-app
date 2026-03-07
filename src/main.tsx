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
// ========================================================== //
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);