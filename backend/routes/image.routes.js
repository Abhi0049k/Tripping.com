const { Router } = require("express");
const { oneImage } = require("../controllers/images.controllers");

const imgRouter = Router();

imgRouter.get('/', oneImage)

module.exports = {
    imgRouter
}