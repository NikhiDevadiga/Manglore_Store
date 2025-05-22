import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    cat_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cat",
        required : true
    },
    subcat_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "SubCat",
        required : true
    },
    image:{
        type : String,
        required : true
    },
    price:{
        type : String,
        required : true
    },
    gst:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    weight: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        enum: ['kg', 'g', 'liter', 'ml', 'unit'],
        required: true
    },
    stockquantity: {
        type: Number,
        required: true
    },
    stockunit: {
        type: String,
        enum: ['kg', 'g', 'liter', 'ml', 'unit'],
        required: true
    }
},{
    timestamps : true //createdAt, updatedAt
});

const Product = mongoose.model('Product',productSchema);
export default Product;
