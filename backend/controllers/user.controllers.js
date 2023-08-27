const jwt = require('jsonwebtoken');
const { userModel } = require("../models/user.model");
const { hash, compare } = require("bcrypt");
const { blackTokenModel } = require('../models/blackToken.model');
require('dotenv').config();

const register = async (req, res)=>{
    try{
        let {name, email, password} = req.body;
        let userExist = await userModel.findOne({email});
        if(userExist) return res.status(400).send({msg: 'User Already Exists'});
        password = await hash(password, Number(process.env.SALT_ROUNDS));
        const newUser = new userModel({name, email, password});
        await newUser.save();
        res.status(200).send({msg: 'User Created'});
    }catch(err){
        console.log('/user/register: ', err.message);
        res.status(500).send({msg: err.message});
    }
}

const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const isUserValid = await userModel.findOne({email});
        if(!isUserValid) return res.status(404).send({msg: "Wrong Credentials"});
        const result = await compare(password, isUserValid.password);
        if(result){
            const access_token = jwt.sign({userId: isUserValid._id}, process.env.SECRET_KEY, {expiresIn: '24h'});
            return res.status(200).send({msg: 'Login Successful', token: access_token, 'username': isUserValid.name});
        }
        return res.status(404).send({msg: 'Wrong Credentials'});
    }catch(err){
        console.log("/user/login: ", err.message);
        res.status(500).send({msg: err.message});
    }
}

const adminLogin = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const isUserValid = await userModel.findOne({email});
        if(!isUserValid) return res.status(404).send({msg: "Wrong Credentials"});
        const result = await compare(password, isUserValid.password);
        if(result){
            if(isUserValid.role==='admin'){
                const access_token = jwt.sign({userId: isUserValid._id}, process.env.SECRET_KEY, {expiresIn: '12h'});
                return res.status(200).send({msg: 'Login Successful', access_token, 'user': isUserValid.name, 'userId': isUserValid._id });
            }
            return res.status(404).send({msg: 'You are not authorized'});
        }
        return res.status(404).send({msg: 'Wrong Credentials'});
    }catch(err){
        console.log("/user/login: ", err.message);
        res.status(500).send({msg: err.message});
    }
}

const logout = async(req, res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        let newBlackToken = new blackTokenModel({token});
        await newBlackToken.save();
        res.status(200).send({msg: 'Logout Successful'});
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

const userDetails = async(req, res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId).select('name email');
        res.status(200).send(user);
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

const updateDetails = async(req, res)=>{
    try{
        const {userId, name, email} = req.body;
        await userModel.findByIdAndUpdate(userId, {name, email});
        res.status(200).send({msg: 'User Details Updated'});
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

const updatePassword = async(req, res)=>{
    try{
        let {userId, password} = req.body;
        password = await hash(password, Number(process.env.SALT_ROUNDS));
        await userModel.findByIdAndUpdate(userId, {password});
        res.status(200).send({msg: 'Password Updated'});
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

module.exports = {
    register, login, adminLogin, logout, userDetails, updateDetails, updatePassword
}