import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { store } from "./app/store";
import ThemeProvider from "./theme/ThemeProvider";
import Toasts from "./components/Toasts";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <App />
        <Toasts />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
