import { Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import Confirm from "../../../components/Confirm";
import Message from "../../../components/Message";
import * as CONSTANTS from "../../../constants/inDepo";
import useJoinResponse from "../../../hooks/InDepo/useJoinResponse";
import useWaitingRoomParticipants from "../../../hooks/InDepo/useWaitingRoomParticipants";
import useSignalR from "../../../hooks/useSignalR";
import { ParticipantModel } from "../../../models";

export default function GuestRequests({ depositionID }: { depositionID: string }) {
    const { subscribeToGroup, signalR, unsubscribeMethodFromGroup } = useSignalR("/depositionHub");
    const [guests, setGuests] = useState([]);
    const [showModal, setShowModal] = useState<string>();
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantModel.IParticipant>();

    const [getWaitingRoomParticipants, , , waitingRoomParticipants] = useWaitingRoomParticipants();

    useEffect(() => {
        if (depositionID && getWaitingRoomParticipants) getWaitingRoomParticipants(depositionID);
    }, [depositionID, getWaitingRoomParticipants]);

    useEffect(() => {
        return () => notification.destroy();
    }, []);

    const showConfirmation = (participant, admit) => {
        setShowModal(admit ? "allow" : "deny");
        setSelectedParticipant(participant);
        notification.destroy();
    };

    const addNotification = (participant) => {
        const args = {
            key: participant.id,
            message: (
                <div>
                    {`[${participant.role}] ${participant.user.firstName}${
                        participant.user.lastName ? ` ${participant.user.lastName}` : ""
                    }${CONSTANTS.GUEST_REQUESTS_NOTIFICATION_TITLE}`}{" "}
                </div>
            ),
            description: <div>{participant.email} </div>,
            btn: (
                <>
                    <Button
                        data-testid={CONSTANTS.GUEST_REQUESTS_DENY_BUTTON_TEST_ID}
                        onClick={() => showConfirmation(participant, false)}
                        type="link"
                        size="middle"
                    >
                        {CONSTANTS.GUEST_REQUESTS_DENY_TEXT}
                    </Button>
                    <Button
                        data-testid={CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID}
                        onClick={() => showConfirmation(participant, true)}
                        type="link"
                        size="middle"
                    >
                        {CONSTANTS.GUEST_REQUESTS_ALLOW_TEXT}
                    </Button>
                </>
            ),
            duration: 0,
            closeIcon: <></>,
        };
        notification.open(args);
    };

    const removeNotification = (id?: string) => {
        const participantId = selectedParticipant?.id || id;
        const guestIndex = guests.findIndex((guest) => guest.id === participantId);
        if (guestIndex === -1) return;
        notification.close(participantId);
        const newGuests = [...guests];
        newGuests.splice(guestIndex, 1);
        newGuests.forEach(addNotification);
        setGuests(newGuests);
        if (selectedParticipant) setSelectedParticipant(undefined);
        setShowModal(undefined);
    };

    const [joinResponse, loadingJoinResponse] = useJoinResponse(
        () => removeNotification(),
        () =>
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            })
    );

    const handleCancel = () => {
        guests.forEach(addNotification);
        setShowModal(undefined);
    };

    const handleDesition = (admit) => {
        joinResponse(depositionID, selectedParticipant?.id, admit);
    };

    useEffect(() => {
        if (waitingRoomParticipants) {
            setGuests(waitingRoomParticipants);
            waitingRoomParticipants.forEach(addNotification);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waitingRoomParticipants]);

    useEffect(() => {
        let onJoinRequest;
        if (signalR) {
            onJoinRequest = (message) => {
                if (message.entityType === "joinResponse") {
                    removeNotification(message.content.id);
                }
                if (message.entityType === "joinRequest") {
                    if (guests.findIndex((guest) => guest.email === message.content.email) > -1) return;
                    addNotification(message.content);
                    setGuests([...guests, message.content]);
                }
            };
            subscribeToGroup("ReceiveNotification", onJoinRequest);
        }
        return () => {
            if (onJoinRequest) unsubscribeMethodFromGroup("ReceiveNotification", onJoinRequest);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guests, signalR, subscribeToGroup]);

    return (
        <div>
            <Confirm
                visible={showModal === "deny"}
                title={CONSTANTS.GUEST_REQUESTS_DENY_MODAL_TITLE}
                subTitle={`[${selectedParticipant?.role}] ${selectedParticipant?.name} ${CONSTANTS.GUEST_REQUESTS_DENY_MODAL_SUBTITLE}`}
                positiveLabel={CONSTANTS.GUEST_REQUESTS_DENY_MODAL_POSITIVE_LABEL}
                data-testid="somega"
                negativeLabel={CONSTANTS.GUEST_REQUESTS_MODAL_NEGATIVE_LABEL}
                positiveLoading={loadingJoinResponse}
                negativeLoading={loadingJoinResponse}
                onPositiveClick={() => handleDesition(false)}
                onNegativeClick={handleCancel}
            />
            <Confirm
                visible={showModal === "allow"}
                title={CONSTANTS.GUEST_REQUESTS_ALLOW_MODAL_TITLE}
                subTitle={`[${selectedParticipant?.role}] ${selectedParticipant?.name} ${CONSTANTS.GUEST_REQUESTS_ALLOW_MODAL_SUBTITLE}`}
                positiveLabel={CONSTANTS.GUEST_REQUESTS_ALLOW_MODAL_POSITIVE_LABEL}
                negativeLabel={CONSTANTS.GUEST_REQUESTS_MODAL_NEGATIVE_LABEL}
                positiveLoading={loadingJoinResponse}
                negativeLoading={loadingJoinResponse}
                onPositiveClick={() => handleDesition(true)}
                onNegativeClick={handleCancel}
            />
        </div>
    );
}
