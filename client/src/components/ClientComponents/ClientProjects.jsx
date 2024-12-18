import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../Redux/ClientSlice"; // Ensure the action is correctly imported
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from "react-router-dom";
import Loading from './../Loading';
import { tokenExists } from './../../Redux/UserSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ClientMenu from "../ClientComponents/ClientMenu";
import './ClientCreateProject.css'

export default function ClientProjects() {
    const { id } = useParams(); // assuming client ID is in params
    const { token } = useSelector(state => state.user);  // Select token from user slice
    const { projects = [], status, message } = useSelector(state => state.client);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    useEffect(() => {
        // Check if the token exists and if the user is a client
        tokenExists(token, navigate, dispatch).then(data => {
            if (data === false || JSON.parse(localStorage.getItem('userInfo')).role !== "client" || JSON.parse(localStorage.getItem('userInfo'))._id !== id) {
                navigate("/login");
            }
        });
    
        // Dispatch the getProjects action to fetch projects
        dispatch(getProjects(id)).unwrap().then(data => {
            setLoading(false);
            console.log("Fetched Projects Data:", data); // Log the data to see what is returned
            if (data.status !== 200) {
                toast.error(data.msg || message);
            }
        }).catch(error => {
            setLoading(false);
            toast.error(error?.message || "An error occurred while fetching the projects.");
        });
    
    }, [dispatch, id, token, navigate]);
    

    // Debugging - log the state
    console.log("Projects state:", projects);

    return (
        <>
            {loading && <Loading />}
            <div className="ClientProjects">
                <div className="container">
                    <div className="section">
                        <div className="buttons">
                            <HashLink to={`/dashboard/client/${id}/projects/create`}><button>Create Project</button></HashLink>
                            <HashLink to={`/dashboard/client/${id}/projects/manage`}><button>Manage Projects</button></HashLink>
                        </div>

                        <button onClick={() => navigate(-1)}>Go Back</button>

                        <div className="projectsHeader">Client Projects</div>

                        <div className="projectsList">
                            {/* Ensure projects is an array */}
                            {Array.isArray(projects) && projects.length > 0 ? (
                                projects.map((project) => (
                                    <div key={project._id} className="project-item">
                                        <h4>{project.project_title}</h4>
                                        <p>{project.description}</p>
                                    
                                        <button onClick={() => navigate(`/dashboard/client/${id}/projects/show/${project._id}`)}>
                                        
                                            VIEW BIDS
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div>No Projects Available</div>
                            )}
                        </div>
                    </div>
                    <ClientMenu active="projects" />
                </div>
            </div>
        </>
    );
}
