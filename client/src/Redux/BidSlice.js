import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for creating a bid
export const createBid = createAsyncThunk(
  "bids/createBid",
  async ({ projectId, bidAmount, bidMessage, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/bid/bids", // Adjusted route to match the backend route
        { projectId, bidAmount, bidMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Successful response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create bid"
      );
    }
  }
);

// Async thunk for fetching bids by project
export const fetchBidsByProject = createAsyncThunk(
  "bids/fetchBidsByProject",
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/bid/project/${projectId}/bids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Successful response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch bids"
      );
    }
  }
);

// Async thunk for fetching a specific bid by ID
export const fetchBidById = createAsyncThunk(
  "bids/fetchBidById",
  async ({ bidId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/bid/bid/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Successful response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch bid"
      );
    }
  }
);

// Async thunk for updating a bid
export const updateBid = createAsyncThunk(
  "bids/updateBid",
  async ({ bidId, bidAmount, bidMessage, status, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/bid/bid/${bidId}`, // Adjusted route to match the backend route
        { bidAmount, bidMessage, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Successful response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update bid"
      );
    }
  }
);

// Async thunk for deleting a bid
export const deleteBid = createAsyncThunk(
  "bids/deleteBid",
  async ({ bidId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/bid/bid/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Successful response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete bid"
      );
    }
  }
);

// Bid slice
const bidSlice = createSlice({
  name: "bids",
  initialState: {
    bids: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle createBid
    builder
      .addCase(createBid.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bids.push(action.payload); // Add new bid
      })
      .addCase(createBid.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle fetchBidsByProject
    builder
      .addCase(fetchBidsByProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBidsByProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bids = action.payload; // Set fetched bids
      })
      .addCase(fetchBidsByProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle fetchBidById
    builder
      .addCase(fetchBidById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBidById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.bids.findIndex(bid => bid._id === action.payload.bid._id);
        if (index !== -1) {
          state.bids[index] = action.payload.bid; // Update the bid in the array
        } else {
          state.bids.push(action.payload.bid); // Add the bid if not found
        }
      })
      .addCase(fetchBidById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle updateBid
    builder
      .addCase(updateBid.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBid.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.bids.findIndex(bid => bid._id === action.payload.bid._id);
        if (index !== -1) {
          state.bids[index] = action.payload.bid; // Update the bid in the array
        }
      })
      .addCase(updateBid.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Handle deleteBid
    builder
      .addCase(deleteBid.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBid.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bids = state.bids.filter(bid => bid._id !== action.payload.bidId); // Remove the deleted bid
      })
      .addCase(deleteBid.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default bidSlice.reducer;
