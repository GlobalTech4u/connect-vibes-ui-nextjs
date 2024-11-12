"use client";

import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { TextField, Alert, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import LABELS from "@/constants/label.constant";
import initializeAxios from "@/services/axios.service";
import initializeSocket from "@/utils/socket";
import { loginUser } from "@/reduxStore/slices/authSlice";
import { AuthContext } from "@/components/authContext/AuthContext";
import { validateLogin } from "@/helpers/validate.helper";
import { REDUX_ACTION } from "@/constants/common.constant";
import { MESSAGES } from "@/constants/message.constant";

import "./Login.css";

const Login = () => {
  const { loading, isLoggedIn, setToken } = useContext(AuthContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAutofilled, setIsAutofilled] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/");
    }
  }, [loading, isLoggedIn]);

  /**
   * Workaround to handle browser autofill behaviour
   * This is avoid on reload, the floating label overlaps the auto-filled text
   * Remove this code once material ui text field can handle auto-fill text
   */
  // useEffect(() => {
  //   const input = document.getElementById("email");
  //   if (input) {
  //     const handleAnimationStart = (event) => {
  //       if (event.animationName === "mui-auto-fill") {
  //         setIsAutofilled(true);
  //       } else if (event?.animationName === "mui-auto-fill-cancel") {
  //         setIsAutofilled(false);
  //       }
  //     };

  //     input.addEventListener("animationstart", handleAnimationStart);

  //     return () => {
  //       input.removeEventListener("animationstart", handleAnimationStart);
  //     };
  //   }
  // }, [document.getElementById("email")]);

  const submitSignInForm = async (values) => {
    const payload = {
      email: values?.email,
      password: values?.password,
    };

    dispatch(loginUser(payload))
      .then((res) => {
        if (res?.meta?.requestStatus === REDUX_ACTION.FULFILLED) {
          const user = res?.payload?.user;
          const token = user?.token;
          const refreshToken = user?.refreshToken;
          localStorage.setItem("user", JSON.stringify(user));
          initializeSocket(user?._id);
          initializeAxios(token, refreshToken);
          router.push("/");
          const event = new Event("localStorageUpdate");
          window.dispatchEvent(event);
        } else {
          toast.error(res?.payload?.message);
        }
      })
      .catch((err) => {
        toast.error(MESSAGES.LOGIN_ERROR);
        setToken("");
        localStorage.removeItem("user");
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit: submitSignInForm,
    validateOnChange: false,
  });

  const redirectToSignUp = () => router.push("/sign-up");

  const { values, handleChange, handleSubmit } = formik;

  return (
    <div className="login-container">
      <div className="left-container">
        <img
          src={"/images/app-logo.png"}
          className="img-fluid"
          alt="App logo"
        />
      </div>
      <div className="right-container">
        <div>
          <span className="title">{LABELS.LOGIN_TITLE}</span>
        </div>
        <form className="form">
          <TextField
            id="email"
            label="Email"
            required={true}
            autoComplete="email"
            defaultValue={values?.email}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {formik.errors.email ? (
            <Alert severity="error">{formik.errors.email}</Alert>
          ) : null}
          <TextField
            id="password"
            label="Password"
            type="password"
            required={true}
            autoComplete="password"
            defaultValue={values?.password}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {formik.errors.password ? (
            <Alert severity="error">{formik.errors.password}</Alert>
          ) : null}

          <Button
            className="primary-button"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Login
          </Button>
        </form>
        <p className="footer-text">
          {LABELS.LOGIN_FOOTER}&nbsp;
          <span
            onClick={redirectToSignUp}
            className="footer-link cursor-pointer"
          >
            {LABELS.LOGIN_FOOTER_LINK}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
