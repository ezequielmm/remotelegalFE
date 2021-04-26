import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Participant } from "twilio-video";
import Exhibits from "./Exhibits";
import RealTime from "./RealTime";
import VideoConference from "./VideoConference";
import ControlsBar from "../../components/ControlsBar";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "./styles";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import ErrorScreen from "../../components/ErrorScreen";
import * as CONSTANTS from "../../constants/inDepo";
import { theme } from "../../constants/styles/theme";
import RecordPill from "../../components/RecordPill";
import { DepositionID } from "../../state/types";
import actions from "../../state/InDepo/InDepoActions";
import { ThemeMode } from "../../types/ThemeType";
import { EventModel } from "../../models";
import useSignalR from "../../hooks/useSignalR";
import GuestRequests from "./GuestRequests";
import { Roles } from "../../models/participant";
import { useAuthentication } from "../../hooks/auth";
import { useUserIsAdmin } from "../../hooks/users/hooks";
import Spinner from "../../components/Spinner";
import LoadingScreen from "./LoadingScreen";
import { NotificationEntityType } from "../../types/Notification";

const InDepo = () => {
    const isMounted = useRef(true);
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinDeposition, loading, error] = useJoinDeposition();
    const {
        breakrooms,
        isRecording,
        message,
        currentRoom,
        permissions,
        transcriptions,
        timeZone,
        dataTrack,
        currentExhibit,
        participants,
        userStatus,
        shouldSendToPreDepo,
        currentExhibitPage,
        currentUser,
    } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const [realTimeOpen, togglerRealTime] = useState<boolean>(false);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [initialAudioEnabled, setInitialAudioEnabled] = useState<boolean>(true);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const history = useHistory();
    const { isAuthenticated } = useAuthentication();
    const [checkIfUserIsAdmin, userIsAdminLoading, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();
    const { stop, sendMessage, signalR, subscribeToGroup, unsubscribeMethodFromGroup } = useSignalR("/depositionHub");

    useEffect(
        () => {
            checkIfUserIsAdmin();
            return () => {
                isMounted.current = false;
                if (stop) stop();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if (signalR?.connectionState === "Connected" && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR, depositionID, sendMessage]);

    useEffect(() => {
        const setDominantSpeaker = (participant: Participant | null) =>
            dispatch(actions.setAddDominantSpeaker(participant));

        if (currentRoom) {
            currentRoom.on("dominantSpeakerChanged", setDominantSpeaker);
        }
        const cleanUpFunction = () => {
            disconnectFromDepo(currentRoom, dispatch, null, null, depositionID);
        };
        window.addEventListener("beforeunload", cleanUpFunction);

        return () => {
            if (currentRoom) {
                currentRoom.off("dominantSpeakerChange", setDominantSpeaker);
            }
            disconnectFromDepo(currentRoom, dispatch, null, null, depositionID);
            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [currentRoom, dispatch, depositionID]);

    useEffect(() => {
        if (depositionID && isAuthenticated !== null && userIsAdmin !== undefined) {
            joinDeposition(depositionID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositionID, isAuthenticated, userIsAdmin]);

    useEffect(() => {
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([realTimeOpen, exhibitsOpen].filter(Boolean).length);
        setTimeout(() => isMounted.current && setAtendeesVisibility((prev) => !prev), 300);
    }, [realTimeOpen, exhibitsOpen]);

    useEffect(() => {
        if (message.module === "endDepo") {
            disconnectFromDepo(currentRoom, dispatch, history, null, depositionID);
        }
        if (message.module === "recordDepo") {
            dispatch(actions.setIsRecording(message.value.eventType === EventModel.EventType.onTheRecord));
            dispatch(actions.addTranscription(message.value));
        }
    }, [message, currentRoom, dispatch, history, depositionID]);

    useEffect(() => {
        if (currentExhibit || currentExhibitPage) {
            togglerExhibits(true);
        }
    }, [currentExhibit, currentExhibitPage]);

    useEffect(() => {
        if (participants?.length && currentRoom?.localParticipant) {
            const localParticipantEmail = JSON.parse(currentRoom?.localParticipant?.identity)?.email;
            const isMuted = participants.find((participant) => participant?.email === localParticipantEmail)?.isMuted;
            setInitialAudioEnabled(!isMuted);
        }
    }, [participants, currentRoom]);

    useEffect(() => {
        const onReceiveAnnotations = (message) => {
            if (
                message.entityType !== NotificationEntityType.bringAllTo ||
                (currentUser?.id && currentUser?.id === message?.content?.userId)
            )
                return;
            dispatch(actions.setCurrentExhibitPage("-1"));
            dispatch(actions.setCurrentExhibitPage(message?.content?.documentLocation));
        };
        subscribeToGroup("ReceiveNotification", onReceiveAnnotations);
        return () => {
            unsubscribeMethodFromGroup("ReceiveNotification", onReceiveAnnotations);
        };
    }, [subscribeToGroup, unsubscribeMethodFromGroup, currentUser, dispatch]);

    if (userIsAdminLoading || (loading && userStatus === null && shouldSendToPreDepo === null)) {
        return <Spinner />;
    }
    if (userStatus?.participant?.isAdmitted && loading && shouldSendToPreDepo === false) {
        return <LoadingScreen />;
    }

    if (error || errorUserIsAdmin) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_RESULT_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => {
                    if (errorUserIsAdmin) {
                        return checkIfUserIsAdmin();
                    }
                    return joinDeposition(depositionID);
                }}
            />
        );
    }

    return currentRoom && dataTrack ? (
        <ThemeProvider theme={inDepoTheme}>
            <StyledInDepoContainer data-testid="videoconference">
                {(userIsAdmin ||
                    JSON.parse(currentRoom?.localParticipant?.identity || "{}").role === Roles.courtReporter) && (
                    <GuestRequests depositionID={depositionID} />
                )}
                <StyledInDepoLayout>
                    <RecordPill on={isRecording} />
                    <Exhibits visible={exhibitsOpen} />
                    <RealTime visible={realTimeOpen} timeZone={timeZone} transcriptions={transcriptions} />
                    <VideoConference
                        localParticipant={currentRoom.localParticipant}
                        timeZone={timeZone}
                        attendees={currentRoom.participants}
                        layoutSize={videoLayoutSize}
                        atendeesVisibility={atendeesVisibility}
                        enableMuteUnmute
                    />
                </StyledInDepoLayout>
                <StyledRoomFooter>
                    <ControlsBar
                        breakrooms={breakrooms}
                        handleJoinBreakroom={(breakroomId) => {
                            history.push(`/deposition/join/${depositionID}/breakroom/${breakroomId}`);
                        }}
                        isRecording={isRecording}
                        canEnd={permissions.includes("EndDeposition")}
                        canRecord={permissions.includes("Recording")}
                        realTimeOpen={realTimeOpen}
                        togglerRealTime={togglerRealTime}
                        exhibitsOpen={exhibitsOpen}
                        togglerExhibits={togglerExhibits}
                        localParticipant={currentRoom.localParticipant}
                        initialAudioEnabled={initialAudioEnabled}
                    />
                </StyledRoomFooter>
            </StyledInDepoContainer>
        </ThemeProvider>
    ) : null;
};

export default InDepo;
