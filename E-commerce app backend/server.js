import exp from "express";
import {connect} from "mongoose";
import userApp from "./API's/userAPI.js";
import productApp from "./API's/productAPI.js";

const app = exp();

const PORT = 4000;
const MONGO_URL = "mongodb://127.0.0.1:27017/ecommerceDB";
async function connectDB() {
try {
    await connect(MONGO_URL);
    console.log("Connected to MongoDB");
}
catch (error) {}
}
connectDB()
app.use(exp.json());
app.use("/user-api", userApp);
app.use("/product-api", productApp);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});