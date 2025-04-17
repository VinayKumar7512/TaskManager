import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/textbox";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";
import { loginUser, registerUser, clearError } from "../redux/slices/authSlice";
import axios from "axios";

const Login = () => {
  const { user, error: authError, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  // Clear errors when switching tabs
  useEffect(() => {
    setError(null);
    dispatch(clearError());
  }, [activeTab, dispatch]);

  // Watch email field for validation
  const email = watch("email");

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    dispatch(clearError());

    try {
      if (activeTab === 'login') {
        // Handle login
        const result = await dispatch(loginUser(data)).unwrap();
        if (result) {
          toast.success("Login successful!");
          navigate("/");
        }
      } else {
        // Handle registration
        const result = await dispatch(registerUser(data)).unwrap();
        if (result) {
          toast.success("Registration successful!");
          setActiveTab('login');
          reset();
        }
      }
    } catch (err) {
      // Check if the error is from the server
      if (err.message) {
        if (err.message.includes("Invalid email or password")) {
          // Check if the email exists
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/check-email`,
              { email }
            );
            if (!response.data.exists) {
              setError("Email not found. Please check your email or register.");
            } else {
              setError("Incorrect password. Please try again.");
            }
          } catch (checkErr) {
            setError("An error occurred while checking your email. Please try again.");
          }
        } else if (err.message.includes("deactivated")) {
          setError("Your account has been deactivated. Please contact the administrator.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An error occurred during login. Please try again.");
      }
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if email exists
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-4 md:p-8 gap-8">
        {/* left side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 flex flex-col gap-y-8"
        >
          <div className="flex flex-col gap-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
              Welcome to Task Manager
            </h1>
            <p className="text-gray-600 text-lg">
              A simple and efficient way to manage your tasks and stay organized.
            </p>
          </div>
        </motion.div>

        {/* right side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center"
        >
          <div className="w-full md:w-[400px] bg-white px-10 pt-14 pb-14 rounded-xl shadow-lg">
            {/* Tabs */}
            <div className="flex mb-8 border-b">
              <button
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === 'login'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === 'register'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-y-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    {activeTab === 'login' ? (
                      <FaUserCircle className="text-blue-600 text-4xl" />
                    ) : (
                      <FaUserPlus className="text-blue-600 text-4xl" />
                    )}
                  </div>
                </div>
                <p className="text-blue-600 text-3xl font-bold mb-2">
                  {activeTab === 'login' ? 'Welcome back!' : 'Create Account'}
                </p>
                <p className="text-center text-base text-gray-600">
                  {activeTab === 'login'
                    ? "We're glad to see you again. Please login to your account."
                    : "Fill in the details to create your account."}
                </p>
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error || authError}
                </div>
              )}

              <div className="flex flex-col gap-y-5">
                {activeTab === 'register' && (
                  <Textbox
                    placeholder="Full Name"
                    type="text"
                    name="name"
                    label="Full Name"
                    className="w-full rounded-lg"
                    register={register("name", {
                      required: "Full name is required!",
                    })}
                    error={errors.name?.message}
                  />
                )}

                <Textbox
                  placeholder="email@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  className="w-full rounded-lg"
                  register={register("email", {
                    required: "Email Address is required!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  error={errors.email?.message}
                />

                <Textbox
                  placeholder="your password"
                  type="password"
                  name="password"
                  label="Password"
                  className="w-full rounded-lg"
                  register={register("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  error={errors.password?.message}
                />

                {activeTab === 'register' && (
                  <>
                    <Textbox
                      placeholder="Role (e.g. Developer, Manager)"
                      type="text"
                      name="role"
                      label="Role"
                      className="w-full rounded-lg"
                      register={register("role", {
                        required: "Role is required!",
                      })}
                      error={errors.role?.message}
                    />
                  </>
                )}
              </div>

              <Button
                type="submit"
                label={
                  isLoading || status === 'loading'
                    ? activeTab === 'login'
                      ? 'Signing in...'
                      : 'Creating Account...'
                    : activeTab === 'login'
                    ? 'Sign In'
                    : 'Create Account'
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                disabled={isLoading || status === 'loading'}
              />
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;