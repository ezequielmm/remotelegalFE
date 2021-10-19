import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../state/GlobalState";
import { Notification, NotificationAction, NotificationEntityType } from "../types/Notification";
import useAsyncCallback from "./useAsyncCallback";
import useSignalR from "./useSignalR";

const useEditParticipantRole = (onClose = null, onUpdateRole = null, onError = null) => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { unsubscribeMethodFromGroup, subscribeToGroup, signalR } = useSignalR("/depositionHub");
    const errorRef = useRef(null);

    const [editParticipantRole, loading, error, remoteParticipantRoleEdited] = useAsyncCallback(async (payload) => {
        errorRef.current = null;
        return deps.apiService.editParticipantRole(depositionID, payload);
    }, []);

    useEffect(() => {
        if (onError && error && !errorRef.current) {
            errorRef.current = error;
            onError(error);
        }
    }, [error, onError]);

    useEffect(() => {
        if (remoteParticipantRoleEdited && onClose) {
            onClose(remoteParticipantRoleEdited);
        }
    }, [remoteParticipantRoleEdited, onClose]);

    useEffect(() => {
        let handleParticipantRoleNotification;
        if (signalR && unsubscribeMethodFromGroup && subscribeToGroup) {
            handleParticipantRoleNotification = (message: Notification) => {
                if (
                    message?.entityType === NotificationEntityType.participantRole &&
                    message?.action === NotificationAction.update
                ) {
                    const { content } = message;

                    const { token, role } = content;
                    onUpdateRole(token, role);
                }
            };
            subscribeToGroup("ReceiveNotification", handleParticipantRoleNotification);
        }
        return () => {
            if (handleParticipantRoleNotification)
                unsubscribeMethodFromGroup("ReceiveNotification", handleParticipantRoleNotification);
        };
    }, [signalR, subscribeToGroup, unsubscribeMethodFromGroup, onUpdateRole]);

    return { editParticipantRole, loading };
};

export default useEditParticipantRole;
