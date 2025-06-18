import mongoose from "mongoose";

export const connectDB = async () => {
  
    await mongoose.connect(
       'mongodb+srv://bchandu2385:chandu238@cluster0.my6whts.mongodb.net/food-del'
    
  ).then(() => console.log("DB Connected"));
};
