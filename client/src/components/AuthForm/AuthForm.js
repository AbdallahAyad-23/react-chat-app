import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import socket from "../../utils/socket";
import Input from "../Input/Input";
import validateForm from "../../utils/validateForm";
import chatApi from "../../api/chat";
import styles from "./AuthForm.module.css";
const AuthForm = ({ setToken }) => {
  const [signup, setSignup] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const clearState = () => {
    setForm({ username: "", password: "" });
    setErrors({});
  };

  const url = signup ? "/signup" : "/login";
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const name = e.target.name;
    setForm((prevForm) => ({ ...prevForm, [name]: e.target.value }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const errors = validateForm(form);
    if (Object.keys(errors).length !== 0) return setErrors(errors);
    chatApi
      .post(url, form)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("username", form.username);
        localStorage.setItem("token", token);
        setToken(token);
        chatApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        socket.auth = {
          username: form.username,
          userId: jwt_decode(token).userId,
        };
        socket.connect();
      })
      .catch((err) => {
        console.log(err);
        const error = err.response.data.data;
        setErrors((prevErrors) => ({ ...prevErrors, ...error }));
      });
  };
  return (
    <div className={styles.container}>
      <form className={styles.auth_form} onSubmit={handleFormSubmit}>
        <h1>{signup ? "Sign Up" : "Login"}</h1>
        <hr className={styles.break} />
        <Input
          placeholder="Username"
          type="text"
          name="username"
          value={form.username}
          handleInputChange={handleInputChange}
          error={errors["username"]}
        />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          handleInputChange={handleInputChange}
          error={errors["password"]}
        />
        <button className={styles.submit_button}>
          {signup ? "Sign Up" : "Login"}
        </button>
        {signup ? (
          <p>
            Already a user{" "}
            <span
              onClick={() => {
                clearState();
                setSignup(false);
              }}
              className={styles.link}
            >
              Log in
            </span>
          </p>
        ) : (
          <p>
            Don't have an account{" "}
            <span
              onClick={() => {
                clearState();
                setSignup(true);
              }}
              className={styles.link}
            >
              Sign up
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
