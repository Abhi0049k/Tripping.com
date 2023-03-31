const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.models");
require('dotenv').config();

const authorization = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const secretKey = process.env.secretKey;
        const data = jwt.verify(token, secretKey);
        const user = await userModel.findById(data.userId);
        const role = user.role;
        if (role === 'admin')
            next();
        else
            res.status(400).send({ "err": "Only an Admin can add a Place" })
    } catch (err) {
        console.log('working middleware')
        console.log(err);
        res.status(400).send({ "err": "Something went Wrong" });
    }
}


module.exports = {
    authorization
}