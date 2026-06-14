import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts } from "@/config/redux/Action/PostAction/index"

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
    const [fileContent,setFileContent]=useState();

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

    const handleUplaod=async()=>{
        await dispatch(createPost({file:fileContent,body:postContent}));
        setFileContent();
        setPostcontent("");
        dispatch(getAllPosts());
    }

    if (authState.user) {

        return (
            <UserLayout>
                <DashBoardLayout>
                    <div className={styles.HomeComponent}>
                        <div className={styles.wraper}>
                        <div className={styles.CreatePostContainer}>
                            <img src={`${BASEEURL}/${authState.user.userId.profilePicture}`} className={styles.userProfile}></img>
                            <textarea className={styles.textArea} name="textarea" id="textarea" placeholder={"What's in your mind?"}
                             value={postContent} onChange={(e)=>setPostcontent(e.target.value)}></textarea>
                            <label className={styles.Fab} htmlFor="fileUpload">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </label>
                               <input type="file" hidden id="fileUpload"onChange={(e)=>setFileContent(e.target.files[0])} />
                               {postContent.length >0 &&
                               <div className={styles.UploadFile} onClick={handleUplaod}>Post</div>
    }
                        </div>
                        <div className={styles.postsContainer}>
                        {postsState.posts.map((post)=>{
                            return(
                                <div id={post._id} className={styles.singleCard}>
                                    <div className={styles.singleCard_profile}  id={post._id}>
                                        <img src={`${BASEEURL}/${post.userId.profilePicture}`} alt={post?.userId?.name || "user profile"} />
                                        
                                        <div>
                                            <div style={{display:"flex", gap:"1.2rem",justifyContent:"space-between"}}>
                                                <p style={{margin:0,fontWeight:"bolder"}}>{post.userId.name}</p>
                                               {post.userId._id === authState.user.userId._id &&
                                                <svg style={{height:"1.4em",color:"red",cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>}

                                            </div>
                                            
                                            <p>@{post.userId.userName}</p>
                                            <p>{post.body}</p>
                                            <div className={styles.single_cardImage}>
                                                <img src={`${BASEEURL}/${post.media}`}></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
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