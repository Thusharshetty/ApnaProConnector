import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/Action/PostAction/index"

import { toast } from "react-toastify";
import { getAboutUser, getAllUsers } from "@/config/redux/Action/AuthAction";
import UserLayout from "../layout/Navbar";
import DashBoardLayout from "../layout/DashboardLayout";
import styles from './style.module.css';
import { BASEEURL } from "@/config";


export default function Dashboard() {
    const route = useRouter();
    const dispatch = useDispatch();
    const postsState = useSelector((state) => state.posts);
    const authState = useSelector((state) => state.auth);
    const [postContent,setPostcontent]=useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token }));
        }

        if (!authState.all_profileFetched) {
            dispatch(getAllUsers());
        }
    }, []);

    if (authState.user) {

        return (
            <UserLayout>
                <DashBoardLayout>
                    <div className={styles.HomeComponent}>
                        <div className={styles.CreatePostContainer}>
                            <img src={`${BASEEURL}/${authState.user.userId.profilePicture}`} className={styles.userProfile}></img>
                            <textarea className={styles.textArea} name="textarea" id="textarea" placeholder={"What's in your mind?"}
                             value={postContent} onChange={(e)=>setPostcontent(e.target.value)}></textarea>
                            <label className={styles.Fab} htmlFor="fileUpload">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </label>
                               <input type="file" hidden id="fileUpload" />
                               {postContent.length >0 &&
                               <div className={styles.UploadFile}>Post</div>
    }
                        </div>

                    </div>
                </DashBoardLayout>
            </UserLayout>
        )

    } else {
        return (
            <UserLayout>
                <DashBoardLayout>
                    <h1>Loading.......</h1>
                </DashBoardLayout>
            </UserLayout>
        )

    }
}