import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProjects, deleteProject } from "../../Redux/ClientSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import { toast } from "react-toastify";
import ClientMenu from "../ClientComponents/ClientMenu";
import Loading from './../Loading';

export default function ClientManageProjects() {
    const { id } = useParams();
    const { token } = useSelector(state => state.user);
    const { projects } = useSelector(state => state.client);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        dispatch(getProjects(id)).unwrap().then(data => {
            setLoading(false);
            if (data.status !== 200) {
                toast.error(data.msg);
            }
        }).catch(error => {
            setLoading(false);
            toast.error(error);
        });
    }, [dispatch, id, token]);

    const handleDelete = (projectId) => {
        dispatch(deleteProject(projectId))
          .unwrap()
          .then((data) => {
            toast.success("Project deleted successfully");
            // Re-fetch the updated list of projects
            dispatch(getProjects(id));
          })
          .catch((error) => {
            toast.error("Error: " + error);
          });
      };
      

    return (
        <>
            {loading && <Loading />}
            <div className="ClientManageProjects">
                <div className="container">
                    <div className="section">
                        <div className="manageHeader">
                            Manage Projects
                        </div>
                        <div className="projectsList">
                            {projects && projects.map(project => (
                                <div key={project._id} className="project-item">
                                    <h4>{project.title}</h4>
                                    <p>{project.description}</p>
                                    <button onClick={() => navigate(`/dashboard/client/${id}/projects/update/${project._id}`)}>Edit</button>
                                    <br></br>
                                    <button onClick={() => handleDelete(project._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ClientMenu active="projects" />
                </div>
            </div>
        </>
    );
}
