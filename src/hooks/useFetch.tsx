import React from "react";

const useFetch = (url: string, options?: RequestInit) => {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);

    // eslint-disable-next-line consistent-return
    const fetchAPI = async () => {
        if (error) {
            setError(null);
        }
        setLoading(true);
        try {
            const response = await fetch(url, options);
            const contentType = response.headers.get("content-type");
            setLoading(false);
            if (!response.ok) {
                throw response.status;
            }
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return setData(await response.json());
            }
            return setData(response);
        } catch (fetchError) {
            setLoading(false);
            setError(fetchError);
        }
    };
    return { data, error, loading, fetchAPI };
};
export default useFetch;
