import  {Router} from 'express';
import { activeCheck, commentPost, createPost, deletecomment, deletePost, getAllPosts, getComments_post, likePost } from '../controllers/posts.controllers.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
});

const upload = multer({ storage: storage });

const router=Router();

router.route('/').get(activeCheck);
router.route("/post/create").post(upload.single('media'),createPost);
router.route("/posts").get(getAllPosts);
router.route("/post/delete").delete(deletePost);
router.route("/post/comment").post(commentPost);
router.route("/comments/:post_id").get(getComments_post);
router.route("/post/comment/delete").delete(deletecomment);
router.route("/posts/like").post(likePost)

export default router;