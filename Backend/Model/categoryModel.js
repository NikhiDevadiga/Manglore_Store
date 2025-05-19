import mongoose from "mongoose";

const categorySchema =new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    image:{
        type : String,
        required : true
    }
},{
    timestamps : true //createdAt, updatedAt
});

const Cat = mongoose.model('Cat',categorySchema);
export default Cat;