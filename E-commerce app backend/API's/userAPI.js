import exp from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModels.js";
const userApp = exp.Router();
userApp.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({
            message: "Users fetched",
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
});
//create user
userApp.post("/users", async (req, res) => {
    try {
        //get user obj from req body
        const userObj = req.body;
        // validate the password using validate funtion
        await new UserModel(userObj).validate();
        //hash the password
        const hashedPassword = await bcrypt.hash(userObj.password, 10);
        userObj.password = hashedPassword;
        
        //create user document
        const newUser = new UserModel(userObj);
        //save user in DB
        await newUser.save();
        //send response (exclude password from response)
        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).json({
            message: "User created",
            payload: userResponse
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

//login user
userApp.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        //find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        //compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        //send response (exclude password)
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({
            message: "Login successful",
            payload: userResponse
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
});

//add product to cart
userApp.put("/users/user-cart/userid/:userId/productid/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        
        //find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        //check if product already exists in cart
        const existingProduct = user.cart.find(
            item => item.product.toString() === productId
        );
        
        let result;
        if (existingProduct) {
            //if product exists, increment quantity by 1
            result = await UserModel.findOneAndUpdate(
                { _id: userId, "cart.product": productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true }
            ).populate("cart.product", "productName price brand");
        } else {
            //if product doesn't exist, add new product with quantity 1
            result = await UserModel.findByIdAndUpdate(
                userId,
                { $push: { cart: { product: productId, quantity: 1 } } },
                { new: true }
            ).populate("cart.product", "productName price brand");
        }

        res.status(200).json({
            message: "Product added to cart",
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding product to cart",
            error: error.message
        });
    }
});

//get user cart
userApp.get("/users/user-cart/userid/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        //find user by id and populate cart products
        const user = await UserModel.findById(userId).populate("cart.product", "productName price brand");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User cart fetched",
            payload: user.cart
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user cart",
            error: error.message
        });
    }
});

export default userApp;