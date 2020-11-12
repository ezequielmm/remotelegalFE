import { Auth } from "aws-amplify";
import React from "react";

interface fetchAPIParams {
    urlParams?: string | string[][] | Record<string, string> | URLSearchParams;
    extraOptions?: object;
}

const useFetch = (url: string, options?: RequestInit, addToken: boolean = true) => {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);

    // eslint-disable-next-line consistent-return
    const fetchAPI = async ({ urlParams = {}, extraOptions = {} }: fetchAPIParams = {}) => {
        let jwt = null;

        if (addToken) {
            try {
                const session = await Auth.currentSession();
                jwt = session.getIdToken().getJwtToken();
            } catch {
                jwt = "";
            }
        }
        if (error) {
            setError(null);
        }
        setLoading(true);
        const headers = addToken ? { ...options.headers, Authorization: `Bearer ${jwt}` } : options.headers;
        try {
            const response = Object.keys(urlParams).length
                ? await fetch(`${url}?${new URLSearchParams(urlParams)}`, {
                      ...options,
                      headers,
                      ...extraOptions,
                  })
                : await fetch(`${url}`, {
                      ...options,
                      headers,
                      ...extraOptions,
                  });
            const contentType = response.headers?.get("content-type");
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
    return { data, error, loading, fetchAPI, setData };
};
export default useFetch;
