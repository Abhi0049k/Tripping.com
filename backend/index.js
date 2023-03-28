const express = require('express');
const {connection} = require('./db');
require('dotenv').config();


const app = express();

app.get('/', (req, res)=>{
    res.status(200).send({"msg": "Welcome to the home page"});
})

app.get('*', (req, res)=>{
    res.status(200).send({"err": "404 Page Not Found"})
})


app.listen(process.env.port, ()=>{
    connection();
    console.log('Server is running at port: ', process.env.port);
})