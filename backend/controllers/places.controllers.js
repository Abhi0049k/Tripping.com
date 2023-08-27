const { placeModel } = require("../models/places.model");
const { bookModel } = require("../models/book.model");
const { imgModel } = require('../models/images.model');

const getPlace = async (req, res) => {
    try {
        let { location, checkIn, checkOut, qty } = req.body;
        checkIn = new Date(checkIn);
        checkOut = new Date(checkOut);
        if (location) {
            let places = await placeModel.find({ location: { $regex: location, $options: 'i' }, maxPeople: { $gte: qty } });
            let availablePlaces = await checking(places, checkIn, checkOut)
            return res.status(200).send(availablePlaces);
        } else {
            let places = await placeModel.find().limit(10);
            return res.status(200).send(places);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: err.message });
    }
}

const addPlace = async (req, res) => {
    try {
        const { name, location, mapHTML, facilities, isAvailable, price, maxPeople, discount, actualprice, images } = req.body;
        let newPlace = new placeModel({ name, location, mapHTML, facilities, isAvailable, price, maxPeople, discount, actualprice });
        images.forEach(async (el) => {
            let newImg = new imgModel({ placeId: newPlace._id, url: el });
            await newImg.save();
        })
        await newPlace.save();
        res.status(201).send({ msg: 'New Place Added' })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: err.message });
    }
}

const checking = async (places, checkIn, checkOut) => {
    let arr = [];
    for (let i = 0; i < places.length; i++) {
        let bookings = await bookModel.find({ placeId: places[i]._id });
        if (bookings.length === 0) arr.push(places[i]);
        else {
            let isAvailable = true;
            for (let j = 0; j < bookings.length; j++) {
                const booking = bookings[j];
                if (
                    (booking.checkInDate <= checkIn && booking.checkOutDate >= checkOut) ||
                    (booking.checkInDate >= checkIn && booking.checkInDate <= checkOut) ||
                    (booking.checkOutDate >= checkIn && booking.checkOutDate <= checkOut)
                ) {
                    isAvailable = false;
                    break;
                }
            }
            if (isAvailable) arr.push(places[i]);
        }
    }
    return arr;
};

module.exports = {
    getPlace, addPlace
}