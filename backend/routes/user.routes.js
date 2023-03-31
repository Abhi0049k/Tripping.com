const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { userModel } = require('../models/user.models');
require('dotenv').config();

const userRouter = express.Router();

userRouter.get('/', (req, res)=>{
    res.status(200).send('working fine');
})

userRouter.post('/add',async (req, res)=>{
    const data = req.body;
    const saltRounds = Number(process.env.salt)
    try{
        const email = data.email;
        const user = await userModel.find({email});
        if(user.length>0){
            res.status(200).send({"msg": "User already exist, please login"})
        }else{
            data.password = await bcrypt.hash(data.password, saltRounds);
            const newUser = new userModel(data);
            await newUser.save();
            res.status(200).send({"msg": "Registration Successful"})
        }
    }catch(err){
        res.status(400).send({"err": "Something went wrong"})
    }
})


userRouter.post('/login', async(req, res)=>{
    const data = req.body;
    const secretKey = process.env.secretKey;
    try{
        const {email} = data;
        const user = await userModel.findOne({email});
        let result = await bcrypt.compare(data.password, user.password);
        if(result)
        res.status(200).send({"msg": "Login Successfully", "token": jwt.sign({userId: user._id}, secretKey), "username": `${user.name}`});
        else
        res.status(400).send({"msg": "Wrong Credentials"});
    }catch(err){
        res.status(400).send({"err": "Something went wrong"});
    }
})
userRouter.post('/admin/login', async(req, res)=>{
    const data = req.body;
    const secretKey = process.env.secretKey;
    try{
        const {email} = data;
        const user = await userModel.findOne({email});
        let result = await bcrypt.compare(data.password, user.password);
        if(result && user.role=='admin')
        res.status(200).send({"msg": "Login Successfully", "token": jwt.sign({userId: user._id}, secretKey), "username": `${user.name}`});
        else
        res.status(400).send({"msg": "Wrong Credentials"});
    }catch(err){
        res.status(400).send({"err": "Something went wrong"});
    }
})



module.exports = {
    userRouter
}