import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import BreakroomControlsBar from "../../../components/BreakroomControlsBar";
import ErrorScreen from "../../../components/ErrorScreen";
import RecordPill from "../../../components/RecordPill";
import Spinner from "../../../components/Spinner";
import * as CONSTANTS from "../../../constants/inDepo";
import { theme } from "../../../constants/styles/theme";
import disconnectFromDepo from "../../../helpers/disconnectFromDepo";
import { useJoinBreakroom } from "../../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ThemeMode } from "../../../types/ThemeType";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "../styles";
import VideoConference from "../VideoConference";

const Breakroom = () => {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinBreakroom, loading, error] = useJoinBreakroom();
    const { breakrooms, currentBreakroom, timeZone, breakroomDataTrack } = state.room;
    const { breakroomID } = useParams<{ depositionID: string; breakroomID: string }>();
    const currentBreakroomData = breakrooms?.find((breakroom) => breakroom.id === breakroomID);

    useEffect(() => {
        const cleanUpFunction = () => {
            disconnectFromDepo(currentBreakroom, dispatch);
        };
        window.addEventListener("beforeunload", cleanUpFunction);

        return () => {
            disconnectFromDepo(currentBreakroom, dispatch);
            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [currentBreakroom, dispatch]);

    useEffect(() => {
        if (breakroomID) {
            joinBreakroom(breakroomID);
        }
    }, [breakroomID, joinBreakroom]);

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
                onClick={() => joinBreakroom(breakroomID)}
            />
        );
    }

    return currentBreakroom && breakroomDataTrack ? (
        <ThemeProvider theme={inDepoTheme}>
            <StyledInDepoContainer data-testid="videoconference">
                <StyledInDepoLayout>
                    <RecordPill on={false} />
                    <VideoConference
                        isBreakroom
                        localParticipant={currentBreakroom.localParticipant}
                        timeZone={timeZone}
                        attendees={currentBreakroom.participants}
                        layoutSize={0}
                    />
                </StyledInDepoLayout>
                <StyledRoomFooter>
                    <BreakroomControlsBar
                        breakroomName={currentBreakroomData?.name || ""}
                        localParticipant={currentBreakroom.localParticipant}
                    />
                </StyledRoomFooter>
            </StyledInDepoContainer>
        </ThemeProvider>
    ) : null;
};

export default Breakroom;
