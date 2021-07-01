const RefreshTokens = require("../models/refreshTokens");



const findRefreshToken = async (email) => {
    try {
        const token = await RefreshTokens.findOne({email});
        return {status: "true", result: token}    
    }catch(e){
        return {status: "false", result: { message: e.message}}
    }
}

const addRefreshToken = async ({email,token}) => {
    console.log("email",email,token)
    let lookup = await findRefreshToken(email);

    if(lookup.status){
        let data = await RefreshTokens.findOneAndUpdate({email}, {token})
        if(data){
            return {status: "true", result: { message: data.refreshToken}} 
        }
    }

    try {

        const refreshToken = new RefreshTokens({email,token});
        await refreshToken.save();
        return {status: "true", result: { message: refreshToken}}    

    }catch(e){
        console.log("error in adding refresh token",e.message)
        return {status: "false", result: { message: e.message}}
        
    }
    
}


const removeRefreshToken = async ({email}) => {
    try {
        const refreshToken = await RefreshTokens.findOne({email});

        await refreshToken.remove();
        return {status: "true", result: { message: refreshToken}}    

    }catch(e){
        console.log("error in removing refresh token",e.message)
        return {status: "false", result: { message: e.message}}
        
    }
    
}


module.exports = {addRefreshToken,removeRefreshToken,findRefreshToken}