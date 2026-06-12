import { useEffect ,useState} from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/Action/PostAction/index"

import { toast } from "react-toastify";
import { getAboutUser } from "@/config/redux/Action/AuthAction";
import UserLayout from "../layout/Navbar";
import DashBoardLayout from "../layout/DashboardLayout";


export default function Dashboard() {
      const route = useRouter();
      const dispatch = useDispatch();
      const postsState = useSelector((state) => state.posts);
      const authState = useSelector((state) => state.auth);


useEffect(() => {
    if (authState.isTokenThere) {
        dispatch(getAllPosts());
        dispatch(getAboutUser({token : localStorage.getItem("token")}));
    }
},[authState.isTokenThere]);


    return (
        <UserLayout>
           <DashBoardLayout>
             <div>
                <h1>DashBoard</h1>
             </div>
           </DashBoardLayout>
        </UserLayout>
    )
}