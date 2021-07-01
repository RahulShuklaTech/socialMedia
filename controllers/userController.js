const User = require("../models/userModel");
const bcrypt = require("bcrypt");



const signUp = async ({username, email, password}) => {
    let emailRegex = /.*@*\../;
    if(!emailRegex.test(email)){
        return {status: false, result: {message: "Invalid Email"}};

    }
    if(!password) {
        return {status: false, result : {message: "Password is required"}};

    }
    if(!username) {
        return {status: false, result : {message: "username is required"}};

    }

    let hash = await bcrypt.hash(password, 10);

    try {
        let user = new User ({username,email,password: hash});
        let savedUser = await user.save();
        return {status: true, result : {message: savedUser}};
    }catch(e){
        console.log(e.message);
        return {status: false, result : {message: e.message}};   
    }

}

const loginUser = async ({email,password}) => {
    try{
        let user = await User.findOne({email});
        if(!user){
            return {status: false, result: {message: "invalid email"}}
        }
        let result = await bcrypt.compare(password,user.password);
        if(!result){
            return{status: false, result: {message: "invalid password"}}
        }
        return {status: true, result: user }
    }catch(e){

        return {status: false, result: {message: e.message }}
    }
}

const findUser = async (email) => {
    try{
        let user = await User.findOne({email});
        if(user == null){
            return {status: false, result: {message: "invalid email"}}
        }
        return {status: true, result: {message: user}}
    }catch(e){
        return {status: false, result: {message: e.message}};
    }
}




module.exports = {signUp,loginUser,findUser}