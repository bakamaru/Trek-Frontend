import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./theme.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";

import { ThemeProvider } from "./context/ThemeContext.tsx";
import { store } from "./redux/stores";
import { ToastContainer, toast } from 'react-toastify';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
