import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  country: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  subCity: {
    type: String,
    default: null,
  },
  woreda: {
    type: String,
    default: null,
  },
  kebele: {
    type: String,
    default: null,
  },
  houseNumber: {
    type: String,
    default: null,
  },
});

export default AddressSchema;
