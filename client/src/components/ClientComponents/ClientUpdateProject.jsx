import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProject, getProjects } from "../../Redux/ClientSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from './../Loading';
import { toast } from "react-toastify";
import ClientMenu from "../ClientComponents/ClientMenu";

export default function ClientUpdateProject() {
    const { id, projectId } = useParams();
    const { token } = useSelector(state => state.user);
    const { selectedProject } = useSelector(state => state.client);
    const [projectTitle, setProjectTitle] = useState(""); // Renamed to projectTitle for consistency
    const [description, setDescription] = useState("");
    const [skillsRequired, setSkillsRequired] = useState("");
    const [paymentType, setPaymentType] = useState("fixed"); // Default to "fixed"
    const [hourlyRate, setHourlyRate] = useState("");
    const [totalHours, setTotalHours] = useState("");
    const [totalDays, setTotalDays] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        dispatch(getProjects({ clientId: id, projectId }))
            .unwrap()
            .then(data => {
                setLoading(false);
                if (data.status === 200) {
                    setProjectTitle(data.project.project_title); // Updated to match variable from the backend
                    setDescription(data.project.description);
                    setSkillsRequired(data.project.skills_required);
                    setPaymentType(data.project.payment_type);
                    setHourlyRate(data.project.hourly_rate || "");
                    setTotalHours(data.project.total_hours || "");
                    setTotalDays(data.project.total_days || "");
                } else {
                    toast.error(data.msg);
                }
            })
            .catch(error => {
                setLoading(false);
                toast.error(error);
            });
    }, [dispatch, id, projectId, token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedProject = {
            project_title: projectTitle, // Updated to match variable names in backend
            description,
            skills_required: skillsRequired,
            payment_type: paymentType,
            hourly_rate: paymentType === "hourly" ? hourlyRate : null,
            total_hours: paymentType === "hourly" ? totalHours : null,
            total_days: paymentType === "fixed" ? totalDays : null,
        };

        dispatch(updateProject({ projectId, projectData: updatedProject }))
            .unwrap()
            .then(data => {
                setLoading(false);
                if (data.status === 200) {
                    toast.success("Project updated successfully!");
                    navigate(`/dashboard/client/${id}/projects/manage`);
                } else {
                    toast.error(data.msg);
                }
            })
            .catch(error => {
                setLoading(false);
                toast.error(error);
            });
    };

    return (
        <>
            {loading && <Loading />}
            <div className="ClientUpdateProject">
                <div className="container">
                    <div className="section">
                        <div className="updateHeader">Update Project</div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-section">
                                <label htmlFor="projectTitle">Title</label>
                                <input type="text" id="projectTitle" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Project Title" required />
                            </div>
                            <div className="form-section">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Project Description" required></textarea>
                            </div>
                            <div className="form-section">
                                <label htmlFor="skillsRequired">Skills Required</label>
                                <input type="text" id="skillsRequired" value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} placeholder="Skills Required" required />
                            </div>
                            <div className="form-section">
                                <label htmlFor="paymentType">Payment Type</label>
                                <select id="paymentType" value={paymentType} onChange={e => setPaymentType(e.target.value)} required>
                                    <option value="fixed">Fixed</option>
                                    <option value="hourly">Hourly</option>
                                </select>
                            </div>
                            {paymentType === "hourly" && (
                                <>
                                    <div className="form-section">
                                        <label htmlFor="hourlyRate">Hourly Rate</label>
                                        <input type="number" id="hourlyRate" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="Hourly Rate" required />
                                    </div>
                                    <div className="form-section">
                                        <label htmlFor="totalHours">Total Hours</label>
                                        <input type="number" id="totalHours" value={totalHours} onChange={e => setTotalHours(e.target.value)} placeholder="Total Hours" required />
                                    </div>
                                </>
                            )}
                            {paymentType === "fixed" && (
                                <div className="form-section">
                                    <label htmlFor="totalDays">Total Days</label>
                                    <input type="number" id="totalDays" value={totalDays} onChange={e => setTotalDays(e.target.value)} placeholder="Total Days" required />
                                </div>
                            )}
                            <button>Update Project</button>
                        </form>
                    </div>
                    <ClientMenu active="projects" />
                </div>
            </div>
        </>
    );
}
