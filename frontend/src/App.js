import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import './App.css';  // Importing the CSS file

const App = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const apiUrl = "http://localhost:5000/bfhl"; // Correct API URL

  const handleSubmit = async () => {
    try {
      // Validate JSON
      const jsonInput = JSON.parse(input);
      if (!jsonInput.data || !Array.isArray(jsonInput.data)) {
        setError("Invalid JSON: 'data' must be an array");
        return;
      }
      setError("");

      // Call the API
      const res = await axios.post(apiUrl, jsonInput);
      setResponse(res.data);
      setFilteredResponse(null); // Clear filtered response for new input
    } catch (err) {
      setError("Invalid JSON or API Error");
    }
  };

  const handleFilterChange = (selectedOptions) => {
    if (response) {
      const filtered = {};
      selectedOptions.forEach((option) => {
        filtered[option.value] = response[option.value];
      });
      setFilteredResponse(filtered);
    }
  };

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  return (
    <div className="container">
      <h1>Enter Detail...</h1>

      <textarea
        rows="5"
        placeholder='Enter JSON input (e.g., { "data": ["A", "1", "z"] })'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p className="error">{error}</p>}

      {response && (
        <>
          <Select
            options={options}
            isMulti
            onChange={handleFilterChange}
            placeholder="Select filters"
          />

          <div className="filtered-response">
            <h3>Filtered Response</h3>
            {filteredResponse ? (
              <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
            ) : (
              <pre>{JSON.stringify(response, null, 2)}</pre>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
