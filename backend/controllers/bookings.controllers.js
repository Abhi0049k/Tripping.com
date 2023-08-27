const { bookModel } = require("../models/book.model");
const { clientModel } = require("../models/client.model");
const { imgModel } = require("../models/images.model");
const { placeModel } = require("../models/places.model");
require('dotenv').config();

const bookingPlace = async (req, res) => {
    try {
        let { placeId, checkIn, checkOut, days, userId } = req.body;
        let cost = await placeModel.findById(placeId, 'actualprice');
        cost = Number(cost.actualprice) * days;
        const newBooking = new bookModel({ placeId, checkInDate: new Date(checkIn), checkOutDate: new Date(checkOut), days, userId, totalCost: cost })
        await newBooking.save();
        res.status(200).send({ msg: 'Booking Done', bookingId: newBooking._id });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: err.message });
    }
}

const totalBookings = async (req, res) => {
    try {
        let { userId } = req.body;
        const aggregatedBookings = await bookModel.aggregate([
            {
                $match: { userId }
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "_id",
                    foreignField: "bookingId",
                    as: "client"
                }
            },
            {
                $lookup: {
                    from: "places",
                    localField: "placeId",
                    foreignField: "_id",
                    as: 'place'
                }
            },
            {
                $unwind: "$client"
            },
            {
                $unwind: "$place"
            },
            {
                $project: {
                    _id: 1,
                    checkInDate: 1,
                    checkOutDate: 1,
                    days: 1,
                    totalCost: 1,
                    status: 1,
                    placeId: 1,
                    client: {
                        phoneNumber: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        requests: 1
                    },
                    place: {
                        _id: "$place._id",
                        name: "$place.name",
                        location: "$place.location",
                        maxPeople: "$place.maxPeople"
                    }
                }
            }
        ]);
        res.status(200).send(aggregatedBookings)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: err.message });
    }
}

const confirmBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingDetails = await bookModel.findById(id);
        const propertyDetails = await placeModel.findById(bookingDetails.placeId);
        const img = await imgModel.findOne({ placeId: propertyDetails._id });
        const checkIn = formatDate(bookingDetails.checkInDate);
        const checkOut = formatDate(bookingDetails.checkOutDate);
        res.send({ cost: bookingDetails.totalCost, checkIn, checkOut, maxPeople: propertyDetails.maxPeople, img: img.url, title: propertyDetails.name, location: propertyDetails.location, propertyId: propertyDetails._id });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: err.message })
    }
}

const deleteBooking = async(req, res)=>{
    try{
        let {id} = req.params;
        await bookModel.findByIdAndDelete(id);
        await clientModel.findOneAndDelete({bookingId: id});
        res.status(200).send({msg: 'Booking Cancelled'})
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

const completeBooking = async (req, res) => {
    try {
        const { bookingId, ...body } = req.body;
        await bookModel.findByIdAndUpdate({ _id: bookingId }, { totalCost: body.totalCost, status: 'complete' });
        let newClient = new clientModel({ bookingId, phoneNumber: body.phoneNumber, firstName: body.firstName, lastName: body.lastName, email: body.email, requests: body.requests });
        await newClient.save();
        res.status(200).send({ msg: 'Booking confirmed' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: err.message });
    }
}

function formatDate(inputDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateObj = new Date(inputDate);
    const day = dateObj.getUTCDate();
    const month = months[dateObj.getUTCMonth()];
    const year = dateObj.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

module.exports = {
    bookingPlace, totalBookings, confirmBooking, deleteBooking, completeBooking
}