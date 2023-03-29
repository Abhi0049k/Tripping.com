const express = require('express');
const {connection} = require('./db');
const { userRouter } = require('./routes/user.routes');
const { placesRouter } = require('./routes/places.routes');
const cors = require('cors')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json())

app.use('/user', userRouter);
app.use('/places', placesRouter)

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