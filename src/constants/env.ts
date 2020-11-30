/* eslint-disable import/prefer-default-export */
export default {
    API: {
        URL: process.env.REACT_APP_BASE_BE_URL,
        API_RETRY_REQUEST_ATTEMPTS: 0,
        API_RETRY_REQUEST_ATTEMPT_DELAY_MS: 500,
        API_RETRY_REQUEST_STATUS_CODE_RANGES_REGEX: /^(40[0-3])|503$/,
    },
    AUTH: {
        REGION: process.env.REACT_APP_Auth_region,
        USER_POOL_ID: process.env.REACT_APP_Auth_userPoolId,
        USER_POOL_WEB_CLIENT_ID: process.env.REACT_APP_Auth_userPoolWebClientId,
    },
};
