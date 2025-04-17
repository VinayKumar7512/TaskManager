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

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      setIsLoading(true);
      
      const result = await dispatch(registerUser(data)).unwrap();
      
      if (result) {
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
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
              Join Task Manager
            </h1>
            <p className="text-gray-600 text-lg">
              Create an account to start managing your tasks efficiently.
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
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14 rounded-xl shadow-lg"
          >
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
                error={errors.name ? errors.name.message : ""}
              />
              
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-lg"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
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
                error={errors.password ? errors.password.message : ""}
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
                error={errors.role ? errors.role.message : ""}
              />
              
              <Textbox
                placeholder="Job Title"
                type="text"
                name="title"
                label="Job Title"
                className="w-full rounded-lg"
                register={register("title", {
                  required: "Job title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />
            </div>

            <Button
              type="submit"
              label={isLoading ? "Creating Account..." : "Create Account"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
              disabled={isLoading}
            />
            
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 