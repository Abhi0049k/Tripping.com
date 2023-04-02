const express = require('express');
const { authorization } = require('../middlewares/authorization.middleware');
const { bookModel } = require('../models/book.models');
const { userauthorization } = require('../middlewares/userauthorization.middlewares');

const bookingRouter = express.Router();


/**
 * @swagger
 *  components:
 *      schemas: 
 *          book:
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
 *                  age:
 *                      type: integer
 *                      description: User's age
 *                  checkin: 
 *                      type: string
 *                      description: checkin date
 *                  checkout:
 *                      type: string
 *                      description: checkout date
 *                  adhaarNo:
 *                      type: integer
 *                      description: adhaar no
 *                  placeId:
 *                      type: string
 *                      description: place id that is booked by the user
 *                  userId:
 *                      type: string    
 *                      description: user Id which was used to make the booking
 */


/**
 * @swagger
 * /booking/book:
 *  post:
 *      summary: To book a place 
 *      tags: [Booking]
 *      requestedBody:
 *          required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/book"
 *      responses:
 *          200:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/book"
 *          400:
 *              description: Bad Request
 */

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

/**
 * @swagger
 * /booking/id:
 *  get:
 *      summary: To fetch the booking for a particular user.
 *      tags: [Booking]
 *      responses:
 *          200:
 *              description: This route will give you the details of all the bookings for the user
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array 
 *                          item:
 *                              $ref: "#/components/schemas/place"
 *          400:
 *              descriptiong: Bad Request
 */


bookingRouter.get('/:id', async (req, res)=>{
    let {id} = req.params;
    try{
        const data = await bookModel.find({userId: id});
        res.status(200).send(data);
    }catch(err){
        res.status(400).send({"err": "Something Went wrong"});
    }
})

/**
 * @swagger
 * /booking/id:
 *  delete:
 *      summary: To cancel the booking for a particular user.
 *      tags: [Booking]
 *      responses:
 *          200:
 *              description: This route is used for cancelling the booking that were made by the user
 *          400:
 *              descriptiong: Bad Request
 */

bookingRouter.delete('/:id', async (req, res)=>{
    let {id} = req.params;
    try{
        await bookModel.findByIdAndDelete(id);
        res.status(200).send({"msg": "Booking Cancelled"});
    }catch(err){
        res.status(400).send({"err": "Something Went Wrong"});
    }
})

/**
 * @swagger
 * /booking:
 *  get:
 *      summary: To Fetch details of all the bookings.
 *      tags: [Booking]
 *      responses:
 *          200:
 *              description: This route will give you the booking of all the users currently present in the database, only admin can access all the details
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array 
 *                          item:
 *                              $ref: "#/components/schemas/place"
 *          400:
 *              descriptiong: Bad Request
 */


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