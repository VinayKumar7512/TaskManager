import React, { useState } from "react";
import Button from "./button";
import config from "../config"; // Import the configuration file

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const response = await fetch(`${config.apiBaseUrl}/api/user/login`, { // Use the base URL from config
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            // Handle successful login
        } else {
            // Handle login error
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
            />
            <Button 
                label="Login" 
                onClick={handleLogin} 
            />
        </div>
    );
};

export default Login;
