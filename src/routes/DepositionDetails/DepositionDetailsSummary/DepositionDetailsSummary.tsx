import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ThemeProvider } from "styled-components";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import Space from "../../../components/Space";
import useGetEvents from "../../../hooks/InDepo/useGetEvents";
import useGetTranscriptions from "../../../hooks/InDepo/useGetTranscriptions";
import { TimeZones } from "../../../models/general";
import { GlobalStateContext } from "../../../state/GlobalState";
import actions from "../../../state/PostDepo/PostDepoActions";
import { DepositionID } from "../../../state/types";
import RealTime from "../../InDepo/RealTime";
import { RoughDraftDetailDepoPill, DashedLine } from "../styles";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/depositionDetails";
import Spinner from "../../../components/Spinner";
import { ReactComponent as ParticipantsIcon } from "../../../assets/icons/participants.svg";
import { ReactComponent as CourtReporterIcon } from "../../../assets/icons/court-reporter.svg";
import { ReactComponent as ExhibitsIcon } from "../../../assets/in-depo/Exhibits.svg";
import useAsyncCallback from "../../../hooks/useAsyncCallback";
import { theme } from "../../../constants/styles/theme";
import { ThemeMode } from "../../../types/ThemeType";
import DepositionDetailsVideoSection from "./DepositionDetailsVideoSection";
import { useGetRecordingInfo } from "../../../hooks/useGetRecordingInfo";
import CardIcon from "../../../components/CardIcon";
import { useEnteredExhibit } from "../../../hooks/useEnteredExhibits";
import { StyledSummaryLayout, StyledCard, StyledRealTimeWrapper } from "./styles";
import { useFetchParticipants } from "../../../hooks/activeDepositionDetails/hooks";

interface IDepositionDetailsSummary {
    setActiveKey: (activeKey: string) => void;
}

export default function DepositionDetailsSummary({ setActiveKey }: IDepositionDetailsSummary) {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { dispatch, state } = useContext(GlobalStateContext);
    const [getTranscriptions, loading] = useGetTranscriptions(true);
    const [getDepositionEvents] = useGetEvents();
    const { depositionID } = useParams<DepositionID>();
    const { handleFetchFiles, enteredExhibits } = useEnteredExhibit();
    const [fetchParticipants, , , participants] = useFetchParticipants();
    const [courtReporterName, setCourtReporterName] = useState("");
    const { transcriptions, currentDeposition } = state.postDepo;

    const [setTranscriptions] = useAsyncCallback(async () => {
        const newTranscriptions = await getTranscriptions();
        const events = await getDepositionEvents(depositionID);
        dispatch(actions.setTranscriptions({ transcriptions: newTranscriptions || [], events: events || [] }));
    }, [depositionID, dispatch, getDepositionEvents, getTranscriptions]);

    useEffect(() => {
        let delay;
        if (setTranscriptions && dispatch) {
            delay = setTimeout(() => setTranscriptions(), 1);
        }
        return () => {
            if (delay) clearTimeout(delay);
            if (dispatch) dispatch(actions.setTranscriptions({ transcriptions: null }));
        };
    }, [setTranscriptions, dispatch]);

    const { getRecordingInfo, recordingInfo } = useGetRecordingInfo();
    useEffect(() => {
        getRecordingInfo();
    }, [getRecordingInfo]);

    useEffect(() => {
        const courtReporter = currentDeposition?.participants?.find(
            (participant) => participant.role === "CourtReporter"
        );
        if (courtReporter) {
            setCourtReporterName(courtReporter?.name);
        }
    }, [currentDeposition]);

    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);

    useEffect(() => {
        fetchParticipants(depositionID);
    }, [fetchParticipants, depositionID]);

    return (
        <>
            <StyledSummaryLayout>
                <CardIcon icon={CourtReporterIcon} fullWidth>
                    <Text state={ColorStatus.disabled}>{CONSTANTS.DEPOSITION_DETAILS_COURT_REPORTER_TITLE}</Text>
                    <Title level={5} weight="light" noMargin dataTestId="court_report_name">
                        {courtReporterName}
                    </Title>
                </CardIcon>
                <Space size="middle">
                    <CardIcon
                        icon={ParticipantsIcon}
                        fullWidth
                        onClick={() => setActiveKey(CONSTANTS.DEPOSITION_DETAILS_TABS.attendees)}
                    >
                        <Text state={ColorStatus.disabled}>{CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_TITLE}</Text>
                        <Title level={5} weight="light" noMargin dataTestId="invited_parties_count">
                            {participants?.length ?? 0}
                        </Title>
                    </CardIcon>
                    <CardIcon
                        icon={ExhibitsIcon}
                        fullWidth
                        onClick={() => setActiveKey(CONSTANTS.DEPOSITION_DETAILS_TABS.enteredExhibits)}
                    >
                        <Text state={ColorStatus.disabled}>{CONSTANTS.DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE}</Text>
                        <Title level={5} weight="light" noMargin dataTestId="entered_exhibits_count">
                            {enteredExhibits?.length?.toString() || 0}
                        </Title>
                    </CardIcon>
                </Space>
                <StyledCard hasShaddow={false} hasPadding={false} fullWidth>
                    <Space p={9} direction="vertical" size="large">
                        <Title level={5} noMargin weight="light">
                            {CONSTANTS.DETAILS_SUMMARY_VIDEO_TITLE}
                        </Title>
                    </Space>
                    <DepositionDetailsVideoSection recordingInfo={recordingInfo} />
                </StyledCard>
                <StyledCard hasShaddow={false} hasPadding={false} fullWidth>
                    <Space p={9} pb={3} direction="vertical">
                        <Space size="large" direction="vertical">
                            <Title level={5} noMargin weight="light">
                                {CONSTANTS.DETAILS_SUMMARY_TRANSCRIPT_TITLE}
                            </Title>
                            <Text state={ColorStatus.disabled} ellipsis={false}>
                                {CONSTANTS.DETAILS_SUMMARY_TRANSCRIPT_SUBTITLE}
                            </Text>
                        </Space>
                        <Space mt={6} fullWidth justify="space-between">
                            <DashedLine side="left" />
                            <RoughDraftDetailDepoPill>{CONSTANTS.REAL_TIME_PILL}</RoughDraftDetailDepoPill>
                            <DashedLine side="right" />
                        </Space>
                    </Space>
                    <StyledRealTimeWrapper>
                        {loading ? (
                            <Spinner height="100%" />
                        ) : (
                            transcriptions && (
                                <ThemeProvider theme={inDepoTheme}>
                                    <RealTime
                                        // manageTranscriptionClicked={
                                        //     duration > 0 &&
                                        //     ((transcription) => {
                                        //         dispatch(actions.setChangeTime(transcription.prevEndTime + 0.0001));
                                        //         dispatch(actions.setPlaying(true));
                                        //     })
                                        // }
                                        disableAutoscroll
                                        transcriptions={transcriptions}
                                        visible
                                        timeZone={TimeZones.EST}
                                        // playedSeconds={currentTime}
                                        scrollToHighlighted
                                    />
                                </ThemeProvider>
                            )
                        )}
                    </StyledRealTimeWrapper>
                </StyledCard>
            </StyledSummaryLayout>
        </>
    );
}
