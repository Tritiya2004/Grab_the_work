const express = require("express");
const {
  findClientProjects,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/ProjectsController");
const VerifyToken = require("../middleware/Auth");
const { isValidObjectId } = require("mongoose");

const route = express.Router();

// Get all projects for the authenticated client
route.get("/projects", VerifyToken, async (req, res) => {
  try {
    const projects = await findClientProjects(req.userId);
    if (!projects || projects.length === 0) {
      return res.status(404).json({ msg: "No projects found" });
    }
    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// Get a specific project by ID
route.get("/project/:projectId", VerifyToken, async (req, res) => {
  if (!isValidObjectId(req.params.projectId)) {
    return res.status(400).json({ msg: "Invalid project ID" });
  }
  try {
    const project = await findProjectById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// Create a new project
route.post("/project", VerifyToken, async (req, res) => {
  const { project_title, description, skills_required, payment_type, hourly_rate, total_hours, total_days } = req.body;

  // Validate required fields
  if (!project_title || !description || !skills_required || !payment_type) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Additional validations based on payment type
  if (payment_type === "hourly" && !total_hours) {
    return res.status(400).json({ msg: "Total hours required for hourly projects" });
  }
  if (payment_type === "fixed" && !total_days) {
    return res.status(400).json({ msg: "Total days required for fixed projects" });
  }

  try {
    const projectData = {
      project_title: project_title,
      description,
      skills_required,
      payment_type,
      hourly_rate: payment_type === "hourly" ? hourly_rate : null,
      total_hours: payment_type === "hourly" ? total_hours : null,
      total_days: payment_type === "fixed" ? total_days : null,
    };

    const project = await createProject(req.userId, projectData);
    return res.status(200).json({ msg: "Project created successfully", project });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// Update an existing project
route.put("/project/:projectId", VerifyToken, async (req, res) => {
  // Validate if the project ID is valid
  if (!isValidObjectId(req.params.projectId)) {
    return res.status(400).json({ msg: "Invalid project ID" });
  }

  // Destructure the request body
  const { project_title, description, skills_required, payment_type, hourly_rate, total_hours, total_days } = req.body;

  // Validate required fields
  if (!project_title || !description || !skills_required || !payment_type) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Additional validations based on payment type
  if (payment_type === "hourly" && !total_hours) {
    return res.status(400).json({ msg: "Total hours required for hourly projects" });
  }
  if (payment_type === "fixed" && !total_days) {
    return res.status(400).json({ msg: "Total days required for fixed projects" });
  }

  // Prepare data to update
  const updateData = {
    project_title, // Aligning with variable from POST route
    description,
    skills_required,
    payment_type,
    hourly_rate: payment_type === "hourly" ? hourly_rate : null,
    total_hours: payment_type === "hourly" ? total_hours : null,
    total_days: payment_type === "fixed" ? total_days : null,
  };

  try {
    // Call the function to update the project (assuming updateProject handles the update logic)
    const updatedProject = await updateProject(req.userId, req.params.projectId, updateData);
    
    if (updatedProject === "Project not found") {
      return res.status(404).json({ msg: updatedProject });
    }

    // Log the details for debugging
    console.log("Request Body:", req.body);
    console.log("Project ID:", req.params.projectId);
    console.log("User ID:", req.userId);

    // Return success response
    return res.status(200).json({ msg: "Project updated successfully", updatedProject });
  } catch (error) {
    // Log and return error
    console.log("Error occurred:", error);
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});


// Delete a project
route.delete("/project/:projectId", VerifyToken, async (req, res) => {
  if (!isValidObjectId(req.params.projectId)) {
    return res.status(400).json({ msg: "Invalid project ID" });
   
  }

  try {
    const deletedProject = await deleteProject(req.userId, req.params.projectId);
    if (deletedProject === "Project not found") {
      return res.status(404).json({ msg: deletedProject });
    }
    return res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

module.exports = route;
