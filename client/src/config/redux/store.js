import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducers/authReducer";
import postReducer from "./Reducers/postRducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer
    }
})