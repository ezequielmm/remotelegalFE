import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { Notification, NotificationEntityType } from "../../types/Notification";
import useAsyncCallback from "../useAsyncCallback";
import useSignalR from "../useSignalR";

export const useSendParticipantStatus = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    return useAsyncCallback(
        async (muted) => await deps.apiService.setParticipantStatus({ depositionID, isMuted: muted }),
        []
    );
};

export const useGetParticipantStatus = () => {
    const { state } = useContext(GlobalStateContext);
    const { participants } = state.room;
    const { subscribeToGroup, unsubscribeMethodFromGroup, signalR } = useSignalR("/depositionHub");
    const [participantsStatus, setParticipantsStatus] = useState({});

    useEffect(() => {
        let handleParticipantStatusNotification;
        if (signalR && unsubscribeMethodFromGroup && subscribeToGroup) {
            handleParticipantStatusNotification = (message: Notification) => {
                if (message?.entityType === NotificationEntityType.participantStatus) {
                    const { content } = message;
                    setParticipantsStatus((status) => ({ ...status, [`${content.email}`]: content }));
                }
            };
            subscribeToGroup("ReceiveNotification", handleParticipantStatusNotification);
        }
        return () => {
            if (handleParticipantStatusNotification)
                unsubscribeMethodFromGroup("ReceiveNotification", handleParticipantStatusNotification);
        };
    }, [signalR, subscribeToGroup, unsubscribeMethodFromGroup]);

    useEffect(() => {
        participants?.forEach((participant) => {
            if (participant?.email) {
                setParticipantsStatus((status) => ({ ...status, [`${participant?.email}`]: participant }));
            }
        });
    }, [participants]);

    return { participantsStatus };
};
