import { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router";
import Button from "prp-components-library/src/components/Button";
import Modal from "prp-components-library/src/components/Modal";
import Space from "prp-components-library/src/components/Space";
import Spinner from "prp-components-library/src/components/Spinner";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import { DepositionID } from "../../state/types";
import backgroundImage from "../../assets/pre-depo/bg.png";
import Logo from "../../components/Logo";
import useSignalR from "../../hooks/useSignalR";
import * as CONSTANTS from "../../constants/preJoinDepo";
import ColorStatus from "../../types/ColorStatus";
import { useAuthentication } from "../../hooks/auth";
import { useGenerateDepositionToken } from "../../hooks/InDepo/depositionLifeTimeHooks";
import { useCheckUserStatus } from "../../hooks/preJoinDepo/hooks";
import ErrorScreen from "../../components/ErrorScreen";
import { NotificationEntityType } from "../../types/Notification";
import getUserNameString from "../../helpers/getUserNameString";
import useWindowSize from "../../hooks/useWindowSize";
import { theme } from "../../constants/styles/theme";

const WaitingRoom = () => {
    const [isAdmitted, setIsAdmitted] = useState<boolean>(undefined);
    const history = useHistory();
    const { depositionID } = useParams<DepositionID>();
    const { subscribeToGroup, signalR } = useSignalR("/depositionHub");
    const { currentEmail, isAuthenticated } = useAuthentication();
    const [generateToken, generateTokenLoading, generateTokenError, generatedToken] = useGenerateDepositionToken();
    const [checkUserStatus, userStatusLoading, userStatusError, userStatus] = useCheckUserStatus();
    const [windowWidth] = useWindowSize();

    useEffect(() => {
        if (isAuthenticated !== null) {
            checkUserStatus(depositionID, currentEmail.current);
            generateToken();
        }
    }, [checkUserStatus, depositionID, currentEmail, isAuthenticated, generateToken]);

    useEffect(() => {
        if (signalR) {
            subscribeToGroup("ReceiveNotification", (message) => {
                if (message.entityType !== NotificationEntityType.joinResponse) return;
                setIsAdmitted(message.content.isAdmitted);
            });
        }
    }, [signalR, subscribeToGroup]);

    if (userStatusLoading || generateTokenLoading) {
        return <Spinner />;
    }
    if (userStatusError || generateTokenError) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_WAITING_ROOM_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => checkUserStatus(depositionID, currentEmail.current)}
            />
        );
    }

    if (generatedToken?.shouldSendToPreDepo) {
        return <Redirect to={`${CONSTANTS.DEPOSITION_PRE_ROUTE}${depositionID}`} />;
    }
    if (isAdmitted || userStatus?.participant?.isAdmitted) {
        return <Redirect to={`${CONSTANTS.DEPOSITION_WAITING_ROOM_REDIRECT_ROUTE}${depositionID}`} />;
    }

    return !userStatus?.participant || isAuthenticated === null || !generatedToken ? null : (
        <div
            style={{
                height: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
            }}
        >
            <Modal onlyBody destroyOnClose closable={false} visible centered mask={false}>
                {isAdmitted === false || userStatus?.participant?.isAdmitted === false ? (
                    <>
                        <Title ellipsis={false} level={4} weight="light" dataTestId={CONSTANTS.ACCESS_DENIED_TITLE}>
                            {CONSTANTS.ACCESS_DENIED_TITLE}
                        </Title>
                        <Text
                            state={ColorStatus.disabled}
                            ellipsis={false}
                            dataTestId="waiting_room_access_denied_details"
                        >
                            <>
                                {`${CONSTANTS.ACCESS_DENIED_DETAILS_START}`}
                                <Text state={ColorStatus.disabled} ellipsis={false} weight="bold">
                                    {CONSTANTS.ACCESS_DENIED_DETAILS_EMAIL}
                                </Text>
                                {`${CONSTANTS.ACCESS_DENIED_DETAILS_MIDDLE}`}
                                <Text state={ColorStatus.disabled} ellipsis={false} weight="bold">
                                    {CONSTANTS.ACCESS_DENIED_DETAILS_NUMBER}
                                </Text>
                            </>
                        </Text>
                        <Space justify="flex-end" fullWidth>
                            <Button
                                data-testid={CONSTANTS.ACCESS_DENIED_BUTTON_TEST_ID}
                                htmlType="submit"
                                type="primary"
                                onClick={() => history.push(`${CONSTANTS.DEPOSITION_PRE_JOIN_ROUTE}${depositionID}`)}
                            >
                                {CONSTANTS.ACCESS_DENIED_BUTTON_TEXT}
                            </Button>
                        </Space>
                    </>
                ) : (
                    <Space align="center" justify="space-between" direction="vertical" size="large" fullWidth>
                        <Space justify="center" fullWidth>
                            <Logo version="dark" />
                        </Space>
                        <Space align="center" direction="vertical" fullWidth mt={10}>
                            <Text size="large" dataTestId="waiting_room_title">
                                {getUserNameString(userStatus)}
                            </Text>
                            <Title
                                dataTestId={CONSTANTS.WAITING_ROOM_SUBTITLE}
                                textAlign="center"
                                ellipsis={false}
                                level={windowWidth < parseInt(theme.default.breakpoints.sm, 10) ? 5 : 4}
                                weight="light"
                            >
                                {CONSTANTS.WAITING_ROOM_SUBTITLE}
                            </Title>
                        </Space>
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default WaitingRoom;
