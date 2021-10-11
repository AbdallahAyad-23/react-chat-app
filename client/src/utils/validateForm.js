const validateForm = (form) => {
  const errors = {};
  for (const key in form) {
    if (key === "password") {
      if (form[key].length < 6) {
        errors[key] = "Password must be at least 6 characters long.";
      }
    } else {
      if (form[key].length === 0) {
        errors[key] = "Must not be empty!";
      }
    }
  }
  return errors;
};

export default validateForm;
