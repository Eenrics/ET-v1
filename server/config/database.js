import mongoose from "mongoose";

// this will connect the database and let us login
mongoose.set("strictQuery", false);
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("database conneted"))
    .catch((error) =>
      console.log(`failed to connect [[[[----${error} ----]]]]`)
    );
};

export default connectDatabase;
