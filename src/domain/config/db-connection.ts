import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

function connectToDB() {
  mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then((res) => {
      if (res) {
        console.log(`Database connection succeffully`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export default connectToDB;