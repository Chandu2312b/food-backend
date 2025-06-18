import express from 'express';
import { addFood , listFood , removeFood } from '../controllers/foodController.js';
import multer from 'multer';
// multer is used for handling multipart/form-data, which is primarily used for uploading files like images.

const foodRouter = express.Router();

const storage  =multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)


    }
     
})

// Image storage Engine
const upload = multer({storage:storage});


foodRouter.post('/add',upload.single("image"),addFood)
// The 'upload.single("image")' middleware is used to handle single file uploads with the field name "image".
// The 'addFood' function is called after the file is uploaded successfully.

foodRouter.get('/list', listFood);
foodRouter.post("/remove" , removeFood)




 


export default foodRouter;