import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookie from "js-cookie";

import "../style.scss";

import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const toastOptions = {
    duration: 1000,
  };

  const handleValidation = () => {
    const { password, confirmPassword, name, email } = userData;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (name.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 4) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name } = userData;
    try {
      if (handleValidation()) {
        const host = `${import.meta.env.VITE_SERVER}/api/auth/register`;
        const response = await axios.post(host, {
          name,
          password,
          email,
        });
        const { data } = response;

        if (data.status) {
          Cookie.set("jwtToken", data.jwtToken);
          setUserData({
            name: "",
            password: "",
            email: "",
            confirmPassword: "",
          });
          toast.success("Registered Successfully", {
            duration: 1000,
            icon: "🔥",
          });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          toast.error(data.msg, toastOptions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onShowPass = () => {
    setShowPass((prev) => !prev);
  };
  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit} className="formContainer">
        <h1>
          <span>Explode💣</span>Kitten
        </h1>

        <p className="loginTitle">Register</p>

        <div className="inputContainer">
          <label htmlFor="name">Username</label>
          <input
            name="name"
            id="name"
            type="text"
            placeholder="Enter Username"
            className="input"
            onChange={(e) => onChange(e)}
            value={userData.name}
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            className="input"
            onChange={(e) => onChange(e)}
            value={userData.email}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="pass">Password</label>
          <input
            name="password"
            id="pass"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            className="input"
            onChange={(e) => onChange(e)}
            value={userData.password}
          />
        </div>
        <div className="inputContainer">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            name="confirmPassword"
            id="confirm"
            type={showPass ? "text" : "password"}
            placeholder="Confirm your password"
            className="input"
            onChange={(e) => onChange(e)}
            value={userData.confirmPassword}
          />
        </div>
        <div className="checkbox">
          <input onChange={onShowPass} id="check" type="checkbox" />
          <label htmlFor="check">Show Password</label>
        </div>

        <button type="submit">Submit</button>
        <p>
          Already have an account?
          <Link style={{ textDecoration: "none" }} to={"/login"}>
            <span>Login</span>
          </Link>
        </p>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Register;
