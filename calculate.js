const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

app.use(express.json());

let prevState = {
    numbers: [],
    WindowsPrevState: [],
    WindowsCurrState: [],
    avg: 0
};

const authApiUrl = 'http://20.244.56.144/test/auth';
const authPayload = {
    companyName: "calculate",
    clientID: "bb1e50d5-4eb9-4d9a-814a-9ebd665f8e4a",
    clientSecret: "bHqPeOeWsfopTQwA",
    ownerName: "afsharather",
    ownerEmail: "eng21ct0001@dsu.edu.in",
    rollNo: "ENG21CT0001"
};
// should not paste here, instead use /testserver/test/auth to get auth token every time using authpayload but currently its not working as pointed out in readme.
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjIxNTcxLCJpYXQiOjE3MTcyMjEyNzEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJiMWU1MGQ1LTRlYjktNGQ5YS04MTRhLTllYmQ2NjVmOGU0YSIsInN1YiI6ImVuZzIxY3QwMDAxQGRzdS5lZHUuaW4ifSwiY29tcGFueU5hbWUiOiJjYWxjdWxhdG9yIiwiY2xpZW50SUQiOiJiYjFlNTBkNS00ZWI5LTRkOWEtODE0YS05ZWJkNjY1ZjhlNGEiLCJjbGllbnRTZWNyZXQiOiJiSHFQZU9lV3Nmb3BUUXdBIiwib3duZXJOYW1lIjoiYWZzaGFyYXRoZXIiLCJvd25lckVtYWlsIjoiZW5nMjFjdDAwMDFAZHN1LmVkdS5pbiIsInJvbGxObyI6IkVORzIxQ1QwMDAxIn0.7oKkjlsnn08GpwetuPWbVAho2TFqa-GP1JXa9EJptPM";

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;
    let internalApiUrl;

    switch (type) {
        case 'e':
            internalApiUrl = 'http://20.244.56.144/test/evens';
            break;
        case 'p':
            internalApiUrl = 'http://20.244.56.144/test/primes';
            break;
        case 'f':
            internalApiUrl = 'http://20.244.56.144/test/fibonacci';
            break;
        default:
            return res.status(400).send('Invalid type. Use "e" for even, "p" for prime, "f" for fibonacci.');
    }

    const params = {
        companyName: 'calculate',
        clientID: 'bb1e50d5-4eb9-4d9a-814a-9ebd665f8e4a',
        clientSecret: 'bHqPeOeWsfopTQwA',
        ownerName: 'afsharather',
        ownerEmail: 'eng21ct0001@dsu.edu.in',
        rollNo: 'ENG21CT0001'
    }});