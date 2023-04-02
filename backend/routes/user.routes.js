const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { userModel } = require('../models/user.models');
const { authorization } = require('../middlewares/authorization.middleware');
require('dotenv').config();

const userRouter = express.Router();

/**
 * @swagger
 *  components:
 *      schemas: 
 *          user:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      description: The auto-generated id by mongo DB
 *                  name: 
 *                      type: string
 *                      description: User's name
 *                  email:
 *                      type: string
 *                      description: User's email    
 *                  password:
 *                      type: string
 *                      description: User's password
 *                  role: 
 *                      type: string
 *                      description: check whether the user is an admin or not
 *                  booking:
 *                      type: array
 *                      description: store all the booking
 */

/**
 * @swagger
 * /user:
 *  get/id:
 *      summary: This route is to get user details one at a time from the database.
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: This route will give you the details of the user you requested for
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object  
 *                          item:
 *                              $ref: "#/components/schemas/user"
 *          400:
 *              descriptiong: Bad Request
 */

userRouter.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const user = await userModel.findById({_id: id});
        res.status(200).send(user);
    }catch(err){
        res.status(400).send({"err": "Something went wrong"});
    }
})


/**
 * @swagger
 * /user/add:
 *  post:
 *      summary: To post a new user to the database
 *      tags: [Users]
 *      requestedBody:
 *          required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/user"
 *      responses:
 *          200:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/user"
 *          400:
 *              description: Bad Request
 */

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

/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: For login purpose
 *      tags: [Users]
 *      requestedBody:
 *          required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/user"
 *      responses:
 *          200:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/user"
 *          400:
 *              description: Bad Request
 */

userRouter.post('/login', async(req, res)=>{
    const data = req.body;
    const secretKey = process.env.secretKey;
    try{
        const {email} = data;
        const user = await userModel.findOne({email});
        let result = await bcrypt.compare(data.password, user.password);
        if(result)
        res.status(200).send({"msg": "You have successfully logged in", "token": jwt.sign({userId: user._id}, secretKey), "username": `${user.name}`, "UserId": user._id});
        else
        res.status(400).send({"msg": "Wrong Credentials"});
    }catch(err){
        res.status(400).send({"err": "Something went wrong"});
    }
})

/**
 * @swagger
 * /user/update/id:
 *  patch:
 *      summary: To alter the details of a particular user
 *      tags: [Users]
 *      requestedBody:
 *          required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/user"
 *      responses:
 *          200:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/user"
 *          400:
 *              description: Bad Request
 */

userRouter.patch('/update/:id', async (req, res)=>{
    const {id} = req.params
    const data = req.body;
    try{
        console.log(data);
        await userModel.findByIdAndUpdate({_id: id}, data);
        res.status(200).send({"msg": "Booking added in the user database"});
    }catch(err){
        res.status(400).send({"err": "Something went wrong"});
    }
})
/**
 * @swagger
 * /user/admin/Login:
 *  post:
 *      summary: For login purpose only for admin
 *      tags: [Users]
 *      requestedBody:
 *          required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/user"
 *      responses:
 *          200:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/user"
 *          400:
 *              description: Bad Request
*/

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

userRouter.use(authorization);
/**
 * @swagger
 * /user:
 *  get:
 *      summary: To Fetch details of all the users, only admin can access all the details
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: This route will give you the details of all the users currently present in the database, only admin can access all the details
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object  
 *                          item:
 *                              $ref: "#/components/schemas/user"
 *          400:
 *              descriptiong: Bad Request
 */

userRouter.get('/', async (req, res)=>{
    try{
        const data = await userModel.find();
        res.status(200).send(data);
    }catch(err){
        res.status(400).send({"err": "Something Went wrong"});
    }
})



module.exports = {
    userRouter
}
