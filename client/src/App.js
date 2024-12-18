import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import Profile from "./components/Profile";

import FreelancerDashboard from "./components/FreelancerComponents/FreelancerDashboard";
import FreelancerServices from "./components/FreelancerComponents/FreelancerServices";
import FreelancerCreateService from "./components/FreelancerComponents/FreelancerCreateService";
import FreelancerManageServices from "./components/FreelancerComponents/FreelancerManageServices";
import FreelancerUpdateService from "./components/FreelancerComponents/FreelancerUpdateService";
import FreelancerProjects from "./components/FreelancerComponents/FreelancerProjects.jsx";
import ServiceDetails from "./components/ServiceDetails";
import Grabtheworkdetails from "./components/grabthework_details.jsx";
import FreelancerBids from "./components/FreelancerComponents/FreelancerBids.jsx";

import ClientDashboard from "./components/ClientComponents/ClientDashboard";
import ClientFreelancers from "./components/ClientComponents/ClientFreelancers";
import ClientOrders from "./components/ClientComponents/ClientOrders";
import ClientProjects from "./components/ClientComponents/ClientProjects";
import ClientCreateProject from "./components/ClientComponents/ClientCreateProject";
import ClientManageProjects from "./components/ClientComponents/ClientManageProjects";
import ClientUpdateProject from "./components/ClientComponents/ClientUpdateProject";
import ProjectDetails from "./components/ProjectDetails.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/freelancer/:id">
            <Route index element={<FreelancerDashboard />} />
            <Route path="projects" element={<FreelancerProjects />} />
            <Route path="bids" element={<FreelancerBids />} />
            
            <Route
                path="/dashboard/freelancer/:id/projects/show/:projectId"
                element={<Grabtheworkdetails />}
              />

            <Route path="/dashboard/freelancer/:id/services">
              <Route index element={<FreelancerServices />} />
             
              <Route
                path="/dashboard/freelancer/:id/services/create"
                element={<FreelancerCreateService />}
              />
              <Route
                path="/dashboard/freelancer/:id/services/manage"
                element={<FreelancerManageServices />}
              />
              <Route
                path="/dashboard/freelancer/:id/services/update/:serviceId"
                element={<FreelancerUpdateService />}
              />
              <Route
                path="/dashboard/freelancer/:id/services/show/:serviceId"
                element={<ServiceDetails type="1" />}
              />
            </Route>
            <Route
              path="/dashboard/freelancer/:id/chat"
              element={<Chat type="freelancer" />}
            />
            <Route
              path="/dashboard/freelancer/:id/profile"
              element={<Profile type="1" />}
            />
          </Route>
          <Route path="/dashboard/client/:id">
            <Route index element={<ClientDashboard />} />
            <Route path="/dashboard/client/:id/projects" element={<ClientProjects />} />
          
              <Route
                path="/dashboard/client/:id/projects/create"
                element={<ClientCreateProject />}
              />
              <Route
                path="/dashboard/client/:id/projects/manage"
                element={<ClientManageProjects />}
              />
              <Route
                path="/dashboard/client/:id/projects/update/:projectId"
                element={<ClientUpdateProject />}
              />
              <Route
                path="/dashboard/client/:id/projects/show/:projectId"
                element={<ProjectDetails />}
              />
            
            <Route
              path="/dashboard/client/:id/services"
              element={<ClientFreelancers />}
            />
            <Route
              path="/dashboard/client/:id/services/show/:serviceId"
              element={<ServiceDetails type="2" />}
            />
            <Route
              path="/dashboard/client/:id/orders"
              element={<ClientOrders />}
            />
            <Route
              path="/dashboard/client/:id/order/show/:serviceId"
              element={<ServiceDetails type="3" />}
            />
            <Route
              path="/dashboard/client/:id/chat"
              element={<Chat type="2" />}
            />
            <Route
              path="/dashboard/client/:id/profile"
              element={<Profile type="2" />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
