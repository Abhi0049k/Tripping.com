const { blackTokenModel } = require("../models/blackToken.model");
const { bookModel } = require("../models/book.model");
const { userModel } = require("../models/user.model");
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userBookingAuthentication = async(req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1] || req.headers.authorization;
        let blacktoken = await blackTokenModel.find({token});
        if(blacktoken.length!==0) return res.status(400).send({msg: 'Login Again'});
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode) return res.status(400).send({msg: 'Login Again'});
        const userExist = await userModel.findById(decode.userId);
        if(!userExist) return res.status(400).send({msg: 'Login Again'});
        const { id } = req.params;
        const booking = await bookModel.findById(id);
        if(!booking) return res.status(400).send({msg: 'No Such Booking Found'});
        if(String(userExist._id) != String(booking.userId))
        return res.status(400).send({msg: 'You are not authorized to perform the task'});
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

module.exports = {userBookingAuthentication};