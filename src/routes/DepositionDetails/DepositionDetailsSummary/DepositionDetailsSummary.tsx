import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ThemeProvider } from "styled-components";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import Space from "../../../components/Space";
import Card from "../../../components/Card";
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
import { IPostDepo } from "../../../state/PostDepo/PostDepoReducer";
import { useEnteredExhibit } from "../../../hooks/useEnteredExhibits";

interface IDepositionDetailsSummary {
    setActiveKey: (activeKey: string) => void;
}

export default function DepositionDetailsSummary({ setActiveKey }: IDepositionDetailsSummary) {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { dispatch, state } = useContext(GlobalStateContext);
    const [getTranscriptions, loading] = useGetTranscriptions();
    const [getDepositionEvents] = useGetEvents();
    const { depositionID } = useParams<DepositionID>();
    const { transcriptions, currentDeposition }: IPostDepo = state.postDepo;
    const { handleFetchFiles, enteredExhibits } = useEnteredExhibit();
    const [courtReporterName, setCourtReporterName] = useState("");

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

    return (
        <>
            <Space fullWidth size="middle" direction="vertical">
                <Space fullWidth align="stretch" size={6}>
                    <Space align="stretch" flex="1 0 48%">
                        <CardIcon icon={CourtReporterIcon} fullWidth>
                            <Text state={ColorStatus.disabled} ellipsis={false}>
                                {CONSTANTS.DEPOSITION_DETAILS_COURT_REPORTER_TITLE}
                            </Text>
                            <Title level={5} weight="light" dataTestId="court_report_name">
                                {courtReporterName}
                            </Title>
                        </CardIcon>
                    </Space>
                    <Space align="stretch" flex="1 0 48%">
                        <Space align="stretch" fullWidth size={6}>
                            <CardIcon
                                icon={ParticipantsIcon}
                                fullWidth
                                onClick={() => setActiveKey(CONSTANTS.DEPOSITION_DETAILS_TABS.attendees)}
                            >
                                <Text state={ColorStatus.disabled} ellipsis={false}>
                                    {CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_TITLE}
                                </Text>
                                <Title level={5} weight="light" dataTestId="invited_parties_count">
                                    {currentDeposition?.participants?.length.toString()}
                                </Title>
                            </CardIcon>
                        </Space>
                        <Space align="stretch" fullWidth size={6}>
                            <CardIcon
                                icon={ExhibitsIcon}
                                fullWidth
                                onClick={() => setActiveKey(CONSTANTS.DEPOSITION_DETAILS_TABS.enteredExhibits)}
                            >
                                <Text state={ColorStatus.disabled} ellipsis={false}>
                                    {CONSTANTS.DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE}
                                </Text>
                                <Title level={5} weight="light" dataTestId="entered_exhibits_count">
                                    {enteredExhibits?.length?.toString() || 0}
                                </Title>
                            </CardIcon>
                        </Space>
                    </Space>
                </Space>
                <Space fullWidth align="stretch" size={6}>
                    <Space align="stretch" flex="1 0 48%">
                        <Card hasShaddow={false} hasPadding={false} fullWidth style={{ overflow: "hidden" }}>
                            <Space p={8} direction="vertical" size="large">
                                <Title level={5} noMargin weight="light">
                                    {CONSTANTS.DETAILS_SUMMARY_VIDEO_TITLE}
                                </Title>
                            </Space>
                            <DepositionDetailsVideoSection recordingInfo={recordingInfo} />
                        </Card>
                    </Space>
                    <Space align="stretch" flex="1 0 48%">
                        <Card hasShaddow={false} hasPadding={false} fullWidth>
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
                            <Space>
                                {loading ? (
                                    <Spinner height="100%" />
                                ) : (
                                    transcriptions && (
                                        <ThemeProvider theme={inDepoTheme}>
                                            <RealTime
                                                disableAutoscroll
                                                transcriptions={transcriptions}
                                                visible
                                                timeZone={TimeZones.EST}
                                            />
                                        </ThemeProvider>
                                    )
                                )}
                            </Space>
                        </Card>
                    </Space>
                </Space>
            </Space>
        </>
    );
}
