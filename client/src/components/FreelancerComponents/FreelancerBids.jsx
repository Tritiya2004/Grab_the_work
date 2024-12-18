import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../index.css";

export default function BidsList() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userId } = useParams();
  const token = useSelector((state) => state.user?.token);

  const fetchBids = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/bid/user/bids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBids(data?.bids || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        const errorMsg = err.response?.data?.msg || "Failed to load bids.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      console.log("Rejecting bid with ID:", bidId); // Debugging log
      const response = await axios.delete(
        `http://localhost:3001/bid/bid/${bidId}/reject/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Reject response:", response.data); // Debugging log
    
      if (response.data.success) {
        toast.success("Bid rejected!");
        // Remove rejected bid from local state
        setBids(bids.filter(bid => bid._id !== bidId));
      }
    } catch (err) {
      console.error("Reject bid error:", err); // Debugging log
      toast.success("Bid withdrawed");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBids();
    } else {
      toast.error("Authentication required.");
      navigate("/login");
    }
  }, [token, navigate, userId]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="bids-list-container">
      <h1 className="title">MY BIDS</h1>
      <button className="go-back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div className="bids-list">
        {bids.length === 0 ? (
          <p>No bids available.</p>
        ) : (
          bids.map((bid, index) => (
            <div key={bid._id} className="bid-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3>Project ID: {bid.projectId?.name || bid.projectId?._id || bid.projectId}</h3>
              <p>
                <strong>Bid Amount:</strong> ${bid.bidAmount}
              </p>
              <p>
                <strong>Bid Message:</strong> {bid.bidMessage}
              </p>
              <p>
                <strong>Status:</strong> {bid.status || "Pending"}
              </p>
              <p>
                <strong>Submitted On:</strong> {new Date(bid.bidDate).toLocaleString()}
              </p>
              <button
                onClick={() => handleRejectBid(bid._id)}
                disabled={bid.status === "accepted" || bid.status === "disabled"}
              >
                WITHDRAW MY BID
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
