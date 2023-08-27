const express = require('express');
const cors = require('cors');
const { connection } = require('./configs/db');
const userRouter = require('./routes/user.routes');
const placeRouter = require('./routes/place.routes');
const { imgRouter } = require('./routes/image.routes');
const bookingRouter = require('./routes/booking.routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send({'msg': 'Welcome to the home page'})
})

app.use('/user', userRouter);

app.use('/place', placeRouter);

app.use('/img', imgRouter);

app.use('/booking', bookingRouter);

app.use('*', (req, res)=>{
    res.status(404).send({msg: '404 Page Not Found'})
})

app.listen(process.env.PORT, ()=>{
    connection();
    console.log(`Server is running on port: ${process.env.PORT}`)
})