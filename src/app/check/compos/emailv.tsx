"use client";
import React, { useState } from 'react';

// Define a type for the API response to ensure type safety
interface EmailValidationResponse {
  email: string;
  is_valid_format: {
    value: boolean;
    text: string;
  };
  is_free_email: {
    value: boolean;
    text: string;
  };
  is_disposable_email: {
    value: boolean;
    text: string;
  };
  is_mx_found: {
    value: boolean;
    text: string;
  };
  is_smtp_valid: {
    value: boolean;
    text: string;
  };
  quality_score: string;
  // Add other fields from the API response if needed
}

const EmailValidator: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [validationResult, setValidationResult] = useState<EmailValidationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setLoading(true);
    setValidationResult(null);
    setError(null);

    if (!email) {
      setError("Please enter an email address.");
      setLoading(false);
      return;
    }

    const apiKey = "9566cc0a7f2d4f3a935c0fa768819bf4"; // Your API key
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: EmailValidationResponse = await response.json();
      setValidationResult(result);
    } catch (err) {
      console.error("Failed to fetch email validation:", err);
      setError(`Failed to validate email: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Email Validator</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Validating...' : 'Validate Email'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {validationResult && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 text-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-700">Validation Result:</h3>
            <div className="space-y-2">
              <p><strong>Email:</strong> {validationResult.email}</p>
              <p><strong>Valid Format:</strong> {validationResult.is_valid_format.text}</p>
              <p><strong>Free Email:</strong> {validationResult.is_free_email.text}</p>
              <p><strong>Disposable Email:</strong> {validationResult.is_disposable_email.text}</p>
              <p><strong>MX Records Found:</strong> {validationResult.is_mx_found.text}</p>
              <p><strong>SMTP Valid:</strong> {validationResult.is_smtp_valid.text}</p>
              <p><strong>Quality Score:</strong> {validationResult.quality_score}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailValidator;