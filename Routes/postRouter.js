require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const {createPost, deletePost,findPost} = require('../controllers/postController');
const {signUp,loginUser,findUser, findUserByID} = require("../controllers/userController");

const validateRequest = (req,res,next) => {

    let authHeader = req.headers['authorization'];
    if(!authHeader){
        res.status(403).json({message: 'No header in request'})
        return;
    }
    let token = authHeader.split(" ")[1];
    console.log(token)
    if(!token){
        res.status(403).json({message: 'No token in request'})
        return;
    }
    try {
       let decoded = jwt.verify(token,process.env.TOKEN_SECRET)
        
        req.userEmail = decoded.email; 
        console.log("decoded",req.userEmail)
        next();
    } catch (e){
        res.status(403).json({message: "Wrong token"+e.message})
    }
}

router.post("/",validateRequest, async (req,res) => {

    try {
    let user = await findUser(req.userEmail);
    let payload = {"owner": user.result.message._id, "content": req.body}
    let post = await createPost(paylod);
    await user.result.message.update({$push: {posts : post.result.message._id}})
    res.status(201).json({"message": "post created"})
    }catch(e) {
        res.status(400).json({"message": "post can not be created"})
    }   
})


router.delete("/:postId",validateRequest, async (req,res) => {
    let {postId}  = req.params

    let post = await findPost(postId);
    let user = await findUserByID(post.result.message.owner)

    if(post.status){
        await user.result.message.update({$pull: {posts: postId}})
        let deleted = await deletePost(postId);
        if(deleted){
            
            res.status(200).json(deleted);

            return;
        }
        res.status(404).json({'response': 'cant delete post'})
        return;
    }
    res.status(404).json({'response': 'cant find user or post'})
    return;
   
})


module.exports = router