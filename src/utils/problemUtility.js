const axios = require('axios');

const JUDGE0_URL = "https://ce.judge0.com";

const getLanguageById = (lang) => {
    const language = {
        "c": 50,
        "c++": 54,
        "java": 62,
        "javascript": 102,
        "python": 71
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: `${JUDGE0_URL}/submissions/batch`,
        params: { base64_encoded: 'false' },
        headers: { 'Content-Type': 'application/json' },
        data: { submissions }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(
            "Submission Error:",
            "code:", error.code,
            "status:", error.response?.status,
            "data:", error.response?.data,
            "message:", error.message
        );
        throw new Error(error.response?.data?.error || error.message || "Judge0 submitBatch failed");
    }
};

const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitToken = async (resultTokens) => {
    
    const tokenString = resultTokens.join(",");

    const options = {
        method: 'GET',
        url: `${JUDGE0_URL}/submissions/batch`,
        params: {
            tokens: tokenString,
            base64_encoded: 'false',
            fields: 'stdout,stderr,status_id,status,compile_output'
        }
    };

    const MAX_TRIES = 15;
    for (let i = 0; i < MAX_TRIES; i++) {
        try {
            const response = await axios.request(options);
            const results = response.data.submissions;

            const isFinished = results.every((r) => r.status_id > 2);

            if (isFinished) {
                return results;
            }

            console.log("Still processing... waiting 1 second");
            await waiting(1000);
        } catch (error) {
            console.error(
                "Polling Error:",
                "code:", error.code,
                "status:", error.response?.status,
                "data:", error.response?.data,
                "message:", error.message
            );
            throw new Error(error.response?.data?.error || error.message || "Judge0 polling failed");
        }
    }

    throw new Error("Judge0 polling timed out after 15 attempts");
};

module.exports = { getLanguageById, submitBatch, submitToken };