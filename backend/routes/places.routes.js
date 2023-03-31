const express = require('express');
const {placesModel} = require('../models/places.models');
const { authorization } = require('../middlewares/authorization.middleware');

const placesRouter = express.Router();

placesRouter.get('/', async(req, res)=>{
    const query = req.query;
    try{
        const data = await placesModel.find();
        res.status(200).send(data);
    }catch(err){
        console.log(err.message);
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})
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