require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const RefreshTokens = require("../controllers/refreshTokenController");

const {signUp,loginUser,findUser, findUserByUsername} = require("../controllers/userController");

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
        console.log("happend here")
        res.status(403).json({message: "Wrong token"+e.message})
    }
}




router.post("/signup",async (req,res) => {
    let user = await signUp(req.body);
    if(user.status){
        res.status(201).json(user.result);

    }else{
        res.status(400).json(user.result)
    }

})


router.post("/login", async (req,res) => {
    let response = await loginUser(req.body);
    if(response.status){
        let payload = {email: response.result.email};
        let token = jwt.sign(payload,process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRY} )
        let refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
        await RefreshTokens.addRefreshToken({email: response.result.email,token: refreshToken});
        res.status(201).json({token,refreshToken})
    } else{
        res.status(400).json(response.result)
    }

})


router.post("/token", async (req,res) => {

    const {refreshToken} = req.body;
    const response = await RequestTokens.findRefreshToken(refreshToken)

    if(!refreshToken || !response.status ){
        res.status(403)
    }

    try{
        let refreshTokenPayload = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        let newPayload = {email: refreshTokenPayload.email}
        let token = jwt.sign(newPayload,process.env.TOKEN_SECRET, { expiresIn : process.env.TOKEN_EXPIRY})
        res.status(200).json({token})

    } catch(e){
        console.log("error in token",e.message)
        res.status(401).json({error: "token expired"})
        // delete refresh token from db
    }


})


router.get("/signout", async (req,res) => {
    let {email} = req.body;
    const reponse = await RequestTokens.findRefreshToken(email);
    if(!email || !response.status){
        res.status(403).json({"message": "Invalid Request"})
    }
    try {
        let result = await RequestTokens.removeRefreshToken(email);
        res.status(200).json({"message": "User has been logged out"})
    }catch(e){
        res.status(400).json({"error": e.message})
    }

})


router.post("/follow/:username",validateRequest, async (req,res) => {
    let {username}= req.params;
    let originalUser = await findUser(req.userEmail)
    let follower = await findUserByUsername(username);
    // console.log("follower",follower)
    console.log("user",originalUser,req.userEmail)
    if(originalUser.status && follower.status){
        await originalUser.result.message.updateOne({$push: { followers: follower.result.message._id }})
        res.status(200).json({"message": "you are now following "+username})
        return;
    }
    res.status(400).json({"message": "something went wrong"});
    return;
})

router.post("/unfollow/:username",validateRequest, async (req,res) => {
    let {username}= req.params;
    let originalUser = await findUser(req.userEmail)
    let follower = await findUserByUsername(username);

    let checkFollowing = originalUser.result.message.followers.includes(follower._id);

    if(originalUser.status && follower.status && checkFollowing){
        await originalUser.result.message.update({$pull: { followers: follower.result.message._id }})
        res.status(200).json({"message": "you are not following "+username})
        return;
    }
    res.status(400).json({"message": "something went wrong"});
    return;
})





module.exports = router