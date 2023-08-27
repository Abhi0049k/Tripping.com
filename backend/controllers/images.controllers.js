const { imgModel } = require("../models/images.model");

const oneImage = async(req, res)=>{
    try{
        let {placeId} = req.query;
        let img = await imgModel.findOne({placeId});
        return res.status(200).send({url: img.url});
    }catch(err){
        console.log(err);
        res.status(500).send({msg: err.message});
    }
}

module.exports = {
    oneImage
}