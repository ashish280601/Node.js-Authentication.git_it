import axios from "axios";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { OTPRequests, verifyOTP } from "../redux/authSlice";

const OTPVerify = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const input = useRef([]);
  const { isSession } = useSelector((state) => state.auth);

  const authentication = {
    headers: {
      Authorization: `Bearer ${isSession.token}`,
    },
  };

  const [localEmail, domainEmail] = isSession.email.split("@");
  let askTriekEmail = null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function maskEmail() {
    const maskLength = localEmail.length > 2 ? localEmail?.length - 2 : 1;
    const maskLocalEmail =
      localEmail[0] + "*".repeat(maskLength) + localEmail.slice(-1);
    askTriekEmail = `${maskLocalEmail}@${domainEmail}`;
    return askTriekEmail;
  }

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      input.current[index + 1].focus();
    }
  };

  const handleOTPRequest = async () => {
    try {
      const res = await dispatch(
        OTPRequests({ userID: isSession.userID, headers: authentication })
      ).unwrap();
      console.log("OTP request component", res);
      enqueueSnackbar("OTP Send Successfully", {
        variant: "success",
      });
      navigate("/otp/verify");
    } catch (error) {
      console.error("Error while requesting OTP verify", error);
      enqueueSnackbar("Error occurred while getting OTP", {
        variant: "error",
      });
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      enqueueSnackbar("Please enter a valid 6-digit OTP", {
        variant: "warning",
      });
      return;
    }
    handleVerifyOTP(otpValue);
  };

  const handleVerifyOTP = async (otp) => {
    console.log("function call");
    try {
      const res = await dispatch(verifyOTP({ otp, headers: authentication })).unwrap();
      console.log("res", res.data);
      enqueueSnackbar("OTP Verify Successfully", {
        variant: "success",
      });
      navigate("/forgetPassword");
    } catch (error) {
      console.error("Invalid OTP");
      enqueueSnackbar("Invalid OTP", {
        variant: "warning",
      });
      setOtp(["", "", "", "", "", ""]);
      input.current[0].focus();
    }
  };

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      input.current[index - 1].focus();
    }
  }

  maskEmail();

  return (
    <>
      <section className="otpverify_sec">
        <form className="otp-form" name="otp-form" onSubmit={handleOTPSubmit}>
          <div className="title">
            <h3>OTP VERIFICATION</h3>
            <p className="info">An OTP has been sent to {askTriekEmail}</p>
            <p className="msg">Please enter OTP to verify</p>
          </div>
          <div className="otp-input-fields">
            {otp.map((digit, index) => (
              <input
                type="text"
                key={index}
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (input.current[index] = el)}
              />
            ))}
          </div>
          <button type="submit" className="btn btn-primary">Verify OTP</button>
          <div className="result">
            <div className="ReSend_btn">
              <Link to="" onClick={handleOTPRequest}>ReSend OTP</Link>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default OTPVerify;
