"use client";

import { useSignIn } from "@farcaster/auth-kit";
import { useState } from "react";

const LoginButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { url, signIn } = useSignIn();

  const handleLogin = async () => {
    try {
      setIsModalOpen(true); // Open the modal
      await signIn(); // Trigger the sign-in process and QR code generation
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Login with Farcaster
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg relative">
            <h2 className="text-xl mb-4">Scan QR Code to Login</h2>

            {url ? (
              <img src={url} alt="QR Code" className="mx-auto mb-4" />
            ) : (
              <p>Loading QR code...</p>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;
