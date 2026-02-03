import {Schema, model} from "mongoose";
//product scehma
const productSchema = new Schema({
    productName: {
        type:String,
        required:[true,"Product name is required"]
    },
    price: {
        type:Number,
        required:[true,"Price is required"]
    },
    brand: {
        type:String,
        required:[true,"product brand  is required"]
    }
},
{
    strict:"throw",
    timestamps:true,
    versionKey:false
});
//create model
export const ProductModel = model("product",productSchema);