const { Router } = require("express");

const { getPlace, addPlace } = require("../controllers/places.controllers");

const placeRouter = Router();

placeRouter.post('/', getPlace)

placeRouter.post('/add', addPlace)

module.exports = placeRouter;