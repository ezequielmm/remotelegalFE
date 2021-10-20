import { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { isMobile as isDeviceMobileOrTablet } from "react-device-detect";
import { Participant } from "twilio-video";
import Spinner from "prp-components-library/src/components/Spinner";
import { HubConnectionState } from "@microsoft/signalr";
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
import stopAllTracks from "../../helpers/stopAllTracks";
import generalUIActions from "../../state/GeneralUi/GeneralUiActions";
import TranscriptionsProvider from "../../state/Transcriptions/TranscriptionsContext";

const InDepo = () => {
    const isMounted = useRef(true);
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinDeposition, loading, error] = useJoinDepositionForMockRoom();
    const {
        tracks,
        isRecording,
        mockDepoRoom,
        timeZone,
        participants,
        startTime,
        breakrooms,
        jobNumber,
        systemSettings,
    } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const [realTimeOpen, togglerRealTime] = useState<boolean>(false);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [initialAudioEnabled, setInitialAudioEnabled] = useState<boolean>(true);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const { subscribeToGroup, signalR, sendMessage } = useSignalR("/depositionHub");
    const history = useHistory();
    const { currentEmail, isAuthenticated } = useAuthentication();
    const [checkUserStatus, , userStatusError, userStatus] = useCheckUserStatus();
    const tracksRef = useRef(tracks);

    useEffect(() => {
        tracksRef.current = tracks;
    }, [tracks]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (signalR?.connectionState === HubConnectionState.Connected && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR?.connectionState, depositionID, sendMessage]);

    useEffect(() => {
        if (signalR?.connectionState === "Connected" && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
            subscribeToGroup("ReceiveNotification", (message) => {
                if (
                    message.entityType === NotificationEntityType.deposition &&
                    message.action === NotificationAction.start
                ) {
                    checkUserStatus(depositionID, currentEmail.current);
                }
            });
        }
    }, [signalR, subscribeToGroup, checkUserStatus, depositionID, currentEmail, sendMessage]);

    useEffect(() => {
        if (userStatus) {
            history.push(
                userStatus.participant.isAdmitted
                    ? `/deposition/join/${depositionID}`
                    : `/deposition/pre/${depositionID}/waiting`
            );
        }
    }, [userStatus, history, depositionID]);

    useEffect(() => {
        return () => {
            stopAllTracks(tracksRef.current);
        };
    }, []);

    useEffect(() => {
        dispatch(generalUIActions.toggleTheme(ThemeMode.inDepo));
        return () => dispatch(generalUIActions.toggleTheme(ThemeMode.default));
    }, [dispatch]);

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

        if (mockDepoRoom) {
            mockDepoRoom.on("dominantSpeakerChanged", setDominantSpeaker);
        }
        const cleanUpFunction = () => {
            disconnectFromDepo(mockDepoRoom, dispatch, null, depositionID, tracksRef.current);
        };
        window.addEventListener("beforeunload", cleanUpFunction);

        return () => {
            if (mockDepoRoom) {
                mockDepoRoom.off("dominantSpeakerChange", setDominantSpeaker);
                disconnectFromDepo(mockDepoRoom, dispatch, null, depositionID, tracksRef.current);
            }
            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [mockDepoRoom, dispatch, depositionID]);

    useEffect(() => {
        if (depositionID) {
            joinDeposition(depositionID, isDeviceMobileOrTablet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositionID]);

    useEffect(() => {
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([realTimeOpen, exhibitsOpen].filter(Boolean).length);
        setTimeout(() => isMounted.current && setAtendeesVisibility((prev) => !prev), 300);
    }, [realTimeOpen, exhibitsOpen]);

    useEffect(() => {
        if (participants.length && mockDepoRoom?.localParticipant) {
            const localParticipantEmail = JSON.parse(mockDepoRoom?.localParticipant?.identity)?.email;
            const isMuted = participants.find((participant) => participant?.email === localParticipantEmail)?.isMuted;
            setInitialAudioEnabled(!isMuted);
        }
    }, [participants, mockDepoRoom]);

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

    return mockDepoRoom ? (
        <TranscriptionsProvider>
            <ThemeProvider theme={inDepoTheme}>
                <StyledInDepoContainer data-testid="videoconference">
                    <StyledInDepoLayout>
                        <Exhibits visible={exhibitsOpen} togglerExhibits={togglerExhibits} />
                        {realTimeOpen && <RealTime timeZone={timeZone} />}
                        <VideoConference
                            localParticipant={mockDepoRoom.localParticipant}
                            timeZone={timeZone}
                            attendees={mockDepoRoom.participants}
                            layoutSize={videoLayoutSize}
                            atendeesVisibility={atendeesVisibility}
                            enableMuteUnmute
                        />
                    </StyledInDepoLayout>
                    <StyledRoomFooter>
                        <ControlsBar
                            isPreDepo
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
                            localParticipant={mockDepoRoom.localParticipant}
                            initialAudioEnabled={initialAudioEnabled}
                            jobNumber={jobNumber}
                            settings={systemSettings}
                        />
                    </StyledRoomFooter>
                    <StartMessage
                        icon={CalendarIcon}
                        title={getDepositionTime(startTime)}
                        description={CONSTANTS.PRE_DEPOSITION_START_TIME_DESCRIPTION}
                    />
                </StyledInDepoContainer>
            </ThemeProvider>
        </TranscriptionsProvider>
    ) : null;
};

export default InDepo;
