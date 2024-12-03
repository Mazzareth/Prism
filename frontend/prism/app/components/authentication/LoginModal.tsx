"use client";
import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { useStore } from "../../store";
import { Configuration, AuthenticationApi, AuthLoginCreateRequest } from "@/app/services/api";
import "../../globals.css";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: FC<InputFieldProps> = ({ label, type, value, onChange }) => (
  <div className="form-group">
    <label className="form-label" htmlFor={label}>
      {label}
    </label>
    <input
      className="form-input"
      id={label}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

interface ErrorResponse {
  error?: string;
}

const LoginModal: FC = () => {
  const apiConfig = new Configuration({
    basePath: "http://localhost:8000/api/v1",
  });
  const authApi = new AuthenticationApi(apiConfig);
  const { isLoginModalOpen, closeLoginModal, login } = useStore();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors on submit
    try {
      const loginRequest: AuthLoginCreateRequest = {
        username_or_email: usernameOrEmail,
        password,
      };
      const response = await authApi.authLoginCreate(loginRequest);
      if (login) {
        await login(response.data);
        closeLoginModal();
      }
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (typeof err === "object" && err !== null && "error" in err) {
          const errorResponse = err as ErrorResponse;
          errorMessage = errorResponse.error || errorMessage;
      }
      setError(errorMessage);
    }
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Login</h3>
          <button className="modal-close-button" onClick={closeLoginModal}>
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <InputField
            label="Username or Email"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="modal-footer">
            <button
              className="modal-close-button-alt"
              type="button"
              onClick={closeLoginModal}
            >
              Close
            </button>
            <button className="modal-close-button-alt" type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;