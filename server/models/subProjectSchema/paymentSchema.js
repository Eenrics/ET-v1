import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentStatus: {
    type: String,
    enum: ["Not-Paid", "Completed"],
    default: "Not started",
  },
  //   payment amount
  paymentAmount: {
    type: Number,
    required: [true, "Please enter project payment amount"],
  },
  //   payment date
  paymentDate: {
    type: Date,
    required: [true, "Please enter project payment date"],
  },
  //   payment method
  paymentMethod: {
    type: String,
    enum: [
      "Cash",
      "Check",
      "Credit Card",
      "Debit Card",
      "Paypal",
      "Bank Transfer",
    ],
    default: "Cash",
  },
});

export default paymentSchema;
