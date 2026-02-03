import exp from "express";
import { ProductModel } from "../models/ProductModels.js";

const productApp = exp.Router();

//get product
productApp.get("/products", async (req, res) => {
try {
    const products = await ProductModel.find();
    res.status(200).json({
    message: "Products fetched",
    payload: products
    });
} catch (error) {
    res.status(500).json({
    message: "Error fetching products",
    error: error.message
    });
}
});


// create product
productApp.post("/products", async (req, res) => {
try {
    const productObj = req.body;
    const newProduct = new ProductModel(productObj);
    await newProduct.save();

    res.status(201).json({
    message: "Product created",
    payload: newProduct
    });
} catch (error) {
    res.status(500).json({
    message: "Error creating product",
    error: error.message
    });
}
});

export default productApp;