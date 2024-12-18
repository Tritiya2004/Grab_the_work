const Project = require("../models/projectModel");

// Get all projects for a specific client
const findClientProjects = async (userId) => {
  try {
    const projects = await Project.find({ clientId: userId });
    return projects;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a specific project by ID
const findProjectById = async (projectId) => {
  try {
    const project = await Project.findById(projectId);
    return project;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create a new project
const createProject = async (userId, projectData) => {
  try {
    const project = new Project({
      clientId: userId,
      ...projectData,
    });
    await project.save();
    return project;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update an existing project
const updateProject = async (userId, projectId, updateData) => {
  try {
    const project = await Project.findOne({ _id: projectId, clientId: userId });
    console.log("Project found:", project);
    if (!project) {
      return "Project not found";
    }

    Object.assign(project, updateData);
    await project.save();
    return project;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a project
const deleteProject = async (userId, projectId) => {
  try {
    const project = await Project.findOneAndDelete({ _id: projectId, clientId: userId });
    if (!project) {
      return "Project not found";
    }
    return "Project deleted successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  findClientProjects,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
};
