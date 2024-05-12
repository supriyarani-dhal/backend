//require("dotenv").config({ path: "./env" });

import dotenv from "dotenv";
import connectDB from "./db/db.js";
import express from 'express';

dotenv.config({ path: "./env" });

const app = express();

connectDB()
.then((listen) = {
    app.listen(process.env.PORT || 8000, (port) = {
        console.log(`App is listening on http://localhost${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MONGODB connection FAILED !!! ", error);
});


// ; (async() => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

//         app.on("error", (error) => {
//             console.log("ERROR: ", error)
//             throw error
//         })
//        app.listen(process.env.PORT, () => {
//             console.log(`App is listening on http://localhost${process.env.PORT}`);
//         })

//     } catch (error) {
//         console, log("ERROR: ", error);
//         throw error;
//     }
// })()
