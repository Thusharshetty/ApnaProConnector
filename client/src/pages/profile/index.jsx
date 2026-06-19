import React, { useEffect, useState } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, getAllUsers } from '@/config/redux/Action/AuthAction';
import { getAllPosts } from '@/config/redux/Action/PostAction';
import styles from './style.module.css'
import { BASEEURL, clientServer } from '@/config';
import { current } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [userProfile, setUserProfile] = useState({
    userId: {
      name: "",
      userName: "",
      profilePicture: ""
    },
    bio: "",
    currentPost: "",
    pastWork: [],
    education: []
  });
  const [userPosts, setUserposts] = useState([]);
  const [editNow, setEditNow] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");


    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }

  }, []);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [])

  useEffect(() => {
    if (authState?.user && postState?.posts) {
      setUserProfile(authState.user);

      const posts = postState.posts.filter(
        (post) => post?.userId?.userName === authState?.user?.userId?.userName
      );

      setUserposts(posts);
    }
  }, [authState?.user, postState?.posts]);


  const updateProfilePicture = async (file) => {
   try{
     const formData = new FormData();
    formData.append("profile_pic", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post("/upload_profile_pic", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success("Profile Picture Updated Sucessfully")
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
   }catch(e){
     toast.error("Error while Updating the Picture")
   }
  }

  const updateProfileData = async () => {
    try{
      const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      newUserData: {
        name: userProfile?.userId?.name || ""
      }
    })
    
    const res = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
     toast.success("Profile data updated sucessfully")
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }catch(e){
      toast.error("Error while updating the profile data")
    }
  }


  const addExperience=()=>{
    setUserProfile(prev=>({
      ...prev,
      pastWork:[
        ...(prev.pastWork || []),
        {
                position: "",
                company: "",
                years: ""
        }
      ]
    }))
  }
 const handleExperienceChange = (index, field, value) => {
    setUserProfile(prev => {
        const updatedPastWork = [...prev.pastWork];

        updatedPastWork[index] = {
            ...updatedPastWork[index],
            [field]: value
        };

        return {
            ...prev,
            pastWork: updatedPastWork
        };
    });
};
const addEducation = () => {
    setUserProfile(prev => ({
        ...prev,
        education: [
            ...(prev.education || []),
            {
                school: "",
                degree: "",
                fieldOfStudy: ""
            }
        ]
    }));
};
const handleEducationChange = (index, field, value) => {
    setUserProfile(prev => {
        const updatedEducation = [...prev.education];

        updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: value
        };

        return {
            ...prev,
            education: updatedEducation
        };
    });
};
  return (
    <UserLayout>
      <DashBoardLayout>
        {/* 1. Added optional chaining to the guard condition */}
        {authState?.user && userProfile?.userId && (
          <div className={styles.profileContainer}>
            <div className={styles.backdropContainer}>
              <label className={styles.backdrop_overlay} htmlFor='profilePictureUpload'>
                <p style={{ margin: "0", padding: "0", fontWeight: "bolder" }}>Edit</p>
              </label>
              <input
                type="file"
                id='profilePictureUpload'
                hidden
                onChange={(e) => updateProfilePicture(e.target.files[0])}
              />
              {/* 2. Added optional chaining here */}
              <img
                src={`${BASEEURL}/${userProfile?.userId?.profilePicture}`}
                className={styles.profileImage}
                alt="Profile"
              />
            </div>

            <div className={styles.profileBody}>
              <div className={styles.nameSection}>
                {/* 3. Added optional chaining here */}
                {editNow ? (
                  <input
                    type='text'
                    value={userProfile?.userId?.name || ""}
                    onChange={(e) => {
                      setUserProfile(prev => ({
                        ...prev,
                        userId: {
                          ...(prev.userId || {}),
                          name: e.target.value
                        }
                      }))
                    }}
                    className={`${styles.editInput} ${styles.editAnimation}`}
                  />
                ) : (
                  <h1>{userProfile?.userId?.name}</h1>
                )}
                {/* 4. Added optional chaining here */}
                <p className={styles.username}>
                  @{userProfile?.userId?.userName}
                </p>
              </div>

              <div className={styles.sectionCard}>
                <h2>About</h2>
                {editNow ? 
                <textarea
                  value={userProfile?.bio || " "}
                  onChange={(e)=>{
                    setUserProfile(prev => ({
                        ...prev,
                       bio:e.target.value
                      }))
                  }}
                  rows={Math.max(3,Math.ceil(userProfile.bio.length /80))}
                  style={{width:"100%"}}
                  className={`${styles.editTextarea} ${styles.editAnimation}`}
                ></textarea>
                :  <p>{userProfile?.bio || "No bio available"}</p>}
               
              </div>
<div className={styles.sectionCard}>
    <h2>Experience</h2>

    <div className={styles.workHistoryContainer}>

        {userProfile?.pastWork?.length === 0 && !editNow && (
            <div className={styles.workHistoryCard}>
                <h3>No Work Experience Yet 🚀</h3>
            </div>
        )}

        {userProfile?.pastWork?.filter(work => work.position || work.company || work.years || editNow).map((work, index) => (
            <div key={index} className={styles.workHistoryCard}>

                {editNow ? (
                    <>
                        <input
                            className={styles.editInput}
                            placeholder="Position"
                            value={work.position}
                            onChange={(e) =>
                                handleExperienceChange(
                                    index,
                                    "position",
                                    e.target.value
                                )
                            }
                        />

                        <input
                            className={styles.editInput}
                            placeholder="Company"
                            value={work.company}
                            onChange={(e) =>
                                handleExperienceChange(
                                    index,
                                    "company",
                                    e.target.value
                                )
                            }
                        />

                        <input
                            className={styles.editInput}
                            placeholder="Years"
                            value={work.years}
                            onChange={(e) =>
                                handleExperienceChange(
                                    index,
                                    "years",
                                    e.target.value
                                )
                            }
                        />
                    </>
                ) : (
                    <>
                        <h3>{work.position}</h3>
                        <p>{work.company}</p>
                        <span>{work.years}</span>
                    </>
                )}

            </div>
        ))}

        {editNow && (
            <button
                className={styles.addExperienceButton}
                onClick={addExperience}
            >
                + Add Experience
            </button>
        )}

    </div>
</div>

<div className={styles.sectionCard}>
    <h2>Education</h2>

    <div className={styles.workHistoryContainer}>

        {userProfile?.education
            ?.filter(edu => edu.school || edu.degree || edu.fieldOfStudy || editNow)
            ?.map((edu, index) => (

                <div key={index} className={styles.workHistoryCard}>

                    {editNow ? (
                        <>
                            <input
                                className={styles.editInput}
                                placeholder="School"
                                value={edu.school}
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "school",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className={styles.editInput}
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "degree",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className={styles.editInput}
                                placeholder="Field Of Study"
                                value={edu.fieldOfStudy}
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "fieldOfStudy",
                                        e.target.value
                                    )
                                }
                            />
                        </>
                    ) : (
                        <>
                            <h3>{edu.school}</h3>
                            <p>{edu.degree}</p>
                            <span>{edu.fieldOfStudy}</span>
                        </>
                    )}

                </div>
            ))}

        {editNow && (
            <button
                className={styles.addExperienceButton}
                onClick={addEducation}
            >
                + Add Education
            </button>
        )}
    </div>
</div>

              {/* Recent Activity */}
              <div className={styles.sectionCard}>
                <h2>Recent Activity</h2>
                <div className={styles.activityContainer}>
                  {userPosts.map(post => (
                    <div key={post._id} className={styles.activityCard}>
                      {post.media && (
                        <img
                          src={`${BASEEURL}/${post.media}`}
                          className={styles.activityImage}
                          alt="Activity"
                        />
                      )}
                      <div className={styles.activityContent}>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {editNow ? (
              <button
                className={styles.edit_button}
                onClick={() => {
                  updateProfileData();
                  setEditNow(false);
                }}
              >
                Update Profile
              </button>
            ) : (
              <button
                className={styles.edit_button}
                onClick={() => setEditNow(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}
