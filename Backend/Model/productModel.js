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
        price: {
        type: Number, // was String
        required: true
        },
        gst: {
        type: Number, // was String
        required: true
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
        enum: ['Kg', 'Gm', 'Liter', 'Ml', 'Unit'],
        required: true
    },
    stockquantity: {
        type: Number,
        required: true
    },
    stockunit: {
        type: String,
        enum: ['Kg', 'Gm', 'Liter', 'Ml', 'Unit'],
        required: true
    },
    offer: {
        offerpercentage: { type: Number, required: false },
        validTill: { type: Date, default: null }
    }


},{
    timestamps : true //createdAt, updatedAt
});

const Product = mongoose.model('Product',productSchema);
export default Product;
