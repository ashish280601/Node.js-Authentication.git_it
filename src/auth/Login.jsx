import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { hostUrl } from "../../configUrl";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector, useDispatch } from "react-redux";
import { googleAuthSlice, loginUser, togglePasswordVisibility } from "../redux/authSlice";

import loginimg from "../assets/images/loginimg.png";

const Login = ({onToggleAuth}) => {
  const [auth, setAuth] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { togglePassword, isLoading } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAuth((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleRecaptchaToken(token) {
    setRecaptchaToken(token);
  }

  function handleTogglePassword(field) {
    dispatch(togglePasswordVisibility(field))
  }

  const handleLoginUser = async (e) => {
    e.preventDefault();
    if (auth.name == "" || auth.email == "" || auth.password == "") {
      enqueueSnackbar("Please enter all the credential details", {
        variant: "warning"
      })
      return
    }
    if (!recaptchaToken) {
      enqueueSnackbar("Please verify the reCAPTCHA", {
        variant: "info",
      });
      return;
    }
    try {
      const userData = {
        email: auth.email,
        password: auth.password,
        "g-recaptcha-response": recaptchaToken,
      }
      const data = await dispatch(loginUser(userData)).unwrap();
      console.log("Login Successful component message: ", data);
      setAuth({});
      enqueueSnackbar("Login Successfull", {
        variant: "success",
        autoHideDuration: 5000,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error while login", error); -
        enqueueSnackbar("Unauthorized User", {
          variant: "warning",
          autoHideDuration: 5000,
        });
        window.location.reload();
    }
  };

  const handleGoogleCallback = async () => {
    try {
      // Initiate the Google login process and get the response
      window.location.href = `${hostUrl}/api/user/auth/google`;
    } catch (error) {
      console.error("Error during Google login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    // Extract query parameters from the URL
    console.log("call me....................................");
    const params = new URLSearchParams(window.location.search);
    console.log("call me1111111111111111");
    const status = params.get('status');
    console.log("call me2222")
    onToggleAuth(true);
    console.log("status", status);
    if (status !== null) {
      console.log("call me33333333333")
      const isAuthenticated = status === 'true';
      console.log("call me44444444444444444");
      if (isAuthenticated) {
        navigate('/dashboard'); // Redirect to dashboard or desired page
      } else {
        setError('Login failed. Please try again.');
      }
    }
  }, [location.search, onToggleAuth, navigate]);

  return (
    <section className="login_sec">
      <div className="container">
        <div className="row row-eq-height">
          <div className="col-md-6 left_box">
            <div className="cardbox">
              <div className="text-center">
                <h5 className="mb-0">Welcome Back!</h5>
                <p className="text-muted mt-2">
                  Sign in to continue to Dashboard.
                </p>
              </div>
              <div className="mt-4">
                <form onSubmit={handleLoginUser}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <div className="position-relative">
                      <input
                        name="email"
                        value={auth?.email || ""}
                        onChange={handleChange}
                        placeholder="Enter Email"
                        type="email"
                        id="email"
                        className="form-control bg-light border-light"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="Password">
                      Password
                    </label>
                    <div className="position-relative password_box">
                      <input
                        name="password"
                        value={auth?.password || ""}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        type={togglePassword.loginTogglePassword ? "text" : "Password"}
                        id="Password"
                        className="form-control bg-light border-light"
                      />
                      {togglePassword.loginTogglePassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          onClick={() => handleTogglePassword("loginTogglePassword")}
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          onClick={() => handleTogglePassword("loginTogglePassword")}
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  {/* <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      id="auth-remember-check"
                      className="form-check-input"
                    />
                    <label
                      htmlFor="auth-remember-check"
                      className="form-check-label"
                    >
                      Remember me
                    </label>
                  </div> */}
                  <ReCAPTCHA
                    sitekey="6LfGmucpAAAAABOS1QMm4VHlS4Fvj931VNaSkUp2"
                    onChange={handleRecaptchaToken}
                  />
                  <div className="mt-2">
                    <button type="submit" className="btn btn-primary w-100">
                      {isLoading ? (
                        <>
                          Sign In{"      "}
                          <img
                            alt="loading-gif"
                            src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
                            width="20"
                          />
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <div className="signin-other-title">
                    <h5 className="fs-15 mb-3 title">Sign in with</h5>
                  </div>
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <Link
                        className="social-list-item text-white"
                        style={{ color: "white" }}
                        onClick={handleGoogleCallback}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="100"
                          height="100"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                          <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                          ></path>
                          <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                          ></path>
                          <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                        </svg>
                      </Link>
                    </li>
                    {/* <li className="list-inline-item">
                      <a
                        className="social-list-item bg-info text-white border-info"
                        href="#"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="butt"
                          strokeLinejoin="bevel"
                        >
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        className="social-list-item bg-danger text-white border-danger"
                        href="#"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="butt"
                          strokeLinejoin="bevel"
                        >
                          <circle cx="12" cy="12" r="4"></circle>
                          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                        </svg>
                      </a>
                    </li> */}
                  </ul>
                </div>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link
                      className="fw-medium text-primary text-decoration-underline"
                      to="/signup"
                    >
                      SignUp now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 right_box">
            <div className="img_box">
              <img src={loginimg} alt="loginimg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
