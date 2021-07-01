const Post = require("../models/postModel");



const createPost = async ({owner,content}) => {
    
    try{
    let post = new Post({owner,content})
    let savedPost = await post.save();
    return {status: true, result : {message: savedPost}};
    }catch(e){
        return {status: false, result : {message: e.message}}; 
    }
}


const deletePost = async (id) => {
    try{
        let data = await Post.findOne({_id:id});
        console.log("datg", data)
        let result = await data.remove();
        return result;
    }catch(e){
        console.log(e.message)
        return false;
    }
}


const findPost = async (id) => {
    try{
        let post = await Post.findOne({_id: id});
        if(!post){
            return {status: false, result: {message: "invalid post id"}}
        }
        return {status: true, result: {message: post}}
    }catch(e){
        return {status: false, result: {message: e.message}};
    }
}


const postDetail = async (id) => {
    try{
    let post = await findPost(id).populate("users");
    return {status: true, result: {message: post}}
    }catch(e){
        return {status: false, result: {message: e.message}};
    }
}
 




module.exports = {createPost, deletePost,findPost}