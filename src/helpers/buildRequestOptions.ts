const buildRequestOptions = (method, body?) => {
    return {
        method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
    };
};
export default buildRequestOptions;
