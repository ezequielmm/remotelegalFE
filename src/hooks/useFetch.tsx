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
            setLoading(false);
            if (response.ok) {
                return setData(await response.json());
            }
            throw response.status;
        } catch (fetchError) {
            setLoading(false);
            setError(fetchError);
        }
    };
    return { data, error, loading, fetchAPI };
};
export default useFetch;
