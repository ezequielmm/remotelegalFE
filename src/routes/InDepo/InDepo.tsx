import { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Participant } from "twilio-video";
import Spinner from "prp-components-library/src/components/Spinner";
import Exhibits from "./Exhibits";
import RealTime from "./RealTime";
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
import { useSystemSetting } from "../../hooks/InDepo/useSystemSettings";

const InDepo = () => {
    const { depositionID } = useParams<DepositionID>();
    const isMounted = useRef(true);
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [initialTranscriptions, setInitialTranscriptions] = useState<TranscriptionModel.Transcription[]>([]);
    const [joinDeposition, loading, error] = useJoinDeposition(setInitialTranscriptions);
    const {
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
        shouldSendToPreDepo,
        currentExhibitPage,
        jobNumber,
        tracks,
    } = state.room;

    const { currentUser } = state?.user;

    const [realTimeOpen, togglerRealTime] = useState<boolean>(false);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [initialAudioEnabled, setInitialAudioEnabled] = useState<boolean>(true);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const [inDepoHeight, setInDepoHeight] = useState<number>();
    const history = useHistory();
    const tracksRef = useRef(tracks);
    const { isAuthenticated } = useAuthentication();
    const { sendMessage, signalR, subscribeToGroup, unsubscribeMethodFromGroup, isReconnected } =
        useSignalR("/depositionHub");

    const { settings, loading: loadingSettings } = useSystemSetting();

    useEffect(() => {
        dispatch(generalUIActions.toggleTheme(ThemeMode.inDepo));
        return () => dispatch(generalUIActions.toggleTheme(ThemeMode.default));
    }, [dispatch]);

    useEffect(() => {
        tracksRef.current = tracks;
    }, [tracks]);

    useEffect(() => {
        // Check when body height change
        const resizeObserver = new ResizeObserver((entries) => setInDepoHeight(entries[0].target.clientHeight || 0));
        resizeObserver.observe(document.body);

        return () => {
            isMounted.current = false;
        };
    }, []);

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
            stopAllTracks(tracksRef.current);
        };
    }, []);

    useEffect(() => {
        if ((signalR?.connectionState === "Connected" || isReconnected) && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR, depositionID, sendMessage, isReconnected]);

    useEffect(() => {
        const handleRoomEndError = (_, roomError) => {
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
        };
        const setDominantSpeaker = (participant: Participant | null) =>
            dispatch(actions.setAddDominantSpeaker(participant));

        if (currentRoom) {
            currentRoom.on("disconnected", handleRoomEndError);
            currentRoom.on("dominantSpeakerChanged", setDominantSpeaker);
        }
        const cleanUpFunction = () => {
            disconnectFromDepo(currentRoom, dispatch, null, depositionID, tracksRef.current);
        };
        window.addEventListener("beforeunload", cleanUpFunction);

        return () => {
            if (currentRoom) {
                currentRoom.off("disconnected", handleRoomEndError);
                currentRoom.off("dominantSpeakerChange", setDominantSpeaker);
            }

            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [currentRoom, dispatch, depositionID, history]);

    useEffect(() => {
        if (depositionID && isAuthenticated !== null && currentUser) {
            joinDeposition(depositionID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depositionID, isAuthenticated, currentUser]);

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
    if (loading && userStatus === null && shouldSendToPreDepo === null) {
        return <Spinner />;
    }
    if ((userStatus?.participant?.isAdmitted && loading && shouldSendToPreDepo === false) || loadingSettings) {
        return <LoadingScreen />;
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

    return currentRoom && dataTrack ? (
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
                        <RecordPill on={isRecording} />
                        <Exhibits visible={exhibitsOpen} togglerExhibits={togglerExhibits} />
                        {realTimeOpen && <RealTime timeZone={timeZone} />}
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
                            settings={settings}
                        />
                    </StyledRoomFooter>
                </StyledInDepoContainer>
            </ThemeProvider>
        </TranscriptionsProvider>
    ) : null;
};

export default InDepo;
