import 'bootstrap/dist/css/bootstrap.min.css'
import "@/styles/globals.css";
import { Provider } from "react-redux";
import {store} from "@/config/redux/store.js"; 
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
  return <>
  <Provider store={store}>
    <Component {...pageProps} />
    <ToastContainer />
  </Provider>
  </>
  
}
