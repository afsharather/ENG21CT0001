const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500; // 500 milliseconds
const MAX_RETRIES = 3; // Maximum number of retries
let numbersWindow = [];

const endpoints = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
};

async function fetchNumbersWithRetry(endpoint, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(endpoint, { timeout: TIMEOUT });
            console.log(`Fetched numbers from ${endpoint}:`, response.data.numbers);
            return response.data.numbers;
        } catch (error) {
            if (i < retries - 1 && error.response && error.response.status === 409) {
                console.log(`Retry ${i + 1} for ${endpoint} due to 409 error`);
                await new Promise(res => setTimeout(res, 500)); // Wait before retrying
            } else {
                console.error(`Error fetching numbers from ${endpoint}:`, error.message);
                return [];
            }
        }
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

function updateWindow(newNumbers) {
    // Ensure the numbers in the window are unique
    const previousState = [...numbersWindow];
    const uniqueNewNumbers = [...new Set(newNumbers)];
    numbersWindow = [...new Set([...numbersWindow, ...uniqueNewNumbers])];

    // Ensure the window size does not exceed WINDOW_SIZE
    if (numbersWindow.length > WINDOW_SIZE) {
        numbersWindow = numbersWindow.slice(-WINDOW_SIZE);
    }

    return previousState;
}

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: "Invalid number ID" });
    }

    const endpoint = endpoints[numberid];
    const newNumbers = await fetchNumbersWithRetry(endpoint);

    const previousState = updateWindow(newNumbers);
    const avg = calculateAverage(numbersWindow);

    const response = {
        "windowPrevState": previousState,
        "windowCurrState": numbersWindow,
        "numbers": newNumbers,
        "avg": parseFloat(avg.toFixed(2))
    };

    console.log('Response:', response);

    return res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
