import React from "react";
import clsx from "clsx";

const Button = ({
  icon,
  className,
  label,
  type,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  onClick = () => {}
}) => {
  // Define variant styles
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800"
  };

  // Define size styles
  const sizeStyles = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg"
  };

  return (
    <button 
      type={type || "button"}
      disabled={disabled}
      className={clsx(
        "outline-none rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;