import { useRouter } from "next/router";
import styles from "./style.module.css";


export default function UserLayout({ children }) {

  const route = useRouter();
  return (
    <div className="user-layout">
       <div className="container d-flex align-items-center justify-content-between py-3 border-bottom border-dark mt-3">
        <div onClick={()=>route.push("/")} className={styles.heading}>
          <h3><span style={{ color: "#000000" }}>Pro</span><span style={{ color: "#0A66C2" }}>Connect</span></h3>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className= {styles.loginBtn} 
            onClick={()=>route.push("/login")}
          >Login</button>
          <button className={styles.signupBtn} onClick={()=>route.push("/signup")} >
            Sign Up
          </button>
        </div>
        </div>
      {children}
    </div>
  )
}