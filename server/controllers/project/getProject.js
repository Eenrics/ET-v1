import Project from "../../models/Project.js";

// get project by id and preload the tasks
const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id).populate("tasks");

    if (!project) {
      throw Error("there is no project with this id");
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export default getProject;
