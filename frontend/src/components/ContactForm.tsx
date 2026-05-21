import type { FormEventHandler } from "react";
import { useContactForm } from "../hooks/useContactForm";

const fields: Array<{
  name: "name" | "phone" | "email";
  label: string;
  type: "text" | "tel" | "email";
  placeholder: string;
}> = [
  {
    name: "name",
    label: "Имя",
    type: "text",
    placeholder: "Как к вам обращаться",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    placeholder: "+7 (999) 123-45-67",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
];

export const ContactForm = () => {
  const { state, setFieldValue, submit } = useContactForm();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit();
  };

  return (
    <form className="contact-form card" onSubmit={handleSubmit} noValidate>
      {fields.map((field) => (
        <div className="form-control" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type}
            value={state.values[field.name]}
            onChange={(event) => setFieldValue(field.name, event.target.value)}
            placeholder={field.placeholder}
            autoComplete={field.name}
          />
          {state.errors[field.name] ? <p className="form-error">{state.errors[field.name]}</p> : null}
        </div>
      ))}

      <div className="form-control">
        <label htmlFor="comment">Комментарий</label>
        <textarea
          id="comment"
          value={state.values.comment}
          onChange={(event) => setFieldValue("comment", event.target.value)}
          placeholder="Опишите задачу, сроки и ожидаемый результат"
          rows={5}
        />
        {state.errors.comment ? <p className="form-error">{state.errors.comment}</p> : null}
      </div>

      <button type="submit" className="btn btn--primary" disabled={state.isSubmitting}>
        {state.isSubmitting ? "Отправляем..." : "Отправить сообщение"}
      </button>

      {state.submitSuccessMessage ? (
        <p className="form-message form-message--success">{state.submitSuccessMessage}</p>
      ) : null}
      {state.submitErrorMessage ? (
        <p className="form-message form-message--error">{state.submitErrorMessage}</p>
      ) : null}
    </form>
  );
};
