//require("dotenv").config({ path: "./env" });

import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on http://localhost${process.env.PORT}`);
    });
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
