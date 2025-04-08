// src/App.js
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

import packageJson from '@google/generative-ai/package.json';
const version = packageJson.version;
console.log("Using @google/generative-ai version:", version);

// Replace with your actual Gemini API key
const API_KEY = 'AIzaSyBtQzkfMXF0pMl4lEOU8slgXjs5UVAXkpE'; // Ensure this is correct

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError('Please enter your query.');
      return;
    }
    setError('');
    setLoading(true);
    setResponse('');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' }); // Or another model

    try {
      const result = await model.generateContent(query); // Simple text prompt
      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setResponse(text);
      } else {
        setResponse('No response received.');
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError(`Failed to get response from Gemini API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function logVersion() {
      console.log("Using @google/generative-ai version:", version);
    }
    logVersion();
    // async function listAvailableModels() {
    //   const genAI = new GoogleGenerativeAI(API_KEY);
    //   try {
    //     const models = await genAI.listModels();
    //     console.log("Available Models:", models.models);
    //     // setAvailableModels(models.models); // You might not need this with the direct call
    //   } catch (error) {
    //     console.error("Error listing models:", error);
    //     setError("Failed to fetch available models.");
    //   }
    // }
    // listAvailableModels(); // Commenting out for now due to version incompatibility
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Gemini AI Chat</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="input-container">
        <textarea
          rows="5"
          placeholder="Enter your query here..."
          value={query}
          onChange={handleInputChange}
          className="text-area"
        />
        <button onClick={handleSubmit} disabled={loading} className="submit-button">
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>

      {response && (
        <div className="response-container">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;