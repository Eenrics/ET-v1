import Project from "../../models/project.js";

const getAllProjects = async (req, res) => {
  try {
    const { name, status } = req.query;

    let filters = {};

    if (name) {
      filters.name = new RegExp(name, "i"); // Use regex for case-insensitive search
    }
    if (status) {
      filters.status = status;
    }

    const projects = await Project.find(filters).populate("tasks", "name");
    if (!projects) {
      throw Error("No projects found founded");
    }

    if (!projects.length) {
      throw Error("No projects found with the given filters.");
    }

    res.send({ success: true, projects });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default getAllProjects;
