import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dabbabites:dabbabites1234@cluster0.slp39e4.mongodb.net/food-del').then(() => console.log("DB connected"));
}