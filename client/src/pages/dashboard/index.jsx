import { useEffect ,useState} from "react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";


export default function Dashboard() {
      const route = useRouter();

 useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        route.push("/login");
    }
}, []);

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}