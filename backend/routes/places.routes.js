const express = require('express');
const {placesModel} = require('../models/places.models')

const placesRouter = express.Router();

placesRouter.get('/', async(req, res)=>{
    const query = req.query;
    console.log(query);
    try{
        const data = await placesModel.find({query});
        res.status(200).send({data});
    }catch(err){
        console.log(err.message);
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})


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

module.exports = {
    placesRouter
}