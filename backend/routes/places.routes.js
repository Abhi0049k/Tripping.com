const express = require('express');
const {placesModel} = require('../models/places.models');
const { authorization } = require('../middlewares/authorization.middleware');

const placesRouter = express.Router();


/**
 * @swagger
 *  components:
 *      schemas: 
 *          place:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      description: The auto-generated id by mongo DB
 *                  name: 
 *                      type: string
 *                      description: Place's name
 *                  images:
 *                      type: array
 *                      description: contains image url    
 *                  location:
 *                      type: string
 *                      description: contains the address of the place
 *                  facilities:
 *                      type: array
 *                      description: stores all the facilities provided at the place
 *                  day:
 *                      type: integer
 *                      description: minimum booking
 *                  isBooked:
 *                      type: true/false
 *                      description: checks whether the place is booked or not
 *                  pricing:
 *                      type: integer
 *                      description: stores the base price
 *                  noofpeople:
 *                      type: integer
 *                      description: Maximum no of people that can stay there at a time
 *                  discount:
 *                      type: integer  
 *                      description: stores the discount currently available  
 *                  actualprice:
 *                      type: integer
 *                      description: Stores the price after calculating the discount
 */

/**
 * @swagger
 * /places:
 *  get:
 *      summary: To Fetch details of all the places.
 *      tags: [Places]
 *      responses:
 *          200:
 *              description: This route will give you the details of all the users currently present in the database, only admin can access all the details
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array 
 *                          item:
 *                              $ref: "#/components/schemas/place"
 *          400:
 *              descriptiong: Bad Request
 */


placesRouter.get('/', async(req, res)=>{
    const {query} = req.query;
    try{
        let data;
        if(query)
        data = await placesModel.find({location: {$regex: query, $options: "i"}});
        else
        data = await placesModel.find();
        res.status(200).send(data);
    }catch(err){
        // console.log(err.message);
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})

/**
 * @swagger
 * /places:
 *  get/id:
 *      summary: This route is to get place details one at a time from the database.
 *      tags: [Places]
 *      responses:
 *          200:
 *              description: This route will give you the details of the place you requested for
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object  
 *                          item:
 *                              $ref: "#/components/schemas/place"
 *          400:
 *              descriptiong: Bad Request
 */

placesRouter.get('/:id', async(req, res)=>{
    const {id} = req.params;
    try{
        const data = await placesModel.findById(id);
        res.status(200).send(data);
    }catch(err){
        console.log(err.message);
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})

/**
 * @swagger
 * /user/update/id:
 *  patch:
 *      summary: updates details of a place in the database
 *      tags: [Places]
 *      responses:
 *          200:
 *              description: update details in the place from the db
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/place"
 *          400:
 *              description: Bad Request
 */

placesRouter.patch('/update/:id', async(req, res)=>{
    const data = req.body;
    const {id} = req.params;
    try{
        await placesModel.findByIdAndUpdate({_id: id}, data);
        res.status(200).send({"msg": "Info Updated Successfully"});
    }catch(err){
        res.status(400).send({"err": "Something went Wrong!!!"});
    }
})


/**
 * @swagger
 * /place/add:
 *  post:
 *      summary: To post a new place in the database, only an admin can add a place in the db
 *      tags: [Places]
 *      requestedBody:
 *          required: true
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: "#/components/schemas/place"
 *      responses:
 *          200:
 *              description: The user was successfully registered
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/place"
 *          400:
 *              description: Bad Request
 */

placesRouter.use(authorization);
placesRouter.post('/add', async(req, res)=>{
    const data = req.body;
    try{
        const newPlace = new placesModel(data);
        await newPlace.save();
        res.status(200).send({"msg":"New Place Added"});
    }catch(err){
        res.status(400).send({"err": "Something went Wrong!!!"});
    }
})

/**
 * @swagger
 * /user/delete/id:
 *  delete:
 *      summary: removes a place from the database, only an admin can remove a place
 *      tags: [Places]
 *      responses:
 *          200:
 *              description: use to remove the place from the db
 *          400:
 *              description: Bad Request
 */

placesRouter.delete('/delete/:id', async(req, res)=>{
    const {id} = req.params;
    try{
        await placesModel.findByIdAndDelete({_id: id});
        res.status(200).send({"msg": "Deleted Successfully"});
    }catch(err){
        console.log(err);
        res.status(400).send({"err": "Something Went Wrong!!!"});
    }
})

module.exports = {
    placesRouter
}