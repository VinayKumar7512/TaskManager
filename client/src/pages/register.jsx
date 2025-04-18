import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/textbox";
import Button from "../components/button";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { registerUser } from "../redux/slices/authSlice";
import "../styles/animations.css";

const Register = () => {
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

  const password = watch("password");

  const submitHandler = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dispatch(registerUser(data)).unwrap();
      
      if (result) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      setError(error?.message || "Registration failed");
      toast.error(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-4 md:p-8 gap-8 relative z-10">
        {/* Left side - Task Manager Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 flex flex-col gap-y-8"
        >
          <div className="flex flex-col gap-y-4 backdrop-blur-sm bg-white/30 p-8 rounded-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
              Welcome to Task Manager
            </h1>
            <p className="text-gray-600 text-lg">
              A simple and efficient way to manage your tasks and stay organized.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Task Organization</h3>
                <p className="text-gray-600">Create, organize, and track tasks with ease</p>
              </div>
            </div>

            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Task Analytics</h3>
                <p className="text-gray-600">Get insights and track your productivity</p>
              </div>
            </div>

            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
                <p className="text-gray-600">Monitor task progress and deadlines</p>
              </div>
            </div>

            <div className="flex items-start gap-4 backdrop-blur-sm bg-white/40 p-6 rounded-xl transition-all duration-300 hover:bg-white/60">
              <div className="text-blue-600 bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Priority Management</h3>
                <p className="text-gray-600">Set and manage task priorities effectively</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Register Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center relative z-10"
        >
          <div className="w-full md:w-[400px] bg-white/80 backdrop-blur-lg px-10 pt-14 pb-14 rounded-xl shadow-lg border border-white/20">
            {/* Tabs */}
            <div className="flex mb-8 border-b">
              <button
                className="flex-1 py-2 text-center font-medium text-gray-500"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="flex-1 py-2 text-center font-medium text-blue-600 border-b-2 border-blue-600"
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-y-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUserPlus className="text-blue-600 text-4xl" />
                  </div>
                </div>
                <p className="text-blue-600 text-3xl font-bold mb-2">
                  Create Account
                </p>
                <p className="text-center text-base text-gray-600">
                  Fill in the details to create your account.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-y-5">
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

                <Textbox
                  placeholder="confirm password"
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  className="w-full rounded-lg"
                  register={register("confirmPassword", {
                    required: "Please confirm your password!",
                    validate: value =>
                      value === password || "The passwords do not match"
                  })}
                  error={errors.confirmPassword?.message}
                />

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
              </div>

              <Button
                type="submit"
                label={isLoading ? "Creating Account..." : "Create Account"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
                disabled={isLoading}
              />
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 