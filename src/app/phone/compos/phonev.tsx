"use client";

import React, { useState } from 'react';

// Define a type for the API response to ensure type safety
interface PhoneValidationResponse {
  phone: string;
  country: {
    code: string;
    name: string;
  };
  location: string;
  carrier: string;
  type: string;
  is_valid: {
    value: boolean;
    text: string;
  };
}

const PhoneValidator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [validationResult, setValidationResult] = useState<PhoneValidationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setValidationResult(null);
    setError(null);

    if (!phoneNumber) {
      setError("Please enter a phone number.");
      setLoading(false);
      return;
    }

    // Modern fetch API for async requests
    const apiKey = "dcdc2f834bb246908b3a78495d174c51";
    const url = `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${encodeURIComponent(phoneNumber)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: PhoneValidationResponse = await response.json();
      setValidationResult(result);
    } catch (err) {
      console.error("Failed to fetch phone validation:", err);
      setError(`Failed to validate phone number: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Phone Number Validator</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              placeholder="e.g., +14152007986"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Validating...' : 'Validate Phone Number'}
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
            <p><strong>Phone:</strong> {validationResult.phone}</p>
            {validationResult.country && <p><strong>Country:</strong> {validationResult.country.name} ({validationResult.country.code})</p>}
            {validationResult.location && <p><strong>Location:</strong> {validationResult.location}</p>}
            {validationResult.carrier && <p><strong>Carrier:</strong> {validationResult.carrier}</p>}
            {validationResult.type && <p><strong>Type:</strong> {validationResult.type}</p>}
            {validationResult.is_valid && <p><strong>Is Valid:</strong> {validationResult.is_valid.text}</p>}
        </div>
    </div>
)}
      </div>
    </div>
  );
};

export default PhoneValidator;