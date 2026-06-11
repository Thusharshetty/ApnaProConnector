import UserLayout from "../layout/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { toast } from "react-toastify";
import { registeruser } from "@/config/redux/Action/AuthAction/index"
import { reset } from "@/config/redux/Reducers/authReducer/index.js";


export default function Signup() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const route = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");


    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            route.push("/dashboard");
        }
    }, []);

    useEffect(() => {
        if (authState.isSuccess) {
            toast.success(authState.message, {
                toastId: "signup-success"
            });
            setTimeout(() => {
                route.push("/login");
                dispatch(reset());
            }, 2000);
        }
        if (authState.isError) {
            toast.error(authState.message.message, {
                toastId: "signup-error"
            });
            dispatch(reset());
        }
    }, [authState.isSuccess, authState.isError]);


    const handleSignup = (e) => {
        e.preventDefault();
        if (!username || !name || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        dispatch(registeruser({ username, name, email, password }));
    };

    return (
        <UserLayout>
            <div className={styles.container}>
                <div className={styles.container_left}>
                    <img src="/images/HOME2.svg" alt="Signup" />
                </div>
                <div className={styles.container_right}>
                    <form className={styles.form} onSubmit={handleSignup}>
                        <div className={styles.line}>
                            <h3 style={{ fontFamily: "poppins", fontWeight: "600", fontSize: "1.5rem" }}>
                                <span style={{ color: "#000000" }}>Pro</span>
                                <span style={{ color: "#0A66C2" }}>Connect</span>
                            </h3>
                            <h1 className={styles.heading}>Create Account</h1>
                            <p style={{ color: "#666666", margin: "0.5rem 0 0 0" }}>
                                Sign up to continue building connections.
                            </p>
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
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
                            {authState.isLoading ? "Signing up..." : "Sign Up"}
                        </button>
                        <span className={styles.signup}>
                            Already have an account? <a href="/login">Login</a>
                        </span>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
