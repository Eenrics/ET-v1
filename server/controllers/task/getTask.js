import Task from "../../models/Task.js";

const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project", "name");

    if (!task) {
      throw Error("no task founded with this id");
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export default getTask;
