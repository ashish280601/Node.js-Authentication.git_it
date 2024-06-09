import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "../store.jsx";

// importing notification library
import { SnackbarProvider } from "notistack";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={4}
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </SnackbarProvider>
  </React.StrictMode>
);
