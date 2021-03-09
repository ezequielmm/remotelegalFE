import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory, Redirect } from "react-router";
import { useAuthentication } from "../../hooks/auth";
import backgroundImage from "../../assets/pre-depo/bg.png";
import { useCheckUserStatus, useRegisterParticipant, useLogin } from "../../hooks/preJoinDepo/hooks";
import { DepositionID } from "../../state/types";
import EmailForm from "./components/EmailForm";
import Spinner from "../../components/Spinner";
import Message from "../../components/Message";
import ParticipantInfoForm from "./components/ParticipantInfoForm";
import Wizard from "../../components/Wizard";
import TEMP_TOKEN from "../../constants/ApiService";
import * as CONSTANTS from "../../constants/preJoinDepo";
import ErrorScreen from "../../components/ErrorScreen";
import Alert from "../../components/Alert";

const PreJoinDepo = () => {
    const { depositionID } = useParams<DepositionID>();
    const { isAuthenticated, currentEmail } = useAuthentication();
    const history = useHistory();
    const [step, setStep] = useState(1);
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [checkUserStatus, userStatusLoading, userStatusError, userStatus] = useCheckUserStatus();
    const { loginUser, loading: loginLoading, loginError, addParticipantError } = useLogin(depositionID);
    const [witnessAlreadyExistsError, setWitnessAlreadyExistsError] = useState(false);
    const [
        registerParticipant,
        registerParticipantLoading,
        registerParticipantError,
        registeredUser,
    ] = useRegisterParticipant();

    useEffect(() => {
        const handleAuthenticatedUser = () => {
            emailRef.current = currentEmail.current;
            return checkUserStatus(depositionID, currentEmail.current);
        };
        if (isAuthenticated) {
            handleAuthenticatedUser();
        }
    }, [checkUserStatus, isAuthenticated, depositionID, currentEmail]);

    useEffect(() => {
        if (userStatusError || (registerParticipantError && registerParticipantError !== 400)) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
        if (registerParticipantError === 400 || addParticipantError === 400) {
            setWitnessAlreadyExistsError(true);
        }
        if (loginError) {
            Message({
                content: loginError || CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [userStatusError, registerParticipantError, loginError, addParticipantError]);

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

    const verifyUserStatus = async (email: string) => {
        const normalizedEmail = email.trim();
        emailRef.current = normalizedEmail;
        await checkUserStatus(depositionID, normalizedEmail);
    };

    const joinDepositionAsGuest = async (role: string, name: string) => {
        const body = {
            name,
            participantType: role,
            emailAddress: emailRef.current,
        };
        await registerParticipant(depositionID, body);
    };

    const joinDepositionAsRegisteredUser = async (role: string, password: string) => {
        const body = {
            emailAddress: emailRef.current,
            participantType: role,
        };
        passwordRef.current = password;
        return !userStatus.participant
            ? loginUser(emailRef.current, passwordRef.current, body)
            : loginUser(emailRef.current, passwordRef.current);
    };

    if (isAuthenticated === null || (isAuthenticated && userStatusLoading)) {
        return <Spinner />;
    }
    if (isAuthenticated && userStatus?.participant) {
        return <Redirect to={`${CONSTANTS.DEPOSITION_ROUTE}${depositionID}`} />;
    }
    if (isAuthenticated && userStatusError) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_RESULT_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => checkUserStatus(depositionID, emailRef.current)}
            />
        );
    }

    const resetStep = () => {
        if (witnessAlreadyExistsError) {
            setWitnessAlreadyExistsError(false);
        }
        setStep(step - 1);
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
            <Wizard
                step={isAuthenticated ? null : step} // It´s only one step when the user is authenticated, no need for the text
                totalSteps={isAuthenticated ? null : 2}
                title={CONSTANTS.WIZARD_TITLE}
                text={CONSTANTS.WIZARD_TEXT}
                alertComponent={
                    witnessAlreadyExistsError && (
                        <Alert
                            closable
                            afterClose={() => setWitnessAlreadyExistsError(false)}
                            type="warning"
                            message={CONSTANTS.WITNESS_ALREADY_PRESENT_ERROR}
                            data-testid="witness_already_present_alert"
                        />
                    )
                }
            >
                {step === 1 && isAuthenticated === false && (
                    <EmailForm
                        onSubmit={verifyUserStatus}
                        loading={userStatusLoading}
                        defaultEmailValue={emailRef.current}
                    />
                )}
                {step === 2 && userStatus?.isUser ? (
                    <ParticipantInfoForm
                        hideBackButton={isAuthenticated}
                        email={emailRef.current}
                        roleInput={!userStatus.participant}
                        passwordInput={!isAuthenticated}
                        joinDeposition={joinDepositionAsRegisteredUser}
                        loading={loginLoading}
                        returnFunc={resetStep}
                    />
                ) : (
                    step === 2 && (
                        <ParticipantInfoForm
                            email={emailRef.current}
                            nameInput
                            roleInput
                            joinDeposition={joinDepositionAsGuest}
                            defaultRole={userStatus.participant?.role}
                            loading={registerParticipantLoading}
                            defaultName={userStatus.participant?.name}
                            disableRoleSelect={userStatus.participant}
                            returnFunc={resetStep}
                        />
                    )
                )}
            </Wizard>
        </div>
    );
};

export default PreJoinDepo;
