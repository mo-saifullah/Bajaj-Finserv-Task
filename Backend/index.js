const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line

const app = express();

// Enable CORS for all routes and all origins
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Utility Functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const decodeBase64 = (base64) => {
    try {
        const buffer = Buffer.from(base64, 'base64');
        return {
            valid: true,
            mimeType: buffer.toString('ascii', 0, 4) === '%PDF' ? 'application/pdf' : 'unknown',
            sizeKB: (buffer.length / 1024).toFixed(2),
        };
    } catch {
        return { valid: false };
    }
};

// Replace with your details
const fullName = "MO_SAIFULLAH";
const dob = "03012004";
const userId = `${fullName}_${dob}`;
const email = "saifullah210058@acropolis.in";
const rollNumber = "0827CI211112";

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;
    if (!data) {
        return res.status(400).json({ is_success: false, message: "Missing data in request." });
    }

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(Number(item))).map(Number);
    const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
    const lowercaseAlphabets = alphabets.filter((char) => char >= 'a' && char <= 'z');

    // Find highest lowercase alphabet
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
        ? [lowercaseAlphabets.sort().reverse()[0]]
        : [];

    // Check for prime numbers
    const isPrimeFound = numbers.some(isPrime);

    // Decode file if provided
    const fileDetails = file_b64 ? decodeBase64(file_b64) : { valid: false };

    res.json({
        is_success: true,
        user_id: userId,
        email,
        roll_number: rollNumber,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        is_prime_found: isPrimeFound,
        file_valid: fileDetails.valid,
        file_mime_type: fileDetails.mimeType || null,
        file_size_kb: fileDetails.valid ? fileDetails.sizeKB : null,
    });
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start Server
const PORT = 5000; // Changed port to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
