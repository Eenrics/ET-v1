import Project from "../../models/project.js";

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      deadLine,
      status,
      budget,
      client,
      projectManagers,
      payment,
    } = req.body;

    const project = new Project({
      name,
      description,
      startDate,
      deadLine,
      status,
      budget,
      client,
      projectManagers,
      payment,
    });

    await project.save();

    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
