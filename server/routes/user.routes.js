import { Router } from 'express';
import { acceptConnectionRequest, downloadProfile, getAllUserProfile, getConnectionsRequests, getMyConnectionRequest, getUserAndProfile, getUserPofileByUserName, login, register, sendConnectionRequest, updateProfileData, updateUserprofile, uploadProfilePic} from '../controllers/user.controllers.js';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route('/upload_profile_pic').post(upload.single('profile_pic'), uploadProfilePic);

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(updateUserprofile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getConnectionsRequests);
router.route("/user/user_connection_request").get(getMyConnectionRequest);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_by_userName").get(getUserPofileByUserName);

export default router;