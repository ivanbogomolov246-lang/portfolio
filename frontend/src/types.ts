export type ApiErrorPayload = {
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ContactFormValues = {
  name: string;
  phone: string;
  email: string;
  comment: string;
};

export type ContactFormState = {
  values: ContactFormValues;
  errors: Partial<Record<keyof ContactFormValues, string>>;
  isSubmitting: boolean;
  submitSuccessMessage: string | null;
  submitErrorMessage: string | null;
};

export type AiSummaryState = {
  input: string;
  output: string;
  isLoading: boolean;
  error: string | null;
};
