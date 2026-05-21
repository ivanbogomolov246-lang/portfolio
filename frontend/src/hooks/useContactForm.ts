import { useMemo, useState } from "react";
import { ApiError, sendContactRequest } from "../services/api";
import type { ContactFormState, ContactFormValues } from "../types";

const initialValues: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  comment: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateValues = (values: ContactFormValues) => {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};

  if (!values.name.trim()) {
    errors.name = "Введите имя.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Имя должно содержать минимум 2 символа.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Введите телефон.";
  }

  if (!values.email.trim()) {
    errors.email = "Введите email.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Введите корректный email.";
  }

  if (!values.comment.trim()) {
    errors.comment = "Добавьте комментарий.";
  } else if (values.comment.trim().length < 10) {
    errors.comment = "Комментарий должен содержать минимум 10 символов.";
  }

  return errors;
};

export const useContactForm = () => {
  const [state, setState] = useState<ContactFormState>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
    submitSuccessMessage: null,
    submitErrorMessage: null,
  });

  const isFormValid = useMemo(() => {
    return Object.keys(validateValues(state.values)).length === 0;
  }, [state.values]);

  const setFieldValue = (field: keyof ContactFormValues, value: string) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
      submitSuccessMessage: null,
      submitErrorMessage: null,
    }));
  };

  const submit = async () => {
    const errors = validateValues(state.values);

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({
        ...prev,
        errors,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitSuccessMessage: null,
      submitErrorMessage: null,
    }));

    try {
      const response = await sendContactRequest(state.values);
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        values: initialValues,
        errors: {},
        submitSuccessMessage: response.message,
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: {
            ...prev.errors,
            ...(error.fieldErrors || {}),
          },
          submitErrorMessage: error.message,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitErrorMessage: "Произошла непредвиденная ошибка.",
      }));
    }
  };

  return {
    state,
    setFieldValue,
    submit,
    isFormValid,
  };
};
