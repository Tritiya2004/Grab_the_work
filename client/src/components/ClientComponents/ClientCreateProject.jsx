import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../Redux/ClientSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading";
import { toast } from "react-toastify";
import ClientMenu from "../ClientComponents/ClientMenu";
import './ClientCreateProject.css'


export default function ClientCreateProject() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [paymentType, setPaymentType] = useState("fixed");
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!projectTitle || !description || !skillsRequired || !paymentType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate hourly or fixed project requirements
    if (paymentType === "hourly" && !totalHours) {
      toast.error("Total hours are required for hourly projects.");
      return;
    }

    if (paymentType === "fixed" && !totalDays) {
      toast.error("Total days are required for fixed projects.");
      return;
    }

    // Create the project object
    const newProject = {
      project_title: projectTitle,
      description,
      skills_required: skillsRequired,
      payment_type: paymentType,
      hourly_rate: paymentType === "hourly" ? hourlyRate : null,
      total_hours: paymentType === "hourly" ? totalHours : null,
      total_days: paymentType === "fixed" ? totalDays : null,
    };

    // Dispatch the createProject action
    setLoading(true);
    dispatch(createProject({ projectData: { clientId: id, ...newProject } }))
      .unwrap()
      .then((data) => {
        setLoading(false);
        if (data.status === 200) {
          toast.success("Project created successfully!");
          navigate(`/dashboard/client/${id}/projects/manage`);
        } else {
          toast.error(data.msg || "Failed to create project.");
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error || "Something went wrong.");
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="ClientCreateProject">
        <div className="container">
          <div className="section">
            <div className="createHeader">Create Project</div>
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <label htmlFor="projectTitle">Project Title</label>
                <input
                  type="text"
                  id="projectTitle"
                  onChange={(e) => setProjectTitle(e.target.value)}
                  value={projectTitle}
                  placeholder="Project Title"
                  required
                />
              </div>
              <div className="form-section">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Project Description"
                  required
                ></textarea>
              </div>
              <div className="form-section">
                <label htmlFor="skillsRequired">Skills Required</label>
                <input
                  type="text"
                  id="skillsRequired"
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  value={skillsRequired}
                  placeholder="Skills Required"
                  required
                />
              </div>
              <div className="form-section">
                <label>Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  required
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
              {paymentType === "hourly" && (
                <>
                  <div className="form-section">
                    <label htmlFor="hourlyRate">Hourly Rate</label>
                    <input
                      type="number"
                      id="hourlyRate"
                      onChange={(e) => setHourlyRate(e.target.value)}
                      value={hourlyRate}
                      placeholder="Hourly Rate"
                      required
                    />
                  </div>
                  <div className="form-section">
                    <label htmlFor="totalHours">Total Hours</label>
                    <input
                      type="number"
                      id="totalHours"
                      onChange={(e) => setTotalHours(e.target.value)}
                      value={totalHours}
                      placeholder="Total Hours"
                      required
                    />
                  </div>
                </>
              )}
              {paymentType === "fixed" && (
                <div className="form-section">
                  <label htmlFor="totalDays">Total Days</label>
                  <input
                    type="number"
                    id="totalDays"
                    onChange={(e) => setTotalDays(e.target.value)}
                    value={totalDays}
                    placeholder="Total Days"
                    required
                  />
                </div>
              )}
              <button>Create Project</button>
            </form>
          </div>
          <ClientMenu active="projects" />
        </div>
      </div>
    </>
  );
}
