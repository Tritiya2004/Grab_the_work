import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import myAxios from "./myAxios";

export const myDashboard = createAsyncThunk(
  "freelancer/myDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/freelancer/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server11");
      }
    }
  }
);

export const getProjects = createAsyncThunk(
  "freelancer/getProjects",
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

export const myServices = createAsyncThunk(
  "freelancer/myServices",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get("/freelancer/myServices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server12");
      }
    }
  }
);


export const showService = createAsyncThunk(
  "freelancer/showService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.get(`/freelancer/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server13");
      }
    }
  }
);

export const createService = createAsyncThunk(
  "freelancer/createService",
  async (body, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.post(`/freelancer/service`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server14");
      }
    }
  }
);

export const updateService = createAsyncThunk(
  "freelancer/updateService",
  async ({ serviceId, body }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.put(`/freelancer/service/${serviceId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server15");
      }
    }
  }
);

export const deleteService = createAsyncThunk(
  "freelancer/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await myAxios.delete(`/freelancer/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.message == "Network Error") {
        return rejectWithValue("Check The Server16");
      }
    }
  }
);

const freelancerSlice = createSlice({
  name: "freelancer",
  initialState: {
    data: [],
    error: null,
    projects: [], // List of projects
    projectDetails: null,
    status: "idle",
    message: null,
    
  },
  extraReducers: (builder) => {
    // Get Freelancer Dashboard
    builder.addCase(myDashboard.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myDashboard.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Get Freelancer Services
    builder.addCase(myServices.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(myServices.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Show Service Info
    builder.addCase(showService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(showService.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Create Freelancer Service
    builder.addCase(createService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(createService.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Edit Freelancer Service
    builder.addCase(updateService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(updateService.rejected, (state, action) => {
      state.error = action.payload;
    });
    // Delete Freelancer Service
    builder.addCase(deleteService.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(deleteService.rejected, (state, action) => {
      state.error = action.payload;
    });

    // builder.addCase(getProjects.fulfilled, (state, action) => {
    //   state.projects = action.payload.projects;
    // });
    // builder.addCase(getProjects.rejected, (state, action) => {
    //   state.error = action.error.message;
    // });

    builder
    .addCase(getProjects.pending, (state) => {
      state.status = "loading";
    })
    .addCase(getProjects.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.projects = action.payload.projects || []; // Ensure correct structure
    })
    .addCase(getProjects.rejected, (state, action) => {
      state.status = "failed";
      state.message = action.payload || "Error fetching projects";
    });

    
   
  },
});

export default freelancerSlice.reducer;
