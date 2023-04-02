const express = require('express');
const {connection} = require('./db');
const { userRouter } = require('./routes/user.routes');
const { placesRouter } = require('./routes/places.routes');
const cors = require('cors');
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const { bookingRouter } = require('./routes/booking.routes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json())
const options ={
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Construct Week",
            version: "1.0.0"
        },
        servers:[
            {
                url: "http://localhost:8998"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSdoc(options);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/booking', bookingRouter);
app.use('/user', userRouter);
app.use('/places', placesRouter);

app.get('/', (req, res)=>{
    res.status(200).send({"msg": "Welcome to the home page"});
})

app.get('*', (req, res)=>{
    res.status(200).send({"err": "404 Page Not Found"})
})


app.listen(process.env.port, ()=>{
    connection();
    console.log('Server is running at port:', process.env.port);
})