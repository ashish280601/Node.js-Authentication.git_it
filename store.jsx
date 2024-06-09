import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./src/redux/authSlice";

const store = configureStore({
    reducer:{
        auth: authReducer
    }
});

export default store