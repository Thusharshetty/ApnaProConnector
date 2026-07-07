import 'bootstrap/dist/css/bootstrap.min.css'
import "@/styles/globals.css";
import { Provider } from "react-redux";
import {store} from "@/config/redux/store.js"; 
import { ToastContainer } from "react-toastify";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return <>
  <Provider store={store}>
    <Head>
        <title>ProConnect</title>
        {/* <link rel="icon" href="/favicon.ico" /> */} 
      </Head>
    <Component {...pageProps} />
    <ToastContainer />
  </Provider>
  </>
  
}
