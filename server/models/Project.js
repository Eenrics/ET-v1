import mongoose from "mongoose";
import paymentSchema from "./subProjectSchema/paymentSchema.js";
import baseSchema from "./BaseSchema.js";
import Task from "./Task.js";
import User from "./User.js";

const projectSchema = new mongoose.Schema({
  ...baseSchema.obj,
  client: {
    type: String,
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

  //   payment
  payment: paymentSchema,
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
