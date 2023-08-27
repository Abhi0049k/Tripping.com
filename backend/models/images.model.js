const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'place'
    }, 
    url: {
        type: String,
        required: true
    }
},{
    versionKey: false
})

const imgModel = mongoose.model('Image', imgSchema);

module.exports = {imgModel}
