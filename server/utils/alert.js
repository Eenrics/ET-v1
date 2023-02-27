import Project from "../models/Project";
import User from "../models/User";

// check upcoming deadlines
async function checkUpcomingDeadlines() {
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // calculate date two days from now

  // query for projects with deadline within 2 days
  const projects = await Project.find({ deadline: { $lte: twoDaysFromNow } })
    .populate("client")
    .populate("team");

  // query for tasks with deadline within 2 days
  const tasks = await Task.find({ deadline: { $lte: twoDaysFromNow } })
    .populate("assignee")
    .populate("project");

  // take some action with the results, such as sending an email to the admin
  if (projects.length > 0 || tasks.length > 0) {
    const adminEmail = "admin@example.com";
    const message = `There are ${projects.length} projects and ${tasks.length} tasks with upcoming deadlines`;
    // send email to admin
  }
}

// checkUpcomingDeadlines();

export default checkUpcomingDeadlines;
