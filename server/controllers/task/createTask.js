import Task from "../../models/Task.js";
import Project from "../../models/Project.js";

export const createTask = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      deadLine,
      status,
      budget,
      documents,
      team,
      projectId,
    } = req.body;

    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw Error("Project not found");
    }

    // Create a new task
    const task = new Task({
      name,
      description,
      startDate,
      deadLine,
      status,
      budget,
      documents,
      team,
      project: projectId,
    });

    // Save the new task to the database
    await task.save();

    // Push the new task ID to the project.tasks array
    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

    // Send a response with the new task data
    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
