import * as Yup from "yup";

export const INITIAL_VALUES_LOGIN = { email: "", password: "" };
export const VALIDATION_SCHEMA_LOGIN = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const INITIAL_VALUES_SIGNUP = {
  email: "",
  password: "",
  name: "",
  reachable: true,
};
export const VALIDATION_SCHEMA_SIGNUP = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  name: Yup.string().required("Name is required"),
  reachable: Yup.boolean(),
});

export const INITIAL_VALUES_FORGOT = {
  email: "",
};
export const VALIDATION_SCHEMA_FORGOT = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
