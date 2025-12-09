export interface UserValues {
  username?: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface UserErrors {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const validateUser = (values: UserValues): UserErrors => {
  const errors: UserErrors = {};

  if ("username" in values) {
    if (!values.username || values.username.trim() === "") {
      errors.username = "Username is required";
    }
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if ("role" in values) {
    if (values.role && !["user", "admin"].includes(values.role)) {
      errors.role = "Role must be either user or admin";
    }
  }

  return errors;
};
