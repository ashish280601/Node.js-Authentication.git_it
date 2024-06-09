import axios from "axios";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hostUrl } from "../../configUrl";
import { useState } from "react";
import OTPVerify from "../auth/OTPVerify";
import { OTPRequests } from "../redux/authSlice";

const Dashboard = ({ toggleAuth, onLogout }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { isSession } = useSelector((state) => state.auth);

  const handleOTPRequest = async () => {
    try {
      const authentication = {
        headers: {
          Authorization: `Bearer ${isSession.token}`,
        },
      };
      const res = await dispatch(OTPRequests({ userID: isSession.userID, headers: authentication })).unwrap();
      console.log("OTP request component", res);
      enqueueSnackbar("OTP Send Successfull", {
        variant: "success",
      });
      navigate("/otp/verify"); 
    } catch (error) {
      console.error("Error while requesting otp verfiy", error);
      enqueueSnackbar("Error occur while getting otp", {
        variant: "error",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      if (isSession.status === true) {  
        sessionStorage.clear();
        navigate("/login");
      } else {
        const res = await axios.get(`${hostUrl}/api/auth/logout`);
        console.log("Logout successful", res);
        enqueueSnackbar("Logout Successful", { variant: "success" });
        onLogout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
      enqueueSnackbar("Failed to logout", { variant: "error" });
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={handleOTPRequest} style={{ marginRight: 40 }}>
        Forget Password
      </button>
      <button onClick={handleSignOut}>Sign Out</button>
      <div id="child-routing"></div>
    </div>
  );
};

export default Dashboard;
