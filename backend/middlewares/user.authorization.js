const { blackTokenModel } = require("../models/blackToken.model");
const jwt = require('jsonwebtoken');
const { userModel } = require("../models/user.model");
require('dotenv').config();

const userAuthorization = async(req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        let blacktoken = await blackTokenModel.find({token});
        if(blacktoken.length!==0) return res.status(400).send({msg: 'Login Again'});
        let decode;
        try{
            decode = jwt.verify(token, process.env.SECRET_KEY);
        }catch(err){
            if (err instanceof jwt.TokenExpiredError) return res.status(400).send({msg: 'Token has expired'});
            else throw err;
        }
        if(!decode) return res.status(400).send({msg: 'Login Again'});
        const userExist = await userModel.findById(decode.userId);
        if(!userExist) return res.status(400).send({msg: 'Login Again'});
        req.body.userId = userExist._id;
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

module.exports = {
    userAuthorization
}