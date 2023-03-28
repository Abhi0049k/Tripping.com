const mongoose = require('mongoose');

const connection = async ()=>{
    try{
        await mongoose.connect(process.env.mongoDbUrl);
        console.log('Connection Established');
    }catch(err){
        console.log('Connection Fail');
    }
}

module.exports = {
    connection
}
