// app/components/authentication/LoginModal.tsx
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Store, useStore } from '../../store';
import { Configuration } from '@/app/services/api'
import { AuthenticationApi } from '@/app/services/api';

// Basic form component (can be reused)
const InputField = ({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="mb-4">
    <label className="block text-pink-300 text-sm font-bold mb-2" htmlFor={label}>
      {label}
    </label>
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-purple-100"
      id={label}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

const LoginModal: React.FC = () => {
    const apiConfig = new Configuration({
    basePath: 'http://localhost:8000/api/v1', // Update with correct backend URL
    });
    const authApi = new AuthenticationApi(apiConfig);
    const { isLoginModalOpen, closeLoginModal, login } = useStore();
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.authLoginCreate({ username_or_email: usernameOrEmail, password });
        if (login) {
            await login(response.data); // Pass the response data from login API to your login function
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'string'){
          setError(err)
      }
          else if (typeof err === 'object' && err !== null && 'error' in err){
              setError((err as {error: string}).error)
          } else {
          setError('An unknown error occurred.');
        }
      }
    };

  return (
    isLoginModalOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-sm mx-auto my-6">
          {/*content*/}
          <div className="relative flex flex-col w-full bg-clip-padding rounded-md bg-purple-700 text-white px-6 py-4 shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-pink-500">
              <h3 className="text-3xl font-semibold">Login</h3>
              <button
                className="float-right text-pink-500 bg-transparent border-0 text-sm leading-none outline-none focus:outline-none"
                onClick={closeLoginModal}
              >
                <span className="text-xl inline-block h-6 w-6 text-2xl align-middle">×</span>
              </button>
            </div>
            {/*body*/}
                <div className="relative p-6 flex-auto">
                    <form onSubmit={handleSubmit}>
                    <InputField label="Username or Email" type="text" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
                    <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/* Error message */}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-pink-500">
                        <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={closeLoginModal}
                        >
                        Close
                        </button>
                        <button
                        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        type="submit"
                        >
                        Sign In
                        </button>
                    </div>

                    </form>
                </div>

            </div>
            </div>
            </div>
    ): null
  );
};

export default LoginModal;