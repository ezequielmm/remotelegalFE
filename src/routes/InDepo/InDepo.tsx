import { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { isMobile as isDeviceMobileOrTablet, isMobileOnly } from "react-device-detect";
import { Participant, connect } from "twilio-video";
import Spinner from "@rl/prp-components-library/src/components/Spinner";
import { Row } from "antd/lib/grid";
import Alert from "@rl/prp-components-library/src/components/Alert";
import { HubConnectionState } from "@microsoft/signalr";
import Exhibits from "./Exhibits";
import RealTime from "./RealTime";
import { ReactComponent as NoConnectionIcon } from "../../assets/in-depo/No-Connection.svg";
import VideoConference from "./VideoConference";
import ControlsBar from "../../components/ControlsBar";
import { GlobalStylesInDepo, StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "./styles";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import ErrorScreen from "../../components/ErrorScreen";
import * as CONSTANTS from "../../constants/inDepo";
import { theme } from "../../constants/styles/theme";
import RecordPill from "../../components/RecordPill";
import { DepositionID } from "../../state/types";
import actions from "../../state/InDepo/InDepoActions";
import signalRActions from "../../state/SignalR/SignalRActions";
import generalUIActions from "../../state/GeneralUi/GeneralUiActions";
import { ThemeMode } from "../../types/ThemeType";
import { EventModel, TranscriptionModel } from "../../models";
import useSignalR from "../../hooks/useSignalR";
import GuestRequests from "./GuestRequests";
import { Roles } from "../../models/participant";
import { useAuthentication } from "../../hooks/auth";
import LoadingScreen from "./LoadingScreen";
import { NotificationEntityType } from "../../types/Notification";
import stopAllTracks from "../../helpers/stopAllTracks";
import TranscriptionsProvider from "../../state/Transcriptions/TranscriptionsContext";
import { WindowSizeContext } from "../../contexts/WindowSizeContext";
import useWindowOrientation from "../../hooks/useWindowOrientation";
import useGetTranscriptions from "../../hooks/InDepo/useGetTranscriptions";
import useGetEvents from "../../hooks/InDepo/useGetEvents";
import { setTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";
import { useExhibitFileInfo } from "../../hooks/exhibits/hooks";
import useGetDepoSummaryInfo from "../../hooks/InDepo/useGetDepoSummaryInfo";
import useFloatingAlertContext from "../../hooks/useFloatingAlertContext";
import WrongOrientationScreen from "./WrongOrientationScreen/WrongOrientationScreen";
import ORIENTATION_STATE from "../../types/orientation";
import { getREM } from "../../constants/styles/utils";

const StyledAlertRow = styled(Row)`
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1000;
`;

const StyledAlert = styled(Alert)`
    width: fit-content;
    top: ${getREM(theme.default.spaces[4])};
    z-index: 3000;
`;

const InDepo = () => {
    const { depositionID } = useParams<DepositionID>();
    const isMounted = useRef(true);
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [initialTranscriptions, setInitialTranscriptions] = useState<TranscriptionModel.Transcription[]>([]);
    const [joinDeposition, loading, error] = useJoinDeposition(setInitialTranscriptions);
    const [getDepoSummaryInfo, , , depoSummaryInfo] = useGetDepoSummaryInfo();
    const [getTranscriptions] = useGetTranscriptions();
    const [getDepositionEvents] = useGetEvents();
    const {
        token,
        breakrooms,
        isRecording,
        message,
        currentRoom,
        permissions,
        timeZone,
        dataTrack,
        currentExhibit,
        participants,
        userStatus,
        systemSettings,
        shouldSendToPreDepo,
        currentExhibitPage,
        jobNumber,
        tracks,
        depoRoomReconnecting,
    } = state.room;

    const { currentUser } = state?.user;
    const orientation = useWindowOrientation();
    const [windowWidth, windowHeight] = useContext(WindowSizeContext);
    const { isReconnected, isReconnecting } = state?.signalR.signalRConnectionStatus;
    const [realTimeOpen, togglerRealTime] = useState<boolean>(false);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [initialAudioEnabled, setInitialAudioEnabled] = useState<boolean>(true);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const addAlert = useFloatingAlertContext();
    const tries = useRef(0);
    const [inDepoHeight, setInDepoHeight] = useState<number>();
    const history = useHistory();
    const tracksRef = useRef(tracks);
    const { isAuthenticated } = useAuthentication();
    const { sendMessage, signalR, subscribeToGroup, unsubscribeMethodFromGroup } = useSignalR("/depositionHub");
    const [fetchExhibitFileInfo] = useExhibitFileInfo();
    const readyToBeRendered = currentRoom && dataTrack;

    useEffect(() => {
        dispatch(generalUIActions.toggleTheme(ThemeMode.inDepo));
        return () => dispatch(generalUIActions.toggleTheme(ThemeMode.default));
    }, [dispatch]);

    useEffect(() => {
        tracksRef.current = tracks;
    }, [tracks]);

    useEffect(() => {
        setInDepoHeight(windowHeight || 0);
    }, [windowHeight]);

    useEffect(() => {
        if (!signalR) {
            return undefined;
        }
        return () => {
            signalR.stop();
            dispatch(signalRActions.setSignalR(null));
        };
    }, [signalR, dispatch]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
            stopAllTracks(tracksRef.current);
        };
    }, []);

    useEffect(() => {
        if (signalR?.connectionState === HubConnectionState.Connected && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR?.connectionState, depositionID, sendMessage]);

    useEffect(() => {
        const handleReconnection = (error) => {
            if (!error) {
                dispatch(actions.setInDepoReconnecting(false));
                console.error("Reconnected to Twilio´s room");
            }
            if (error?.code === 53001 || error?.code === 53405) {
                dispatch(actions.setInDepoReconnecting(true));
                console.error("Reconnecting Twilio", error.message);
            }
        };
        const handleRoomEndError = async (_, roomError) => {
            if (
                (roomError?.code === 53000 ||
                    roomError?.code === 53002 ||
                    roomError?.code === 53001 ||
                    roomError?.code === 53405) &&
                isMounted.current
            ) {
                const connectToRoom = async () => {
                    try {
                        await connect(token, {
                            ...CONSTANTS.TWILIO_VIDEO_CONFIG,
                            name: depositionID,
                            tracks: tracksRef.current,
                        });
                        tries.current = 0;
                        return dispatch(actions.setInDepoReconnecting(false));
                    } catch {
                        tries.current += 1;
                        if (tries.current === 3) {
                            dispatch(actions.setInDepoReconnecting(false));
                            addAlert({
                                message: CONSTANTS.DISCONNECTED_FROM_DEPO,
                                closable: true,
                                type: "info",
                                duration: 3,
                                dataTestId: "depo_disconnected_toast",
                            });
                            console.error("Couldn´t reconnect to deposition");
                            return history.push(`/deposition/pre-join/troubleshoot-devices/${depositionID}`);
                        }
                        connectToRoom();
                        console.error("Couldn´t reconnect to deposition");
                    }
                    return null;
                };
                console.error("Signaling reconnection failed", roomError.message);
                return connectToRoom();
            }
            if (roomError?.code === 53118 && isMounted.current) {
                disconnectFromDepo(
                    currentRoom,
                    dispatch,
                    history,
                    depositionID,
                    tracksRef.current,
                    currentRoom?.localParticipant?.identity &&
                        JSON.parse(currentRoom?.localParticipant?.identity).role === Roles.witness
                );
            }
            return null;
        };
        const setDominantSpeaker = (participant: Participant | null) =>
            dispatch(actions.setAddDominantSpeaker(participant));

        if (currentRoom) {
            currentRoom.on("reconnected", handleReconnection);
            currentRoom.on("reconnecting", handleReconnection);
            currentRoom.on("disconnected", handleRoomEndError);
            currentRoom.on("dominantSpeakerChanged", setDominantSpeaker);
        }
        const cleanUpFunction = () => {
            disconnectFromDepo(currentRoom, dispatch, null, depositionID, tracksRef.current);
        };
        window.addEventListener("beforeunload", cleanUpFunction);

        return () => {
            if (currentRoom) {
                currentRoom.off("reconnected", handleReconnection);
                currentRoom.off("reconnecting", handleReconnection);
                currentRoom.off("disconnected", handleRoomEndError);
                currentRoom.off("dominantSpeakerChange", setDominantSpeaker);
            }

            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [currentRoom, dispatch, depositionID, history, token, addAlert]);

    useEffect(() => {
        if (depositionID && isAuthenticated !== null && currentUser) {
            joinDeposition(depositionID, isDeviceMobileOrTablet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositionID, isAuthenticated, currentUser]);

    useEffect(() => {
        if (isReconnected || readyToBeRendered) {
            getDepoSummaryInfo();
        }
    }, [getDepoSummaryInfo, isReconnected, readyToBeRendered]);

    useEffect(() => {
        const fetchDepoData = async () => {
            if ((isReconnected || readyToBeRendered) && depoSummaryInfo) {
                dispatch(actions.setParticipantsData(depoSummaryInfo.participants));
                dispatch(actions.setIsRecording(depoSummaryInfo.isOnTheRecord));
                if (depoSummaryInfo.isSharing) {
                    dispatch(actions.setSharedExhibit(null));
                    fetchExhibitFileInfo(depositionID);
                    togglerExhibits(true);
                } else {
                    togglerExhibits(false);
                }
                const transcriptions = !isMobileOnly ? await getTranscriptions() : [];
                const events = await getDepositionEvents(depositionID);
                setInitialTranscriptions(setTranscriptionMessages(transcriptions, events));
            }
        };
        fetchDepoData();
    }, [
        depoSummaryInfo,
        isReconnected,
        depositionID,
        dispatch,
        readyToBeRendered,
        getDepositionEvents,
        getTranscriptions,
        fetchExhibitFileInfo,
    ]);

    useEffect(() => {
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([realTimeOpen, exhibitsOpen].filter(Boolean).length);
        setTimeout(() => isMounted.current && setAtendeesVisibility((prev) => !prev), 300);
    }, [realTimeOpen, exhibitsOpen]);

    useEffect(() => {
        if (message.module === "recordDepo") {
            dispatch(actions.setIsRecording(message.value.eventType === EventModel.EventType.onTheRecord));
        }
    }, [dispatch, message]);

    useEffect(() => {
        if (currentExhibit || currentExhibitPage) {
            togglerExhibits(true);
        }
    }, [currentExhibit, currentExhibitPage]);

    useEffect(() => {
        if (participants?.length && currentRoom?.localParticipant) {
            const localParticipantEmail = JSON.parse(currentRoom?.localParticipant?.identity)?.email;
            const isMuted = participants.find((participant) => participant?.email === localParticipantEmail)?.isMuted;
            dispatch(actions.setIsMuted(isMuted));
            setInitialAudioEnabled(!isMuted);
        }
    }, [participants, currentRoom, dispatch]);

    useEffect(() => {
        const onReceiveAnnotations = (signalRMessage) => {
            if (
                signalRMessage.entityType === NotificationEntityType.bringAllTo &&
                currentUser?.id &&
                currentUser?.id !== signalRMessage?.content?.userId
            ) {
                dispatch(actions.setCurrentExhibitPage("-1"));
                dispatch(actions.setCurrentExhibitPage(signalRMessage?.content?.documentLocation));
            }
            if (signalRMessage.entityType === NotificationEntityType.lockBreakRoom) {
                dispatch(
                    actions.setBreakrooms(
                        breakrooms.map((breakroom) => ({
                            ...breakroom,
                            isLocked:
                                breakroom.id === signalRMessage?.content?.id
                                    ? signalRMessage?.content?.isLocked
                                    : breakroom.isLocked,
                        }))
                    )
                );
            }
            if (signalRMessage.entityType === NotificationEntityType.endDeposition) {
                disconnectFromDepo(
                    currentRoom,
                    dispatch,
                    history,
                    depositionID,
                    [],
                    currentRoom?.localParticipant?.identity &&
                        JSON.parse(currentRoom?.localParticipant?.identity).role === Roles.witness
                );
            }
        };
        subscribeToGroup("ReceiveNotification", onReceiveAnnotations);
        return () => {
            unsubscribeMethodFromGroup("ReceiveNotification", onReceiveAnnotations);
        };
    }, [
        subscribeToGroup,
        unsubscribeMethodFromGroup,
        currentUser,
        dispatch,
        breakrooms,
        currentRoom,
        history,
        depositionID,
    ]);

    if (loading && userStatus === null && shouldSendToPreDepo === null && !isReconnected && !isReconnecting) {
        return <Spinner />;
    }
    if (!isReconnected) {
        if (userStatus?.participant?.isAdmitted && loading && shouldSendToPreDepo === false) {
            return <LoadingScreen />;
        }
    }

    if (error) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_RESULT_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => {
                    return joinDeposition(depositionID);
                }}
            />
        );
    }

    return readyToBeRendered ? (
        <TranscriptionsProvider
            initialTranscriptions={initialTranscriptions}
            setInitialTranscriptions={setInitialTranscriptions}
        >
            <ThemeProvider theme={inDepoTheme}>
                <GlobalStylesInDepo />
                <StyledInDepoContainer data-testid="videoconference" height={inDepoHeight}>
                    {(!!currentUser?.isAdmin ||
                        JSON.parse(currentRoom?.localParticipant?.identity || "{}").role === Roles.courtReporter) && (
                        <GuestRequests depositionID={depositionID} />
                    )}
                    <StyledInDepoLayout>
                        <StyledAlertRow justify="space-around" align="middle">
                            {(depoRoomReconnecting || isReconnecting) && (
                                <StyledAlert
                                    data-testid={CONSTANTS.RECONNECTING_ALERT_MESSAGE_TEST_ID}
                                    icon={<NoConnectionIcon />}
                                    type="info"
                                    closable={false}
                                    message={CONSTANTS.RECONNECTING_ALERT_MESSAGE}
                                />
                            )}
                            <RecordPill on={isRecording} />
                        </StyledAlertRow>
                        <Exhibits visible={exhibitsOpen} togglerExhibits={togglerExhibits} />
                        {realTimeOpen && <RealTime timeZone={timeZone} />}
                        <VideoConference
                            localParticipant={currentRoom.localParticipant}
                            timeZone={timeZone}
                            attendees={currentRoom.participants}
                            layoutSize={videoLayoutSize}
                            atendeesVisibility={atendeesVisibility}
                            enableMuteUnmute
                            canChangeParticipantRole={
                                currentUser?.isAdmin || userStatus?.participant?.role === Roles.courtReporter
                            }
                            onUpdateParticipantRole={(token) => joinDeposition(depositionID, null, token)}
                        />
                    </StyledInDepoLayout>
                    <StyledRoomFooter>
                        <ControlsBar
                            canViewTechTab={permissions.includes("ViewDepositionStatus")}
                            breakrooms={breakrooms}
                            canJoinToLockedBreakroom={
                                JSON.parse(currentRoom?.localParticipant?.identity || "{}").role === Roles.courtReporter
                            }
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
                            jobNumber={jobNumber}
                            settings={systemSettings}
                        />
                    </StyledRoomFooter>
                </StyledInDepoContainer>
                {((windowWidth < parseInt(theme.default.breakpoints.lg, 10) &&
                    orientation === ORIENTATION_STATE.LANDSCAPE) ||
                    (windowWidth > parseInt(theme.default.breakpoints.sm, 10) &&
                        orientation === ORIENTATION_STATE.PORTRAIT)) && (
                    <WrongOrientationScreen orientation={orientation} />
                )}
            </ThemeProvider>
        </TranscriptionsProvider>
    ) : null;
};

export default InDepo;
