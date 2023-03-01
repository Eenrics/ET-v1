import Task from "../../models/Task.js";

const getAllTasks = async (req, res) => {
  try {
    const { name, project } = req.query;
    let filters = {};

    if (name) {
      filters.name = new RegExp(name, "i");
    }
    if (project) {
      filters.project = project;
    }

    const tasks = await Task.find(filters).populate("project", "name");
    let count = tasks.length;

    if (!tasks) {
      throw Error("you don't have any task yet");
    }
    if (!tasks.length) {
      throw Error("No projects found with the given filters.");
    }

    res.status(200).json({ success: true, number: count, tasks });
  } catch (error) {
    res.status(404).json({ success: false, message: message.error });
  }
};

export default getAllTasks;
