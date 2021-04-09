import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Participant } from "twilio-video";
import Spinner from "../../components/Spinner";
import Exhibits from "../InDepo/Exhibits";
import RealTime from "../InDepo/RealTime";
import VideoConference from "../InDepo/VideoConference";
import ControlsBar from "../../components/ControlsBar";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "../InDepo/styles";
import { useJoinDepositionForMockRoom } from "../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import ErrorScreen from "../../components/ErrorScreen";
import * as CONSTANTS from "../../constants/inDepo";
import { theme } from "../../constants/styles/theme";
import { DepositionID } from "../../state/types";
import actions from "../../state/InDepo/InDepoActions";
import { ThemeMode } from "../../types/ThemeType";
import useSignalR from "../../hooks/useSignalR";
import { useCheckUserStatus } from "../../hooks/preJoinDepo/hooks";
import { useAuthentication } from "../../hooks/auth";
import Message from "../../components/Message";
import StartMessage from "../../components/StartMessage";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import getDepositionTime from "./helpers/getDepositionTime";
import { NotificationAction, NotificationEntityType } from "../../types/Notification";

const InDepo = () => {
    const isMounted = useRef(true);
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinDeposition, loading, error] = useJoinDepositionForMockRoom();
    const { isRecording, currentRoom, transcriptions, timeZone, participants, startTime, breakrooms } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const [realTimeOpen, togglerRealTime] = useState<boolean>(false);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [initialAudioEnabled, setInitialAudioEnabled] = useState<boolean>(true);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const { stop, subscribeToGroup, signalR } = useSignalR("/depositionHub");
    const history = useHistory();
    const { currentEmail, isAuthenticated } = useAuthentication();
    const [checkUserStatus, , userStatusError, userStatus] = useCheckUserStatus();

    useEffect(() => {
        if (signalR) {
            subscribeToGroup("ReceiveNotification", (message) => {
                if (
                    message.entityType === NotificationEntityType.deposition &&
                    message.action === NotificationAction.start
                ) {
                    checkUserStatus(depositionID, currentEmail.current);
                }
            });
        }
    }, [signalR, subscribeToGroup, checkUserStatus, depositionID, currentEmail]);

    useEffect(() => {
        if (userStatus) {
            history.push(
                userStatus.participant.isAdmitted
                    ? `/deposition/join/${depositionID}`
                    : `/deposition/pre/${depositionID}/waiting`
            );
        }
    }, [userStatus, history, depositionID]);

    useEffect(
        () => {
            return () => {
                isMounted.current = false;
                if (stop) stop();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if (userStatusError) {
            Message({
                content: CONSTANTS.MOCK_DEPO_USER_STATUS_ERROR,
                type: "error",
                duration: 6,
            });
        }
    }, [userStatusError]);

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
        setTimeout(() => isMounted.current && setAtendeesVisibility((prev) => !prev), 300);
    }, [realTimeOpen, exhibitsOpen]);

    React.useEffect(() => {
        if (participants.length && currentRoom?.localParticipant) {
            const localParticipantEmail = JSON.parse(currentRoom?.localParticipant?.identity)?.email;
            const isMuted = participants.find((participant) => participant?.email === localParticipantEmail)?.isMuted;
            setInitialAudioEnabled(!isMuted);
        }
    }, [participants, currentRoom]);

    if (isAuthenticated === null) {
        return null;
    }

    if (loading) {
        return <Spinner />;
    }

    if (error) {
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

    return currentRoom ? (
        <ThemeProvider theme={inDepoTheme}>
            <StyledInDepoContainer data-testid="videoconference">
                <StyledInDepoLayout>
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
                        leaveWithoutModal
                        disableBreakrooms
                        disableChat
                        isRecording={isRecording}
                        canEnd={false}
                        canRecord={false}
                        realTimeOpen={realTimeOpen}
                        togglerRealTime={togglerRealTime}
                        exhibitsOpen={exhibitsOpen}
                        togglerExhibits={togglerExhibits}
                        localParticipant={currentRoom.localParticipant}
                        initialAudioEnabled={initialAudioEnabled}
                    />
                </StyledRoomFooter>
                <StartMessage
                    icon={CalendarIcon}
                    title={getDepositionTime(startTime)}
                    description={CONSTANTS.PRE_DEPOSITION_START_TIME_DESCRIPTION}
                />
            </StyledInDepoContainer>
        </ThemeProvider>
    ) : null;
};

export default InDepo;