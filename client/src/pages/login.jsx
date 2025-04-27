import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/textbox";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { loginUser, clearError } from "../redux/slices/authSlice";
import "../styles/animations.css";

const Login = () => {
  const { user, error: authError, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  // Clear errors when component mounts
  useEffect(() => {
    setError(null);
    dispatch(clearError());
  }, [dispatch]);

  const submitHandler = async (data) => {
    setIsLoading(true);
    setError(null);
    dispatch(clearError());

    try {
      const result = await dispatch(loginUser(data)).unwrap();
      if (result) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-blue-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-purple-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-pink-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 py-8 lg:py-0 relative z-10">
        {/* Left side - Task Manager Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-2/3 flex flex-col gap-y-6 lg:gap-y-8"
        >
          <div className="flex flex-col gap-y-4 backdrop-blur-sm bg-white/30 p-6 sm:p-8 rounded-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">
              Welcome to Task Manager
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              A simple and efficient way to manage your tasks and stay organized.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-4 sm:p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-2 sm:p-3 rounded-lg shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Task Organization</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Create, organize, and track tasks with ease</p>
              </div>
            </div>

            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-4 sm:p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-2 sm:p-3 rounded-lg shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Task Analytics</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Get insights and track your productivity</p>
              </div>
            </div>

            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-4 sm:p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-2 sm:p-3 rounded-lg shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Progress Tracking</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Monitor task progress and deadlines</p>
              </div>
            </div>

            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-4 sm:p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-2 sm:p-3 rounded-lg shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Priority Management</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Set and manage task priorities effectively</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/3 flex flex-col justify-center items-center relative z-10"
        >
          <div className="w-full max-w-[400px] bg-white/80 backdrop-blur-lg px-6 sm:px-10 pt-10 sm:pt-14 pb-10 sm:pb-14 rounded-xl shadow-lg border border-white/20">
            {/* Tabs */}
            <div className="flex mb-6 sm:mb-8 border-b">
              <button
                className="flex-1 py-2 text-center font-medium text-blue-600 border-b-2 border-blue-600 text-sm sm:text-base"
              >
                Sign In
              </button>
              <button
                className="flex-1 py-2 text-center font-medium text-gray-500 text-sm sm:text-base"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-y-6 sm:gap-y-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUserCircle className="text-blue-600 text-3xl sm:text-4xl" />
                  </div>
                </div>
                <p className="text-blue-600 text-2xl sm:text-3xl font-bold mb-2">
                  Welcome back!
                </p>
                <p className="text-center text-sm sm:text-base text-gray-600">
                  We're glad to see you again. Please login to your account.
                </p>
              </div>

              {/* Error Message */}
              {(error || authError) && (
                <div className="text-red-500 text-xs sm:text-sm text-center bg-red-50 p-2 rounded">
                  {error || authError}
                </div>
              )}

              <div className="flex flex-col gap-y-4 sm:gap-y-5">
                <Textbox
                  placeholder="email@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  className="w-full rounded-lg text-sm sm:text-base"
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
                  className="w-full rounded-lg text-sm sm:text-base"
                  register={register("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  error={errors.password?.message}
                />
              </div>

              <Button
                type="submit"
                label={isLoading || status === 'loading' ? 'Signing in...' : 'Sign In'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
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