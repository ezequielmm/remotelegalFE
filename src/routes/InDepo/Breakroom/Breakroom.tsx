import { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Participant } from "twilio-video";
import Icon from "prp-components-library/src/components/Icon";
import Spinner from "prp-components-library/src/components/Spinner";
import BreakroomControlsBar from "../../../components/BreakroomControlsBar";
import ErrorScreen from "../../../components/ErrorScreen";
import RecordPill from "../../../components/RecordPill";
import * as CONSTANTS from "../../../constants/inDepo";
import { theme } from "../../../constants/styles/theme";
import disconnectFromDepo from "../../../helpers/disconnectFromDepo";
import { useToggleLockRoom } from "../../../hooks/breakrooms/hooks";
import { useJoinBreakroom } from "../../../hooks/InDepo/depositionLifeTimeHooks";
import useSignalR from "../../../hooks/useSignalR";
import { GlobalStateContext } from "../../../state/GlobalState";
import actions from "../../../state/InDepo/InDepoActions";
import generalUIActions from "../../../state/GeneralUi/GeneralUiActions";
import { NotificationEntityType } from "../../../types/Notification";
import { ThemeMode } from "../../../types/ThemeType";
import Exhibits from "../Exhibits";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "../styles";
import VideoConference from "../VideoConference";
import { ReactComponent as LockBreakroomIcon } from "../../../assets/icons/Lock.svg";
import { ReactComponent as UnLockBreakroomIcon } from "../../../assets/icons/Unlock.svg";
import stopAllTracks from "../../../helpers/stopAllTracks";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

const Breakroom = () => {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinBreakroom, loading, error, , errorGeneratingToken] = useJoinBreakroom();
    const { breakrooms, currentBreakroom, timeZone, breakroomDataTrack, tracks } = state.room;
    const { breakroomID, depositionID } = useParams<{ depositionID: string; breakroomID: string }>();
    const currentBreakroomData = breakrooms?.find((breakroom) => breakroom.id === breakroomID);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const [inDepoHeight, setInDepoHeight] = useState<number>();
    const [isLocked, setIsLocked] = useState(false);
    const history = useHistory();
    const { signalR, sendMessage, subscribeToGroup, unsubscribeMethodFromGroup } = useSignalR("/depositionHub");
    const [shouldShowAlert, setShouldShowAlert] = useState(false);
    const addAlert = useFloatingAlertContext();

    const [lockRoom, , lockRoomError, lockedRoom] = useToggleLockRoom();

    const getAlertMessage = () =>
        lockRoomError !== undefined
            ? CONSTANTS.BREAKROOM_LOCK_ERROR
            : isLocked
            ? CONSTANTS.BREAKROOM_IS_LOCKED
            : CONSTANTS.BREAKROOM_IS_UNLOCKED;

    useEffect(() => {
        const subscribeToLockRoomGroup = (message) => {
            if (
                message.entityType === NotificationEntityType.lockBreakRoom &&
                currentBreakroomData?.id === message.content.id
            ) {
                setShouldShowAlert(true);
                setIsLocked(message.content.isLocked);
            }
        };
        subscribeToGroup("ReceiveNotification", subscribeToLockRoomGroup);
        return () => {
            if (subscribeToLockRoomGroup) {
                unsubscribeMethodFromGroup("ReceiveNotification", subscribeToLockRoomGroup);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signalR, currentBreakroomData]);

    useEffect(() => {
        if (signalR?.connectionState === "Connected" && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR, depositionID, sendMessage]);

    useEffect(() => {
        if (!exhibitsOpen) return;
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([exhibitsOpen].filter(Boolean).length);
        setTimeout(() => setAtendeesVisibility((prev) => !prev), 300);
    }, [exhibitsOpen]);

    useEffect(() => {
        return () => {
            stopAllTracks(tracks);
        };
    }, [tracks]);

    useEffect(() => {
        dispatch(generalUIActions.toggleTheme(ThemeMode.inDepo));
        return () => dispatch(generalUIActions.toggleTheme(ThemeMode.default));
    }, [dispatch]);

    useEffect(() => {
        // Check when body height change
        const resizeObserver = new ResizeObserver((entries) => setInDepoHeight(entries[0].target.clientHeight || 0));
        resizeObserver.observe(document.body);
    }, []);

    useEffect(() => {
        let cleanUpFunction;
        const setDominantSpeaker = (participant: Participant | null) => {
            dispatch(actions.setAddDominantSpeaker(participant));
        };
        if (currentBreakroom) {
            currentBreakroom.on("dominantSpeakerChanged", setDominantSpeaker);
            cleanUpFunction = () => {
                disconnectFromDepo(currentBreakroom, dispatch, null, depositionID, tracks);
            };
            window.addEventListener("beforeunload", cleanUpFunction);
        }

        return () => {
            if (currentBreakroom) {
                currentBreakroom.off("dominantSpeakerChange", setDominantSpeaker);
            }
            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [currentBreakroom, dispatch, depositionID, tracks]);

    useEffect(() => {
        if (errorGeneratingToken === 400) {
            history.push(`/deposition/join/${depositionID}`);
        }
    }, [errorGeneratingToken, history, depositionID]);

    useEffect(() => {
        if (breakroomID) {
            joinBreakroom(breakroomID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakroomID]);

    useEffect(() => {
        setIsLocked(lockedRoom?.isLocked);
    }, [lockedRoom]);

    useEffect(() => {
        setIsLocked(currentBreakroomData?.isLocked);
    }, [currentBreakroomData]);

    useEffect(() => {
        if (shouldShowAlert || lockRoomError !== undefined) {
            addAlert({
                onClose: () => setShouldShowAlert(false),
                message: getAlertMessage(),
                type: isLocked || lockRoomError !== undefined ? "error" : "success",
                closable: true,
                duration: CONSTANTS.BREAKROOM_LOCK_ALERT_DURATION,
                icon: <Icon icon={isLocked || lockRoomError !== undefined ? LockBreakroomIcon : UnLockBreakroomIcon} />,
                dataTestId: "breakroom-lock-unlock-alert",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLocked, lockRoomError, addAlert]);

    const handleRejoinDepo = useCallback(() => {
        if (depositionID) {
            history.push(`/deposition/join/${depositionID}`);
        }
    }, [depositionID, history]);

    if (loading) {
        return <Spinner />;
    }
    if (error || errorGeneratingToken) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_RESULT_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => joinBreakroom(breakroomID)}
            />
        );
    }
    try {
        return currentBreakroom && breakroomDataTrack ? (
            <ThemeProvider theme={inDepoTheme}>
                <StyledInDepoContainer data-testid="videoconference_breakroom" height={inDepoHeight}>
                    <StyledInDepoLayout>
                        <RecordPill on={false} />
                        <Exhibits visible={exhibitsOpen} />
                        <VideoConference
                            isBreakroom
                            localParticipant={currentBreakroom.localParticipant}
                            timeZone={timeZone}
                            attendees={currentBreakroom.participants}
                            layoutSize={videoLayoutSize}
                            atendeesVisibility={atendeesVisibility}
                        />
                    </StyledInDepoLayout>
                    <StyledRoomFooter>
                        <BreakroomControlsBar
                            breakroomName={currentBreakroomData?.name || ""}
                            localParticipant={currentBreakroom.localParticipant}
                            exhibitsOpen={exhibitsOpen}
                            togglerExhibits={togglerExhibits}
                            rejoinDepo={handleRejoinDepo}
                            lockRoom={(locked) => lockRoom(locked)}
                            isLocked={isLocked}
                        />
                    </StyledRoomFooter>
                </StyledInDepoContainer>
            </ThemeProvider>
        ) : null;
    } catch (runtimeError) {
        console.error("Error rendering Breakroom:", runtimeError);
    }
};

export default Breakroom;
