"use client";
import React, { useState } from "react";
import { useStore } from "../../store";
import { Configuration, AuthenticationApi } from "@/app/services/api";
import "../../globals.css";


const InputField = ({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
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

const LoginModal: React.FC = () => {
  const apiConfig = new Configuration({
    basePath: "http://localhost:8000/api/v1",
  });
  const authApi = new AuthenticationApi(apiConfig);
  const { isLoginModalOpen, closeLoginModal, login } = useStore();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.authLoginCreate({
        username_or_email: usernameOrEmail,
        password,
      });
      if (login) {
        await login(response.data);
        closeLoginModal();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else if (typeof err === "object" && err !== null && "error" in err) {
        setError((err as { error: string }).error);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    isLoginModalOpen && (
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
    )
  );
};

export default LoginModal;
