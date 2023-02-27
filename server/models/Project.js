import mongoose from "mongoose";
import paymentSchema from "./subProjectSchema/paymentSchema.js";
import baseSchema from "./BaseSchema.js";

const projectSchema = new mongoose.Schema({
  ...baseSchema.obj,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  //   project mangers
  projectManagers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  //   payment status
  payment: paymentSchema,
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
