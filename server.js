import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config.js'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json())
app.use(cors({
    origin:[
        "https://food-app-frontend-fhb4.onrender.com",
        "https://food-app-admin-mauve.vercel.app"
    ],
    credentials:true
}));
// acess backend from frontend

connectDB();
// db connection

app.use("/api/food", foodRouter)
app.use("/images", express.static("uploads"))
// localhost:4000/images will access the images in the uploads folder
// api endpoints
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req , res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

