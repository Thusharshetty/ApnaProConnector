import  {Router} from 'express';
import { downloadProfile, getAllUserProfile, getUserAndProfile, login, register, updateProfileData, updateUserprofile, uploadProfilePic } from '../controllers/user.controllers.js';
import multer from 'multer';

const router=Router();

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
}) ;

const upload=multer({storage:storage});

router.route('/upload_profile_pic').post(upload.single('profile_pic'),uploadProfilePic);

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(updateUserprofile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);

export default router;