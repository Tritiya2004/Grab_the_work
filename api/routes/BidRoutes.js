const express = require("express");
const {
  createBid,
  getBidsByProject,
  getBidById,
  updateBid,
  deleteBid,
  getBidsByUser,
} = require("../controllers/BidController");
const VerifyToken = require("../middleware/Auth");
const { isValidObjectId } = require("mongoose");

const   route = express.Router();

// 1. Create a new bid
route.post("/bids", VerifyToken, async (req, res) => {
  const { projectId, bidAmount, bidMessage } = req.body;

  // Validate required fields
  if (!projectId || !bidAmount || !bidMessage) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const bidData = {
      projectId,
      userId: req.userId,  // Set the userId to the authenticated user's ID
      bidAmount,
      bidMessage,
    };

    const bid = await createBid(bidData);
    return res.status(200).json({ msg: "Bid created successfully", bid });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// 2. Get all bids for a specific project
route.get("/project/:projectId/bids", VerifyToken, async (req, res) => {
  if (!isValidObjectId(req.params.projectId)) {
    return res.status(400).json({ msg: "Invalid project ID" });
  }

  try {
    const bids = await getBidsByProject(req.params.projectId);
    if (!bids || bids.length === 0) {
      return res.status(404).json({ msg: "No bids found for this project" });
    }
    return res.status(200).json({ bids });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// 3. Get a specific bid by ID
route.get("/bid/:bidId", VerifyToken, async (req, res) => {
  if (!isValidObjectId(req.params.bidId)) {
    return res.status(400).json({ msg: "Invalid bid ID" });
  }

  try {
    const bid = await getBidById(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ msg: "Bid not found" });
    }
    return res.status(200).json({ bid });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// 4. Update an existing bid
route.put("/bid/:bidId", VerifyToken, async (req, res) => {
  if (!isValidObjectId(req.params.bidId)) {
    return res.status(400).json({ msg: "Invalid bid ID" });
  }

  const { bidAmount, bidMessage, status } = req.body;

  // Validate required fields
  if (!bidAmount || !bidMessage) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // Prepare the data to update
  const updateData = {
    bidAmount,
    bidMessage,
    status: status || "pending", // Default to pending if not provided
  };

  try {
    const updatedBid = await updateBid(req.params.bidId, updateData);
    if (updatedBid === "Bid not found") {
      return res.status(404).json({ msg: updatedBid });
    }
    return res.status(200).json({ msg: "Bid updated successfully", updatedBid });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});



// 6. Accept a bid
route.put("/bid/:bidId/accept", VerifyToken, async (req, res) => {
    if (!isValidObjectId(req.params.bidId)) {
      return res.status(400).json({ msg: "Invalid bid ID" });
    }
  
    try {
      // Update the bid's status to "accepted"
      const updatedBid = await updateBid(req.params.bidId, { status: "accepted" });
  
      if (updatedBid === "Bid not found") {
        return res.status(404).json({ msg: updatedBid });
      }
  
      return res.status(200).json({ msg: "Bid accepted successfully", updatedBid });
    } catch (error) {
      return res.status(500).json({ msg: "Error occurred", error: error.message });
    }
  });


  route.put("/bid/:bidId/reject", VerifyToken, async (req, res) => {
    if (!isValidObjectId(req.params.bidId)) {
      return res.status(400).json({ msg: "Invalid bid ID" });
    }
  
    try {
      // Update the bid's status to "accepted"
      const updatedBid = await updateBid(req.params.bidId, { status: "rejected" });
  
      if (updatedBid === "Bid not found") {
        return res.status(404).json({ msg: updatedBid });
      }
  
      return res.status(200).json({ msg: "Bid accepted successfully", updatedBid });
    } catch (error) {
      return res.status(500).json({ msg: "Error occurred", error: error.message });
    }
  });
  
route.delete("/bid/:bidId/reject/delete", VerifyToken, async (req, res) => {
    if (!isValidObjectId(req.params.bidId)) {
      return res.status(400).json({ msg: "Invalid bid ID" });
    }
  
    try {
      const deletedBid = await deleteBid(req.params.bidId);
  
      if (deletedBid === "Bid not found") {
        return res.status(404).json({ msg: deletedBid });
      }
  
      return res.status(200).json({ msg: "Bid rejected and deleted successfully" });
    } catch (error) {
      return res.status(500).json({ msg: "Error occurred", error: error.message });
    }
  });
  
// 5. Delete a bid
route.delete("/bid/:bidId", VerifyToken, async (req, res) => {
  if (!isValidObjectId(req.params.bidId)) {
    return res.status(400).json({ msg: "Invalid bid ID" });
  }

  try {
    const deletedBid = await deleteBid(req.params.bidId);
    if (deletedBid === "Bid not found") {
      return res.status(404).json({ msg: deletedBid });
    }
    return res.status(200).json({ msg: "Bid deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});

// 8. Get all bids by the current user


route.get("/user/bids", VerifyToken, async (req, res) => {
  try {
    const bids = await getBidsByUser(req.userId);

    // Log fetched bids for debugging
    console.log("Fetched bids for user:", req.userId, bids);

    if (!bids || bids.length === 0) {
      return res.status(404).json({ msg: "No bids found for this user" });
    }

    return res.status(200).json({ bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res.status(500).json({ msg: "Error occurred", error: error.message });
  }
});


module.exports = route;
