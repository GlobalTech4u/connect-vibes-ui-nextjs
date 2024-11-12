"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { FileUploader } from "react-drag-drop-files";
import { useDispatch } from "react-redux";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

import { TextField, Select, MenuItem, Alert, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";

import LABELS from "@/constants/label.constant";
import { createUser } from "@/reduxStore/slices/usersSlice";
import { validateRegister } from "@/helpers/validate.helper";
import { FILE_TYPES, REDUX_ACTION } from "@/constants/common.constant";
import { AuthContext } from "@/components/authContext/AuthContext";

import "./SignUp.css";

const SignUp = () => {
  const { loading, isLoggedIn } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const submitSignUpForm = async (values) => {
    const payload = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      gender: values?.gender === "select" ? null : values?.gender,
      password: values?.password,
      profilePicture: values?.profilePicture,
    };

    dispatch(createUser(payload)).then((res) => {
      if (res?.meta?.requestStatus === REDUX_ACTION.FULFILLED) {
        router.push("/login");
      }
    });
  };

  const handleProfilePictureUpload = (file) => {
    formik.setFieldValue("profilePicture", file);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "select",
      profilePicture: "",
    },
    validate: validateRegister,
    onSubmit: submitSignUpForm,
    validateOnChange: false,
  });

  const redirectToLogin = () => router.push("/login");

  const { values, handleChange, handleSubmit } = formik;

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  return (
    <div className="sign-up-container">
      <div className="left-container">
        <img
          src={"/images/app-logo.png"}
          className="signup-app-logo"
          alt="App logo"
        />
      </div>
      <div className="right-container">
        <div>
          <span className="title">{LABELS.SIGNUP_TITLE}</span>
        </div>
        <form className="form">
          <TextField
            id="firstName"
            label="First name"
            required={true}
            autoComplete="first-name"
            defaultValue={values?.firstName}
            onChange={handleChange}
          />
          {formik.errors.firstName && (
            <Alert className="error" severity="error">
              {formik.errors.firstName}
            </Alert>
          )}
          <TextField
            id="lastName"
            label="Last name"
            autoComplete="last-name"
            defaultValue={values?.lastName}
            onChange={handleChange}
          />
          {formik.errors.lastName && (
            <Alert className="error" severity="error">
              {formik.errors.lastName}
            </Alert>
          )}
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
          {formik.errors.email && (
            <Alert className="error" severity="error">
              {formik.errors.email}
            </Alert>
          )}
          <FormControl className="password-field" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password" shrink>
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              defaultValue={values?.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              notched
            />
          </FormControl>
          {formik.errors.password && (
            <Alert className="error" severity="error">
              {formik.errors.password}
            </Alert>
          )}
          <FormControl className="password-field" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              defaultValue={values?.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
          {formik.errors.confirmPassword && (
            <Alert className="error" severity="error">
              {formik.errors.confirmPassword}
            </Alert>
          )}
          <Select
            id="gender"
            label="Gender"
            defaultValue={values?.gender}
            onChange={(event) =>
              formik.setFieldValue("gender", event?.target?.value)
            }
          >
            <MenuItem className="options" value={"select"} disabled={true}>
              Select Gender
            </MenuItem>
            <MenuItem className="options" value={"male"}>
              Male
            </MenuItem>
            <MenuItem className="options" value={"female"}>
              Female
            </MenuItem>
            <MenuItem className="options" value={"other"}>
              Other
            </MenuItem>
          </Select>
          {formik.errors.gender && (
            <Alert className="error" severity="error">
              {formik.errors.gender}
            </Alert>
          )}
          <StyleSheetManager shouldForwardProp={isPropValid}>
            <FileUploader
              classes="profile-picture-upload"
              multiple={false}
              handleChange={handleProfilePictureUpload}
              name="profilePicture"
              types={FILE_TYPES}
              maxSize={12}
            />
          </StyleSheetManager>
          <Button
            className="primary-button"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Sign up
          </Button>
        </form>
        <p className="footer-text terms-services">
          {LABELS.SIGNUP_TERMS}&nbsp;
          <a href="#" className="footer-link">
            {LABELS.SIGNUP_TERMS_LINK}
          </a>
        </p>
        <p className="footer-text login-link">
          {LABELS.SIGNUP_FOOTER}&nbsp;
          <span
            onClick={redirectToLogin}
            className="footer-link cursor-pointer"
          >
            {LABELS.SIGNUP_FOOTER_LINK}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
