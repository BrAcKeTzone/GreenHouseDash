import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../api/api";
import Loader from "../components/common/Loader";

const Signin = () => {
  const Id = Cookies.get("SESSION_ID");
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (Id) {
      alert("Already Login!");
      Navigate("/dash");
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/^\S*$/, "Password cannot contain spaces")
      .required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/signin", {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        alert("Sign in successful!");
        if (response.data.user.id) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1);
          Cookies.set("SESSION_ID", JSON.stringify(response.data.user.id), {
            expires: expirationDate,
          });
        }
        Navigate("/dash");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Unauthorized: Invalid email or password.");
      } else if (error.response && error.response.status === 500) {
        setErrorMessage("Internal Server Error. Please try again later.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
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
            Sign In
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              {errorMessage && (
                <div className="text-red-500 text-xs mb-4">{errorMessage}</div>
              )}
              <div className="mb-4">
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

              <div className="mb-6">
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

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full p-3 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </Form>
          </Formik>
          <div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/sig" className="text-indigo-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
