import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
});

export default bankAccountSchema;
