import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "./myAxios";

// Existing thunks (orders, testimonials, etc.)

export const myDashboard = createAsyncThunk(
  "client/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/client/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const freelancersServices = createAsyncThunk(
  "client/allServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/client/allServices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const serviceInfo = createAsyncThunk(
  "client/serviceInfo",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const getOrders = createAsyncThunk(
  "client/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const orderInfo = createAsyncThunk(
  "client/orderInfo",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const makeOrder = createAsyncThunk(
  "client/makeOrder",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(
        `/client/order`,
        { serviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "client/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put(
        `/client/order/${orderId}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const makeTestimonial = createAsyncThunk(
  "client/makeTestimonial",
  async ({ orderId, text, rating }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(
        `/client/testimonial/${orderId}`,
        { text, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

// New Project CRUD related actions
export const createProject = createAsyncThunk(
  "client/createProject",
  async ({ projectData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log();
      
      const res = await myAxios.post("/project/project", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const getProjects = createAsyncThunk(
  "client/getProjects",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/project/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e)      {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'project/fetchDetails',
  async (projectId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await myAxios.get(`/project/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.project;
    } catch (e) {
      if (e.message === 'Network Error') {
        return rejectWithValue('Check The Server');
      }
      return rejectWithValue(e.response?.data?.msg || 'Error occurred');
    }
  }
);

export const updateProject = createAsyncThunk(
  "client/updateProject",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put(
        `/project/project/${projectId}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message === "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const deleteProject = createAsyncThunk(
  "client/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      
      const token = localStorage.getItem("token");
      const res = await myAxios.delete(`/project/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        
      });
      return projectId; 
    ;// returning the project ID to remove it from the state
    } catch (e) {
      // Improved error handling for server responses
      if (e.response) {
        // Server responded with an error
        return rejectWithValue(e.response.data?.msg || "Failed to delete project");
      }
      if (e.message === "Network Error") {
        return rejectWithValue("Check the server");
      }
      // Generic error fallback
      return rejectWithValue("An unexpected error occurred");
    }
  }
);


// Slice reducer logic
const clientSlice = createSlice({
  name: "client",
  initialState: {
    data: [],
    projects: [], // List of projects
    projectDetails: null,
    error: null,
  },
  extraReducers: (builder) => {
    // Existing cases (orders, testimonials, etc.)
     // Get Client Dashboard
     builder.addCase(myDashboard.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myDashboard.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Freelancers Services
    builder.addCase(freelancersServices.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(freelancersServices.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Service Info
    builder.addCase(serviceInfo.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(serviceInfo.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Orders Info
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Order Info
    builder.addCase(orderInfo.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(orderInfo.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Make Order
    builder.addCase(makeOrder.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(makeOrder.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Update Order Status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Make Testimonial
    builder.addCase(makeTestimonial.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(makeTestimonial.rejected, (state, action) => {
      state.error = action.payload;
    });
  
    // Projects CRUD cases
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(fetchProjectDetails.fulfilled, (state, action) => {
      state.projectDetails = action.payload;
      state.error = null;
    });
    builder.addCase(fetchProjectDetails.rejected, (state, action) => {
      state.projectDetails = null;
      state.error = action.payload;
    });
    builder.addCase(fetchProjectDetails.pending, (state) => {
      state.error = null; // Reset error when fetching starts
    });

    builder.addCase(getProjects.fulfilled, (state, action) => {
      state.projects = action.payload.projects;
    });
    builder.addCase(getProjects.rejected, (state, action) => {
      state.error = action.error.message;
    });

    builder.addCase(updateProject.fulfilled, (state, action) => {
      const updatedProjects = state.data.map((project) =>
        project._id === action.payload._id ? action.payload : project
      );
      state.data = updatedProjects;
    });
    builder.addCase(updateProject.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(deleteProject.fulfilled, (state, action) => {
      // Update the 'projects' list by filtering out the deleted project
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload
      );
      // Optionally update 'data' if it also contains projects
      state.data = state.data.filter(
        (project) => project._id !== action.payload
      );
    });

    builder.addCase(deleteProject.rejected, (state, action) => {
      // Set the error state with the rejection message
      state.error = action.payload;
    });
  },
});

export default clientSlice.reducer;




/*import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "./myAxios";

export const myDashboard = createAsyncThunk(
  "client/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/client/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const freelancersServices = createAsyncThunk(
  "client/allServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/client/allServices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const serviceInfo = createAsyncThunk(
  "client/serviceInfo",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const getOrders = createAsyncThunk(
  "client/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const orderInfo = createAsyncThunk(
  "client/orderInfo",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/client/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const makeOrder = createAsyncThunk(
  "client/makeOrder",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(
        `/client/order`,
        { serviceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "client/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put(
        `/client/order/${orderId}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);

export const makeTestimonial = createAsyncThunk(
  "client/makeTestimonial",
  async ({ orderId, text, rating }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(
        `/client/testimonial/${orderId}`,
        { text, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server");
      }
    }
  }
);
const clientSlice = createSlice({
  name: "client",
  initialState: {
    data: [],
    error: null,
  },
  extraReducers: (builder) => {
    // Get Client Dashboard
    builder.addCase(myDashboard.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myDashboard.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Freelancers Services
    builder.addCase(freelancersServices.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(freelancersServices.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Service Info
    builder.addCase(serviceInfo.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(serviceInfo.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Orders Info
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Order Info
    builder.addCase(orderInfo.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(orderInfo.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Make Order
    builder.addCase(makeOrder.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(makeOrder.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Update Order Status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Make Testimonial
    builder.addCase(makeTestimonial.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(makeTestimonial.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default clientSlice.reducer;
*/
