import { useEffect ,useState} from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/Action/PostAction/index"

import { toast } from "react-toastify";
import { getAboutUser } from "@/config/redux/Action/AuthAction";
import UserLayout from "../layout/Navbar";


export default function Dashboard() {
      const route = useRouter();
      const dispatch = useDispatch();
      const postsState = useSelector((state) => state.posts);
      const authState = useSelector((state) => state.auth);
      const [isTokenThere, setIsTokenThere] = useState(false);

 useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        route.push("/login");
    }
    setIsTokenThere(true);
}, []);

useEffect(() => {
    if (isTokenThere) {
        dispatch(getAllPosts());
        dispatch(getAboutUser({token : localStorage.getItem("token")}));
    }
},[isTokenThere]);


    return (
        <UserLayout>
           {authState.profileFetched && <h1>Welcome, {authState.user.userId.name}!</h1>}
            <h1>Dashboard</h1>
        </UserLayout>
    )
}