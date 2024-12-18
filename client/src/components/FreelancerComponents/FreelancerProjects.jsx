import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../Redux/FreelancerSlice";
import { useNavigate } from "react-router-dom";
import Loading from './../Loading';
import { toast } from 'react-toastify';
import { tokenExists } from './../../Redux/UserSlice';
import { useParams } from 'react-router-dom';
import FreelancerMenu from "../FreelancerComponents/FreelancerMenu";
import axios from "axios"; // For API calls


export default function FreelancerProjects() {
    const { id } = useParams(); // Assuming freelancer ID is in params
    const { token } = useSelector(state => state.user);  // Select token from user slice
    const { projects = [], status, message } = useSelector(state => state.freelancer); // Projects data from state

    const [loading, setLoading] = useState(true);
    const [bids, setBids] = useState([]);
    const [bidsLoading, setBidsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Token:", token);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("User Info:", userInfo);

        tokenExists(token, navigate, dispatch).then(data => {
            if (data === false || JSON.parse(localStorage.getItem('userInfo')).role !== "freelancer" || JSON.parse(localStorage.getItem('userInfo'))._id !== id) {
                navigate("/login");
            }
        });

        dispatch(getProjects(id))
            .unwrap()
            .then((data) => {
                console.log("Projects fetched successfully:", data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
                setLoading(false);
                toast.error(error?.message || "An error occurred while fetching the projects.");
            });

    }, [dispatch, id, token, navigate]);

    // Function to fetch bids made by the user
    
    return (
        <>
            {loading && <Loading />}
            <div className="FreelancerProjects">
                <div className="container">
                    <div className="section">
                        <button onClick={() => navigate(-1)}>Go Back</button>
                        <br></br>
                        <button 
    onClick={() => navigate(`/dashboard/freelancer/${id}/bids`)} 
    className="btn-view-bids"
>
    View My Bids
</button>

                        <div className="projectsHeader">Projects Available</div>

                        <div className="projectsList">
                            {/* Ensure projects is an array */}
                            {Array.isArray(projects) && projects.length > 0 ? (
                                projects.map((project) => (
                                    <div key={project._id} className="project-item">
                                        <h4>{project.project_title}</h4>
                                        <p>{project.description}</p>
                                        <button onClick={() => navigate(`/dashboard/freelancer/${id}/projects/show/${project._id}`)}>
                                            View Details
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div>No Projects Available</div>
                            )}
                        </div>

                        {/* Button to view all bids made by the freelancer */}
            

                        
    

                    </div>
                    <FreelancerMenu active="projects" />
                </div>
            </div>
        </>
    );
}
