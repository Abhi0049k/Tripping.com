const express = require('express');
const { authorization } = require('../middlewares/authorization.middleware');

const bookingRouter = express.Router();

bookingRouter.post('/book', (req, res)=>{
    res.status(200).send({'msg':'working fine for now'});
})


bookingRouter.use(authorization);
bookingRouter.get('/', (req, res)=>{
    res.status(200).send({"msg": "working fine for now"});
})


module.exports = {
    bookingRouter
}