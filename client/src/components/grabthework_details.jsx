import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectDetails } from "../Redux/ClientSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { toast } from "react-toastify";
import ClientMenu from "./ClientComponents/ClientMenu";
import "../index.css"; // Import CSS file for styling
import axios from "axios"; // Axios for API calls import bidReducer from "../Redux/BidSlice"; // Import the BidSlice



export default function ProjectDetails() {
  const { projectId } = useParams(); // Extract projectId from route params
  const { token } = useSelector((state) => state.user); // User token from Redux state
  const { projectDetails, error } = useSelector((state) => state.client); // Project details and error from Redux state
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state
  const [bidAmount, setBidAmount] = useState(""); // State for bid amount
  const [bidMessage, setBidMessage] = useState(""); // State for bid message
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
      return;
    }

    dispatch(fetchProjectDetails(projectId))
      .unwrap()
      .then(() => setLoading(false)) // Stop loading on success
      .catch((err) => {
        setLoading(false); // Stop loading on failure
        toast.error(err || "Failed to fetch project details");
      });
  }, [dispatch, projectId, token, navigate]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!bidAmount || !bidMessage) {
      toast.error("Please fill in all fields before submitting the bid.");
      return;
    }

    try {
      // API request to create a bid
      const response = await axios.post(
        "http://localhost:3001/bid/bids",
        {
          projectId,
          bidAmount,
          bidMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass the token in the headers
        }
      );

      toast.success("Your bid has been submitted successfully!");
      setBidAmount(""); // Reset form fields
      setBidMessage("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit bid");
    }
  };

  // Show loading spinner while fetching
  if (loading) return <Loading />;

  // Handle API errors
  if (error) {
    toast.error(error);
    return null;
  }

  // Fallback if projectDetails is missing
  if (!projectDetails) return <p>No project details available</p>;

  // Display the project details
  return (
    <div className="ProjectDetails">
      <div className="container">
        <div className="section">
          <div className="projectDetailsHeader">Project Details</div>
          <div className="project-info">
            <h4>{projectDetails.project_title}</h4>
            <p>{projectDetails.description}</p>
            <p>
              <strong>Skills Required:</strong> {projectDetails.skills_required}
            </p>
            <p>
              <strong>Payment Type:</strong> {projectDetails.payment_type}
            </p>
            {projectDetails.payment_type === "hourly" && (
              <>
                <p>
                  <strong>Hourly Rate:</strong> ${projectDetails.hourly_rate}
                </p>
                <p>
                  <strong>Total Hours:</strong> {projectDetails.total_hours}
                </p>
              </>
            )}
            {projectDetails.payment_type !== "hourly" && (
              <p>
                <strong>Total Days:</strong> {projectDetails.total_days}
              </p>
            )}
          </div>
          <div className="bid-section">
            <h4>Make a Bid</h4>
            <form onSubmit={handleBidSubmit}>
              <div className="form-group">
                <label htmlFor="bidAmount">Bid Amount ($)</label>
                <input
                  type="number"
                  id="bidAmount"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bidMessage">Message</label>
                <textarea
                  id="bidMessage"
                  placeholder="Why are you the best fit for this project?"
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                Submit Bid
              </button>
            </form>
          </div>
        </div>
        <ClientMenu active="projects" />
      </div>
    </div>
  );
}
