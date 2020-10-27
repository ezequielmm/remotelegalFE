import React from "react";
import { NETWORK_ERROR } from "../constants/errors";
import useFetch from "../../../hooks/useFetch";
import buildRequestOptions from "../../../helpers/buildRequestOptions";

interface CodeSentProps {
    email: string;
}
const CodeSent = ({ email }: CodeSentProps) => {
    const requestObj = buildRequestOptions("POST", {
        emailAddress: email,
    });
    const { error, loading, fetchAPI } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Users/resendVerificationEmail`,
        requestObj
    );

    const handleLinkFetch = () => {
        if (loading) {
            return;
        }
        fetchAPI();
    };
    return (
        <>
            <p
                style={{
                    fontFamily: "Merriweather",
                    textAlign: "center",
                    fontSize: "36px",
                    margin: 0,
                    color: "#14232E",
                }}
            >
                Check your mailbox
            </p>
            <p
                style={{
                    fontFamily: "Merriweather",
                    textAlign: "center",
                    fontSize: "24px",
                    margin: 0,
                    color: "#14232E",
                }}
            >
                {email}
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
                <p
                    style={{
                        fontFamily: "Lato",
                        fontWeight: "bold",
                        color: "#8591A6",
                        fontSize: "20px",
                        marginBottom: "0",
                    }}
                >
                    Didn´t get the email?
                </p>
                <button
                    type="button"
                    style={{ appearance: "none", border: "none", cursor: "pointer" }}
                    onClick={handleLinkFetch}
                >
                    <p
                        style={{
                            fontFamily: "Lato",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#C09853",
                            margin: "0",
                        }}
                    >
                        Click here to resend it
                    </p>
                </button>
                {error && <p>{NETWORK_ERROR}</p>}
            </div>
        </>
    );
};
export default CodeSent;
