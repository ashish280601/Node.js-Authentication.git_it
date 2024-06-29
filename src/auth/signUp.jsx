import axios from "axios";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { hostUrl } from "../../configUrl";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector, useDispatch } from "react-redux";
import loginimg from "../assets/images/loginimg.png";
import { signUpUser, togglePasswordVisibility } from "../redux/authSlice";

const SignUp = () => {
  const [signUp, setSignUp] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useSelector is used to fetch the data from the store
  const { togglePassword, isLoading, error } = useSelector((state) => state.auth);

  function handleChange(e) {
    const { name, value } = e.target;
    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRecaptchaToken(token) {
    setRecaptchaToken(token);
  }

  const handleTogglePassword = (field) => {
    dispatch(togglePasswordVisibility(field));
  };

  async function handleSignUp(e) {
    e.preventDefault();
    if (signUp.name == "" || signUp.email == "" || signUp.password == "") {
      enqueueSnackbar("Please enter all the credential details", {
        variant: "warning",
      });
      return;
    }
    if (!recaptchaToken) {
      enqueueSnackbar("Please verify the reCAPTCHA", {
        variant: "info",
      });
      return;
    }
    const userData = {
      name: signUp.name,
      email: signUp.email,
      password: signUp.password,
      "g-recaptcha-response": recaptchaToken,
    };
    try {
      const res = await dispatch(signUpUser(userData)).unwrap();
      console.log("Signup component response", res);
      setSignUp({});
      enqueueSnackbar("Account Created Successfully", {
        variant: "success",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to create user account", {
        variant: "error",
      });
    }
  }

  const handleGoogleAuth = () => {
    console.log("button click");
    window.location.href = `${hostUrl}/api/auth/google`;
  };

  return (
    <>
      <section className="login_sec">
        <div className="container">
          <div className="row row-eq-height">
            <div className="col-md-6 left_box">
              <div className="cardbox">
                <div className="text-center">
                  <h5 className="mb-0">Create New Account</h5>
                  <p className="text-muted mt-2">Get your account now</p>
                </div>
                <div className="mt-4">
                  <form onSubmit={handleSignUp}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="username">
                        Name
                      </label>
                      <div className="position-relative">
                        <input
                          name="name"
                          value={signUp?.name || ""}
                          placeholder="Enter name"
                          type="text"
                          className="form-control bg-light border-light"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="username">
                        Email
                      </label>
                      <div className="position-relative">
                        <input
                          name="email"
                          value={signUp?.email || ""}
                          placeholder="Enter Email"
                          type="email"
                          className="form-control bg-light border-light"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="Password ">
                        Password
                      </label>
                      <div className="position-relative password_box">
                        <input
                          name="password"
                          value={signUp?.password || ""}
                          placeholder="Enter Password"
                          type={togglePassword.signUpTogglePassword ? "text" : "Password"}
                          className="form-control bg-light border-light"
                          onChange={handleChange}
                        />
                        {togglePassword.signUpTogglePassword ? (
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
                            onClick={() => handleTogglePassword("signUpTogglePassword")}
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
                            onClick={() => handleTogglePassword("signUpTogglePassword")}
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
                    <ReCAPTCHA
                      sitekey="6LfGmucpAAAAABOS1QMm4VHlS4Fvj931VNaSkUp2"
                      onChange={handleRecaptchaToken}
                    />
                    <div className="mt-2">
                      <button type="submit" className="btn btn-primary w-100">
                        {isLoading ? (
                          <>
                            Sign Up{"      "}
                            <img
                              alt="loading-gif"
                              src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
                              width="20"
                            />
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                    </div>
                  </form>
                  <div className="mt-4 text-center">
                    <div className="signin-other-title">
                      <h5 className="fs-15 mb-3 title">Create account with</h5>
                    </div>
                    <ul className="list-inline">
                      <li className="list-inline-item">
                        <Link
                          className="social-list-item text-white"
                          href="#"
                          style={{ color: "white" }}
                          onClick={handleGoogleAuth}
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
                    </ul>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <Link
                        className="fw-medium text-primary text-decoration-underline"
                        to="/"
                      >
                        SignIn
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
    </>
  );
};

export default SignUp;
