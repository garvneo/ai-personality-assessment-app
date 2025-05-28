import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:5000'; // Change if your backend is hosted elsewhere

/**
 * Logs in a user with the given credentials and role.
 * @param {string} username
 * @param {string} password
 * @param {string} role
 * @returns {Promise}
 */
export const login = (username, password, role) => {
    console.log('Logging in:', { username, role });
    return axios.post(`${API_URL}/login`, { username, password, role });
};

/**
 * Starts a new assessment session.
 * @param {string} name
 * @param {string} token
 * @returns {Promise}
 */
export const startAssessment = (name, token) => {
    console.log('Starting assessment for:', name);
    return axios.post(`${API_URL}/start`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Submits a response to a question in an assessment session.
 * @param {string} sessionId
 * @param {string} question
 * @param {string} answer
 * @param {string} token
 * @returns {Promise}
 */
export const submitResponse = (sessionId, question, answer, token) => {
    console.log('Submitting response:', { sessionId, question, answer });
    return axios.post(`${API_URL}/submit`, { session_id: sessionId, question, answer }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Retrieves the profile for a given assessment session.
 * @param {string} sessionId
 * @param {string} token
 * @returns {Promise}
 */
export const getProfile = (sessionId, token) => {
    console.log('Fetching profile for session:', sessionId);
    return axios.get(`${API_URL}/profile/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Gets the next question for a given assessment session.
 * @param {string} sessionId
 * @param {string} token
 * @returns {Promise}
 */
export const getNextQuestion = (sessionId, token) => {
    console.log('Getting next question for session:', sessionId);
    return axios.post(`${API_URL}/generate-question`, { session_id: sessionId }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Gets feedback for a candidate's assessment session.
 * @param {string} sessionId
 * @param {string} token
 * @returns {Promise}
 */
export const getFeedback = (sessionId, token) => {
    console.log('Getting feedback for session:', sessionId);
    return axios.get(`${API_URL}/candidate/feedback/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Retrieves the list of candidates for a recruiter.
 * @param {string} token
 * @returns {Promise}
 */
export const getRecruiterCandidates = (token) => {
    console.log('Fetching recruiter candidates');
    return axios.get(`${API_URL}/recruiter/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Compares multiple candidates by their IDs.
 * @param {Array<string>} ids
 * @param {string} token
 * @returns {Promise}
 */
export const compareCandidates = (ids, token) => {
    console.log('Comparing candidates:', ids);
    return axios.post(`${API_URL}/recruiter/compare`, { candidate_ids: ids }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/**
 * Gets trend data for the recruiter dashboard.
 * @param {string} token
 * @returns {Promise}
 */
export const getTrends = (token) => {
    console.log('Fetching recruiter trends');
    return axios.get(`${API_URL}/recruiter/trends`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
