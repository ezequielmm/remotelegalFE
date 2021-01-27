import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router";
import { useAuthentication } from "../../hooks/auth";
import backgroundImage from "../../assets/pre-depo/bg.png";
import { useCheckUserStatus, useRegisterParticipant } from "../../hooks/preJoinDepo/hooks";
import { DepositionID } from "../../state/types";
import EmailForm from "./components/EmailForm";
import Spinner from "../../components/Spinner";
import Message from "../../components/Message";
import ParticipantInfoForm from "./components/ParticipantInfoForm";
import Wizard from "../../components/Wizard";
import TEMP_TOKEN from "../../constants/ApiService";
import * as CONSTANTS from "../../constants/preJoinDepo";

const PreJoinDepo = () => {
    const { depositionID } = useParams<DepositionID>();
    const { isAuthenticated } = useAuthentication();
    const [step, setStep] = useState(1);
    const [checkUserStatus, userStatusLoading, userStatusError, userStatus] = useCheckUserStatus();
    const [
        registerParticipant,
        registerParticipantLoading,
        registerParticipantError,
        registeredUser,
    ] = useRegisterParticipant();
    const emailRef = useRef("");
    const history = useHistory();

    useEffect(() => {
        if (userStatus) {
            setStep(2);
        }
    }, [userStatus]);

    useEffect(() => {
        if (registeredUser) {
            const { idToken } = registeredUser;
            localStorage.setItem(TEMP_TOKEN, idToken);
            history.push(`${CONSTANTS.DEPOSITION_ROUTE}${depositionID}`);
        }
    }, [registeredUser, history, depositionID]);

    useEffect(() => {
        if (userStatusError || registerParticipantError) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [userStatusError, registerParticipantError]);

    // useEffect(() => {
    // TODO: Add logic when user is authenticated. If authenticated, get user email
    // from token, call userStatus
    // endpoint and, if participant, send him straight to the depo.

    //  }, [isAuthenticated]);

    const verifyUserStatus = async (email: string) => {
        const normalizedEmail = email.trim();
        emailRef.current = normalizedEmail;
        await checkUserStatus(depositionID, normalizedEmail);
    };

    const joinDeposition = async (name: string, role: string) => {
        // TODO: Modify this function to handle different scenarios
        const body = {
            name,
            participantType: role,
            emailAddress: emailRef.current,
        };
        await registerParticipant(depositionID, body);
    };

    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
            }}
        >
            <Wizard step={step} totalSteps={2} title={CONSTANTS.WIZARD_TITLE} text={CONSTANTS.WIZARD_TEXT}>
                {isAuthenticated === null && <Spinner />}
                {step === 1 && isAuthenticated === false && (
                    <EmailForm
                        onSubmit={verifyUserStatus}
                        loading={userStatusLoading}
                        defaultEmailValue={emailRef.current}
                    />
                )}
                {step === 2 && userStatus && !userStatus.isUser && !userStatus.participant && (
                    <ParticipantInfoForm
                        email={emailRef.current}
                        nameInput
                        roleInput
                        joinDeposition={joinDeposition}
                        backButton
                        loading={registerParticipantLoading}
                        returnFunc={() => setStep(step - 1)}
                    />
                )}
            </Wizard>
        </div>
    );
};

export default PreJoinDepo;
