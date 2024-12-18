const Bid = require("../models/bidModel");

const createBid = async (bidData) => {
  const bid = new Bid(bidData);
  return await bid.save();
};

const getBidsByProject = async (projectId) => {
  return await Bid.find({ projectId }).populate("userId", "username email  ",); // Example of populating the userId field
};

const getBidById = async (bidId) => {
  return await Bid.findById(bidId).populate("userId", "name email");
};

const updateBid = async (bidId, updateData) => {
  const bid = await Bid.findByIdAndUpdate(bidId, updateData, { new: true });
  if (!bid) return "Bid not found";
  return bid;
};

const deleteBid = async (bidId) => {
  const bid = await Bid.findByIdAndDelete(bidId);
  if (!bid) return "Bid not found";
  return bid;
};

const getBidsByUser = async (userId) => {
  return await Bid.find({ userId }).populate("projectId", "projectName");
};

module.exports = {
  createBid,
  getBidsByProject,
  getBidById,
  updateBid,
  deleteBid,
  getBidsByUser,
};
