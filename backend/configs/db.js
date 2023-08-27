const mongoose = require('mongoose');
require('dotenv').config();

const connection = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connection Established');
    }catch(err){
        console.log(err);
        console.log('Connection Fail');
    }
}

module.exports = {
    connection
}
