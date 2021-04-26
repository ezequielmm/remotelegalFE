import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Participant } from "twilio-video";
import BreakroomControlsBar from "../../../components/BreakroomControlsBar";
import ErrorScreen from "../../../components/ErrorScreen";
import RecordPill from "../../../components/RecordPill";
import Spinner from "../../../components/Spinner";
import * as CONSTANTS from "../../../constants/inDepo";
import { theme } from "../../../constants/styles/theme";
import disconnectFromDepo from "../../../helpers/disconnectFromDepo";
import { useJoinBreakroom } from "../../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../../state/GlobalState";
import actions from "../../../state/InDepo/InDepoActions";
import { ThemeMode } from "../../../types/ThemeType";
import Exhibits from "../Exhibits";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "../styles";
import VideoConference from "../VideoConference";

const Breakroom = () => {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinBreakroom, loading, error, , errorGeneratingToken] = useJoinBreakroom();
    const { breakrooms, currentBreakroom, timeZone, breakroomDataTrack } = state.room;
    const { breakroomID, depositionID } = useParams<{ depositionID: string; breakroomID: string }>();
    const currentBreakroomData = breakrooms?.find((breakroom) => breakroom.id === breakroomID);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const history = useHistory();

    useEffect(() => {
        if (!exhibitsOpen) return;
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([exhibitsOpen].filter(Boolean).length);
        setTimeout(() => setAtendeesVisibility((prev) => !prev), 300);
    }, [exhibitsOpen]);

    useEffect(() => {
        let cleanUpFunction;
        const setDominantSpeaker = (participant: Participant | null) => {
            dispatch(actions.setAddDominantSpeaker(participant));
        };
        if (currentBreakroom) {
            currentBreakroom.on("dominantSpeakerChanged", setDominantSpeaker);

            cleanUpFunction = () => {
                disconnectFromDepo(currentBreakroom, dispatch, null, null, depositionID);
            };
            window.addEventListener("beforeunload", cleanUpFunction);
        }

        return () => {
            if (currentBreakroom) {
                currentBreakroom.off("dominantSpeakerChange", setDominantSpeaker);
                disconnectFromDepo(currentBreakroom, dispatch, null, null, depositionID);
                window.removeEventListener("beforeunload", cleanUpFunction);
            }
        };
    }, [currentBreakroom, dispatch, depositionID]);

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

    return currentBreakroom && breakroomDataTrack ? (
        <ThemeProvider theme={inDepoTheme}>
            <StyledInDepoContainer data-testid="videoconference_breakroom">
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
                    />
                </StyledRoomFooter>
            </StyledInDepoContainer>
        </ThemeProvider>
    ) : null;
};

export default Breakroom;
