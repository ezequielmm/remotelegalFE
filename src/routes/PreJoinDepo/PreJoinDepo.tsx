import { useEffect, useRef, useState } from "react";
import { useParams, Redirect, useHistory } from "react-router";
import Alert from "@rl/prp-components-library/src/components/Alert";
import Spinner from "@rl/prp-components-library/src/components/Spinner";
import Wizard from "@rl/prp-components-library/src/components/Wizard";
import { useAuthentication } from "../../hooks/auth";
import backgroundImage from "../../assets/pre-depo/bg.png";
import { useCheckUserStatus, useRegisterParticipant, useLogin } from "../../hooks/preJoinDepo/hooks";
import { useFrontEndContent } from "../../hooks/frontEndContent/useFrontEndContent";
import { DepositionID } from "../../state/types";
import EmailForm from "./components/EmailForm";
import Message from "../../components/Message";
import ParticipantInfoForm from "./components/ParticipantInfoForm";
import TEMP_TOKEN from "../../constants/ApiService";
import * as CONSTANTS from "../../constants/preJoinDepo";
import ErrorScreen from "../../components/ErrorScreen";
import normalizedRoles from "../../constants/roles";
import removeWhiteSpace from "../../helpers/removeWhitespace";
import useFloatingAlertContext from "../../hooks/useFloatingAlertContext";

const PreJoinDepo = () => {
    const { depositionID } = useParams<DepositionID>();
    const { isAuthenticated, currentEmail } = useAuthentication();
    const [step, setStep] = useState(1);
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [checkUserStatus, userStatusLoading, userStatusError, userStatus] = useCheckUserStatus();
    const { loginUser, loading: loginLoading, loginError, addParticipantError } = useLogin(depositionID);
    const [witnessAlreadyExistsError, setWitnessAlreadyExistsError] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [links, setLinks] = useState({});
    const [registerParticipant, registerParticipantLoading, registerParticipantError, registeredUser] =
        useRegisterParticipant();
    const history = useHistory();
    const { getFrontEndContent, frontEndContent } = useFrontEndContent();
    const addAlert = useFloatingAlertContext();

    useEffect(() => {
        getFrontEndContent();
    }, [getFrontEndContent]);

    useEffect(() => {
        if (frontEndContent) {
            frontEndContent.forEach(({ name, url }) =>
                setLinks((prevState) => ({ ...prevState, [name]: { name, url } }))
            );
        }
    }, [frontEndContent]);

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
            addAlert(
                {
                    message: CONSTANTS.NETWORK_ERROR,
                    type: "error",
                    duration: 3,
                },
                true
            );
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
    }, [userStatusError, registerParticipantError, loginError, addParticipantError, addAlert]);

    useEffect(() => {
        if (userStatus) {
            setStep(2);
        }
    }, [userStatus]);

    useEffect(() => {
        if (registeredUser) {
            const { idToken } = registeredUser;
            localStorage.setItem(TEMP_TOKEN, idToken);
            history.push(`/deposition/pre-join/troubleshoot-devices/${depositionID}`);
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
            participantType: removeWhiteSpace(role),
            emailAddress: emailRef.current,
        };
        await registerParticipant(depositionID, body);
    };

    const joinDepositionAsRegisteredUser = async (role: string, password: string) => {
        const body = {
            emailAddress: emailRef.current,
            participantType: removeWhiteSpace(role),
        };
        passwordRef.current = password;
        return !userStatus.participant?.isAdmitted
            ? loginUser(emailRef.current, passwordRef.current, body)
            : loginUser(emailRef.current, passwordRef.current);
    };

    if (isAuthenticated === null || (isAuthenticated && userStatusLoading)) {
        return <Spinner />;
    }
    if (userStatus?.participant?.isAdmitted && isAuthenticated) {
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
                        roleInput
                        passwordInput={!isAuthenticated}
                        joinDeposition={joinDepositionAsRegisteredUser}
                        loading={loginLoading}
                        returnFunc={resetStep}
                        defaultRole={normalizedRoles[userStatus?.participant?.role] || userStatus?.participant?.role}
                        defaultName={userStatus?.participant?.name}
                        disableRoleSelect={userStatus?.participant?.role}
                        termsOfUseURL={links[CONSTANTS.PREJOIN_TERMS_OF_USE_KEY]?.url}
                        linkToCerfiticacion={links[CONSTANTS.PREJOIN_CERTIFICATION_KEY]?.url}
                        isUser={userStatus?.isUser}
                    />
                ) : (
                    step === 2 && (
                        <ParticipantInfoForm
                            email={emailRef.current}
                            nameInput
                            roleInput
                            joinDeposition={joinDepositionAsGuest}
                            defaultRole={
                                normalizedRoles[userStatus?.participant?.role] || userStatus?.participant?.role
                            }
                            loading={registerParticipantLoading}
                            defaultName={userStatus?.participant?.name}
                            disableRoleSelect={userStatus?.participant?.role}
                            returnFunc={resetStep}
                            termsOfUseURL={links[CONSTANTS.PREJOIN_TERMS_OF_USE_KEY]?.url}
                            linkToCerfiticacion={links[CONSTANTS.PREJOIN_CERTIFICATION_KEY]?.url}
                            isUser={false}
                        />
                    )
                )}
            </Wizard>
        </div>
    );
};

export default PreJoinDepo;
