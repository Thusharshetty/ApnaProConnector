import UserLayout from "../layout/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { toast } from "react-toastify";
import { loginuser } from "@/config/redux/Action/AuthAction/index"
import { reset } from "@/config/redux/Reducers/authReducer/index.js";


export default function Login() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const route = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            route.push("/dashboard");
        }
    }, []);


    useEffect(() => {
        if (authState.isSuccess) {
            toast.success(authState.message, {
                toastId: "login-success"
            });
            setTimeout(() => {
                route.push("/dashboard");
                dispatch(reset());
            }, 2000);
        }

        if (authState.isError) {
            toast.error(authState.message.message, {
                toastId: "login-error"
            });
            dispatch(reset());
        }
    }, [authState.isSuccess, authState.isError]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        dispatch(loginuser({ email, password }));
    };

    return (
        <UserLayout>
            <div className={styles.container}>
                <div className={styles.container_left}>
                    <img src="/images/HOME2.svg" alt="Login" />
                </div>
                <div className={styles.container_right}>
                    <form className={styles.form} onSubmit={handleLogin}>
                        <div className={styles.line}>
                            <h3 style={{ fontFamily: "poppins", fontWeight: "600", fontSize: "1.5rem" }}>
                                <span style={{ color: "#000000" }}>Pro</span>
                                <span style={{ color: "#0A66C2" }}>Connect</span>
                            </h3>
                            <h1 className={styles.heading}>Welcome Back !</h1>
                            <p style={{ color: "#666666", margin: "0.5rem 0 0 0" }}>
                                Sign in to continue building connections.
                            </p>
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" disabled={authState.isLoading}>
                            {authState.isLoading ? "Logging in..." : "Login"}
                        </button>
                        <span className={styles.signup}>
                            Don't have an account? <a href="/signup">Sign Up</a>
                        </span>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
