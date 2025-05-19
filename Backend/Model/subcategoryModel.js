import mongoose from "mongoose";

const subcategorySchema =new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    cat_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Cat",
        required : true
    },
    image:{
        type : String,
        required : true
    }
},{
    timestamps : true //createdAt, updatedAt
});

const SubCat = mongoose.model('SubCat',subcategorySchema);
export default SubCat;