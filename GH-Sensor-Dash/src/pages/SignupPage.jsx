import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import api from "../api/api";
import Loader from "../components/common/Loader";

const Signup = () => {
  const Id = Cookies.get("SESSION_ID");
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (Id) {
      alert("Already Login!");
      Navigate("/dash");
    }
  }, []);

  const startCountdown = () => {
    setIsOtpSent(true);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setIsOtpSent(false);
          setCountdown(300);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    otp: Yup.string()
      .matches(/^\d{6}$/, "Invalid Format")
      .required("OTP is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/^\S*$/, "Password cannot contain spaces")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const initialValues = {
    email: "",
    name: "",
    otp: "",
    password: "",
    confirmPassword: "",
  };

  const handleSendOtp = async (email) => {
    try {
      setIsSubmitting(true);
      const response = await api.post(`/auth/signup`, { email });
      if (response.status === 200) {
        startCountdown();
        alert(
          "We've sent an OTP to " +
            email +
            ". Check your inbox and enter the code to verify your account."
        );
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response && error.response.status === 400) {
        alert("Email address may already be in use");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/vsignup", {
        email: values.email,
        name: values.name,
        otp: values.otp,
        password: values.password,
      });

      if (response.status === 201) {
        alert("Sign up successful!");
        Navigate("/");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <Loader />}
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Sign Up
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                {errorMessage && (
                  <div className="text-red-500 text-xs mb-4">
                    {errorMessage}
                  </div>
                )}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="w-[30%] flex flex-col justify-end">
                    <button
                      type="button"
                      className="w-full p-3 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      onClick={() => handleSendOtp(values.email)}
                      disabled={isOtpSent || isSubmitting}
                    >
                      {isOtpSent ? `${countdown}s` : "Send OTP"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="w-[30%]">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-600"
                    >
                      OTP
                    </label>
                    <Field
                      type="text"
                      id="otp"
                      name="otp"
                      maxLength="6"
                      className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full mt-2 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full p-3 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Sign Up"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
