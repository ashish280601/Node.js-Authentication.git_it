import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostUrl } from "../../configUrl";

export const signUpUser = createAsyncThunk(
  "signup/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${hostUrl}/api/user/signup`, userData);
      console.log("singup successful", res.data);
      return res.data;
    } catch (error) {
      console.log("Failed to create account", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/login/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${hostUrl}/api/user/login`, userData);
      console.log("Login Successful", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while login", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const OTPRequests = createAsyncThunk(
  "otp/request",
  async ({ userID, headers }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${hostUrl}/api/user/request-reset-password`,
        { userID },
        headers
      );
      console.log("OTP send successfull to mail", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while requesting otp", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "otp/verify",
  async ({ otp, headers }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${hostUrl}/api/user/verify-otp`,
        { otp },
        headers
      );
      console.log("OTP verify successfull", res.data);
      return res.data;
    } catch (error) {
      console.error("Invalid OTP", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "forget/forgetPassword",
  async ({ newPassword, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${hostUrl}/api/user/resetPassword`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Password reset successful", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while changing password", error);
      return rejectWithValue(error.res.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userLogin: null,
    otpRequest: null,
    verifyOTP: null,
    resetPassword: null,
    isLoading: false,
    isSession: JSON.parse(sessionStorage.getItem("userData")) || null,
    togglePassword: {
      loginTogglePassword: false,
      signUpTogglePassword: false,
      newPassword: false,
      confirmPassword: false,
    },
    error: null,
  },
  reducers: {
    // it is used to handle synchronous data}
    togglePasswordVisibility: (state, action) => {
      const field = action.payload;
      state.togglePassword[field] = !state.togglePassword[field];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLogin = action.payload;
        console.log("actioon payload", action.payload);
        state.isSession = action.payload.data;
        sessionStorage.setItem("userData", JSON.stringify(state.isSession));
        console.log("session data", state.isSession);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(OTPRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OTPRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpRequest = action.payload;
      })
      .addCase(OTPRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifyOTP = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetPassword = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { togglePasswordVisibility } = authSlice.actions;
export const authReducer = authSlice.reducer;
