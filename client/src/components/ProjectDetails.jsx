import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails } from "../Redux/ClientSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { toast } from "react-toastify";
import ClientMenu from "./ClientComponents/ClientMenu";
import "../index.css";
import axios from "axios"; // Import Axios for API calls

export default function ProjectDetails() {
  const { projectId } = useParams(); 
  const { token } = useSelector((state) => state.user); 
  const { projectDetails, error } = useSelector((state) => state.client); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [bids, setBids] = useState([]); 
  const [bidsLoading, setBidsLoading] = useState(true); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      navigate("/login"); 
      return;
    }

    dispatch(fetchProjectDetails(projectId))
      .unwrap()
      .then(() => setLoading(false)) 
      .catch((err) => {
        setLoading(false); 
        toast.error(err || "Failed to fetch project details");
      });

    const fetchBids = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/bid/project/${projectId}/bids`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response.data);

        if (Array.isArray(response.data.bids)) {
          setBids(response.data.bids); 
        } else {
          toast.error("Invalid bids data format.");
          setBids([]); 
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to fetch bids");
      } finally {
        setBidsLoading(false); 
      }
    };
    
    fetchBids(); 
  }, [dispatch, projectId, token, navigate]);
  const handleAcceptBid = async (bidId) => {
    // Optimistic UI update: Mark all bids as disabled
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid._id === bidId
          ? { ...bid, status: "accepted" } // Accepted bid
          : { ...bid, status: "disabled" } // Disable other bids
      )
    );
  
    try {
      const response = await axios.put(
        `http://localhost:3001/bid/bid/${bidId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success) {
        toast.success("Bid accepted!");
        // Re-fetch project details and bids
        await dispatch(fetchProjectDetails(projectId)).unwrap();
        const updatedBids = await axios.get(
          `http://localhost:3001/bid/project/${projectId}/bids`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBids(updatedBids.data.bids); // Update bids with the latest data
      } else {
        throw new Error("Failed to accept bid.");
      }
    } catch (err) {
      // Revert changes on error
      setBids((prevBids) =>
        prevBids.map((bid) =>
          bid._id === bidId ? { ...bid, status: undefined } : bid
        )
      );
      toast.success("Bid accepted!");
    }
  };
  
  
  const handleRejectBid = async (bidId) => {
    // Optimistic UI update: Mark all bids as disabled
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid._id === bidId
          ? { ...bid, status: "accepted" } // Accepted bid
          : { ...bid, status: "disabled" } // Disable other bids
      )
    );
  
    try {
      const response = await axios.put(
        `http://localhost:3001/bid/bid/${bidId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success) {
        toast.success("Bid rejected");
        // Re-fetch project details and bids
        await dispatch(fetchProjectDetails(projectId)).unwrap();
        const updatedBids = await axios.get(
          `http://localhost:3001/bid/project/${projectId}/bids`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBids(updatedBids.data.bids); // Update bids with the latest data
      } else {
        throw new Error("Failed to accept bid.");
      }
    } catch (err) {
      // Revert changes on error
      setBids((prevBids) =>
        prevBids.map((bid) =>
          bid._id === bidId ? { ...bid, status: undefined } : bid
        )
      );
      toast.success("Bid rejected");
    }
  };
  
  
  

  // const handleRejectBid = async (bidId) => {
  //   try {
  //     console.log("Rejecting bid with ID:", bidId); // Debugging log
  //     const response = await axios.delete(
  //       `http://localhost:3001/bid/bid/${bidId}/reject`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log("Reject response:", response.data); // Debugging log
  
  //     if (response.data.success) {
  //       toast.success("Bid rejected!");
  //       // Remove rejected bid from local state
  //       setBids(bids.filter(bid => bid._id !== bidId));
  //     }
  //   } catch (err) {
  //     console.error("Reject bid error:", err); // Debugging log
  //     toast.error(err.response?.data?.error || "Failed to reject bid");
  //   }
  //   toast.success("Bid rejected!");
  // };
  

  if (loading || bidsLoading) return <Loading />;

  if (error) {
    toast.error(error);
    return null;
  }

  if (!projectDetails) return <p>No project details available</p>;

  return (
    <div className="ProjectDetails">
      <div className="container">
        <div className="section">
          <div className="projectDetailsHeader">Project Details</div>
          <div className="project-info">
            <h4>{projectDetails.project_title}</h4>
            <p>{projectDetails.description}</p>
            <p><strong>Skills Required:</strong> {projectDetails.skills_required}</p>
            <p><strong>Payment Type:</strong> {projectDetails.payment_type}</p>
            {projectDetails.payment_type === "hourly" && (
              <>
                <p><strong>Hourly Rate:</strong> ${projectDetails.hourly_rate}</p>
                <p><strong>Total Hours:</strong> {projectDetails.total_hours}</p>
              </>
            )}
            {projectDetails.payment_type !== "hourly" && (
              <p><strong>Total Days:</strong> {projectDetails.total_days}</p>
            )}
          </div>

          <div className="bids-section">
            <h4>Bids</h4>
            {bids.length === 0 ? (
              <p>No bids yet for this project.</p>
            ) : (
              <ul>
                {bids.map((bid) => (
  <div key={bid._id} className={`bid-item ${bid.status || "default"}`}>
    <strong>Bid Amount:</strong> ${bid.bidAmount} <br />
    <strong>Message:</strong> {bid.bidMessage} <br />
    <strong>Submitted By:</strong> {bid.userId?.username || "Unknown"} <br />
    <strong>Email:</strong> {bid.userId?.email || "Unknown"} <br />
    <strong>Status:</strong> {bid.status }
    

    <div>
      <button
        // disabled={bid.status === "accepted" || bid.status === "disabled"}
        onClick={() => handleAcceptBid(bid._id)}
      >
        Accept
      </button>
      <button
        // disabled={bid.status === "accepted" || bid.status === "disabled"}
        onClick={() => handleRejectBid(bid._id)}
      >
        Reject
      </button>
    </div>
  </div>
))}


              </ul>
            )}
          </div>
        </div>
        <ClientMenu active="projects" />
      </div>
    </div>
  );
}
