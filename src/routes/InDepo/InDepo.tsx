import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Participant } from "twilio-video";
import Spinner from "../../components/Spinner";
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
import { useUserIsAdmin } from "../../hooks/users/hooks";

const InDepo = () => {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinDeposition, loading, error] = useJoinDeposition();
    const [checkIfUserIsAdmin, loadingUserIsAdmin, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();
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
    } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const [realTimeOpen, togglerRealTime] = useState<boolean>(false);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [initialAudioEnabled, setInitialAudioEnabled] = useState<boolean>(true);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const history = useHistory();
    const { stop, sendMessage, signalR } = useSignalR("/depositionHub");

    useEffect(
        () => {
            checkIfUserIsAdmin();
            return () => {
                if (stop) stop();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if (signalR && depositionID) {
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
        if (depositionID) {
            joinDeposition(depositionID);
        }
    }, [depositionID, joinDeposition]);

    useEffect(() => {
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([realTimeOpen, exhibitsOpen].filter(Boolean).length);
        setTimeout(() => setAtendeesVisibility((prev) => !prev), 300);
    }, [realTimeOpen, exhibitsOpen]);

    useEffect(() => {
        if (message.module === "endDepo") {
            disconnectFromDepo(currentRoom, dispatch, history, null, depositionID);
        }
        if (message.module === "recordDepo") {
            dispatch(actions.setIsRecording(message.value.eventType === EventModel.EventType.onTheRecord));
            dispatch(actions.addTranscription(message.value));
        }
        if (message.module === "addTranscription") {
            dispatch(actions.addTranscription(message.value));
        }
    }, [message, currentRoom, dispatch, history, depositionID]);

    useEffect(() => {
        if (currentExhibit) {
            togglerExhibits(true);
        }
    }, [currentExhibit]);

    React.useEffect(() => {
        if (participants?.length && currentRoom?.localParticipant) {
            const localParticipantEmail = JSON.parse(currentRoom?.localParticipant?.identity)?.email;
            const isMuted = participants.find((participant) => participant?.email === localParticipantEmail)?.isMuted;
            setInitialAudioEnabled(!isMuted);
        }
    }, [participants, currentRoom]);

    if (loading || loadingUserIsAdmin) {
        return <Spinner />;
    }

    if (error || errorUserIsAdmin) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_RESULT_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => joinDeposition(depositionID)}
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
