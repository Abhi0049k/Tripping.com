const express = require('express');
const { authorization } = require('../middlewares/authorization.middleware');
const { bookModel } = require('../models/book.models');
const { userauthorization } = require('../middlewares/userauthorization.middlewares');

const bookingRouter = express.Router();

bookingRouter.post('/book', userauthorization, async (req, res)=>{
    const data = req.body
    try{
        const newBooking = new bookModel(data);
        await newBooking.save();
        res.status(200).send({"msg": "Booking Confirmed", "bookingId": newBooking._id});
    }catch(err){
        res.status(400).send({"err": "Something Went wrong!!!"});
    }
})

bookingRouter.get('/:id', async (req, res)=>{
    let {id} = req.params;
    try{
        const data = await bookModel.find({userId: id});
        res.status(200).send(data);
    }catch(err){
        res.status(400).send({"err": "Something Went wrong"});
    }
})

bookingRouter.delete('/:id', async (req, res)=>{
    let {id} = req.params;
    try{
        await bookModel.findByIdAndDelete(id);
        res.status(200).send({"msg": "Booking Cancelled"});
    }catch(err){
        res.status(400).send({"err": "Something Went Wrong"});
    }
})

bookingRouter.use(authorization);
bookingRouter.get('/', async(req, res)=>{
    try{
        const data = await bookModel.find();
        res.status(200).send(data);
    }catch(err){
        console.log(err.message);
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})


module.exports = {
    bookingRouter
}