import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import { DepositionID } from "../../../state/types";
import Space from "../../../components/Space";
import Modal from "../../../components/Modal";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import Logo from "../../../components/Logo";
import useSignalR from "../../../hooks/useSignalR";
import { UserInfo } from "../../../models/user";
import * as CONSTANTS from "../../../constants/preJoinDepo";
import ColorStatus from "../../../types/ColorStatus";
import Button from "../../../components/Button";

const WaitingRoom = ({ userStatus }: { userStatus: UserInfo }) => {
    const [isAdmitted, setIsAdmitted] = useState<boolean>(undefined);
    const { depositionID } = useParams<DepositionID>();
    const { subscribeToGroup, signalR } = useSignalR("/depositionHub");

    useEffect(() => {
        if (signalR) {
            subscribeToGroup("ReceiveNotification", (message) => {
                if (message.entityType !== "joinResponse") return;
                setIsAdmitted(message.content.isAdmitted);
            });
        }
    }, [signalR, subscribeToGroup]);

    if (isAdmitted) return <Redirect to={`${CONSTANTS.DEPOSITION_ROUTE}${depositionID}`} />;

    return (
        <Modal onlyBody destroyOnClose closable={false} visible centered mask={false}>
            {isAdmitted === false ? (
                <>
                    <Title ellipsis={false} level={4} weight="light">
                        {CONSTANTS.ACCESS_DENIED_TITLE}
                    </Title>
                    <Text state={ColorStatus.disabled} size="large" ellipsis={false}>
                        {`${CONSTANTS.ACCESS_DENIED_DETAILS_START}${CONSTANTS.ACCESS_DENIED_DETAILS_EMAIL}${CONSTANTS.ACCESS_DENIED_DETAILS_MIDDLE}${CONSTANTS.ACCESS_DENIED_DETAILS_NUMBER}`}
                    </Text>

                    <Space justify="flex-end" fullWidth>
                        <Button
                            data-testid={CONSTANTS.ACCESS_DENIED_BUTTON_TEST_ID}
                            htmlType="submit"
                            type="primary"
                            onClick={() => window.location.reload()}
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
                    <Space align="center" direction="vertical" fullWidth>
                        <Text size="large">
                            <>
                                {CONSTANTS.WAITING_ROOM_TITLE}
                                <strong>{`${userStatus.participant?.user?.firstName}${
                                    userStatus.participant?.user?.lastName
                                        ? ` ${userStatus.participant?.user?.lastName}`
                                        : ""
                                },`}</strong>
                            </>
                        </Text>
                        <Title textAlign="center" ellipsis={false} level={4} weight="light">
                            {CONSTANTS.WAITING_ROOM_SUBTITLE}
                        </Title>
                    </Space>
                </Space>
            )}
        </Modal>
    );
};

export default WaitingRoom;
