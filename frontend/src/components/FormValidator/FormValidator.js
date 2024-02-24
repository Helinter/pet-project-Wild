import React from "react";

export function useFormWithValidation() {
  const [values, setValues] = React.useState({ searchForm: '' });
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);

  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(target.closest("form").checkValidity());
  };

  const resetForm = React.useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid]
  );

  const validateEmail = (email) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Введите корректный адрес электронной почты";
    }
    return "";
  };

  const validateName = (name) => {
    if (!name) {
      return "Введите ваше имя";
    }
  
    if (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(name)) {
      return "Имя может содержать только латиницу, кириллицу, пробел или дефис";
    }
  
    return "";
  };

  const validatePassword = (password) => {
    if (!password || password.length < 4) {
      return "Пароль должен содержать не менее 4 символов";
    }
    return "";
  };

  return {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    validateEmail,
    validateName,
    validatePassword,
    setValues,
  };
}
