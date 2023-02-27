import mongoose from "mongoose";
import baseSchema from "./BaseSchema.js";
const taskSchema = new mongoose.Schema({
  ...baseSchema.obj,
  documents: [
    {
      type: String,
    },
  ],
  //   people who work on this project

  team: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["projectManager", "translator"],
        default: "projectManager",
      },
    },
  ],
  //   project
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});
