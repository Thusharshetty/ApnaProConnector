import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "./layout/Navbar";


export default function Home() {
  const route = useRouter();
  return (
    <UserLayout>
      <div className={`py-5 px-5 ${styles.container} border-1 border-dark`}>
        <div className={`d-flex align-items-center justify-content-center gap-5 p-5 mx-auto justify-content-between ${styles.mainContainer}`}>

          <div className={styles.mainContainer__left}>
            <h1 className={styles.heading}>Connect with Friends without Exaggeration</h1>
            <p className={styles.subheading}>A True social media platform, with stories no blufs !</p>
            <button onClick={() => route.push("/login")} className={styles.buttonJoin}>
              Join Now
            </button>
          </div>
          
          <div className={`p-5 ${styles.mainContainer__right}`}>
            <img src="/images/HOME.svg" alt="home" />
          </div>

        </div>
      </div>
    </UserLayout>
  );
}
