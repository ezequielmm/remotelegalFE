import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "prp-components-library/src/components/Button";
import CardIcon from "prp-components-library/src/components/CardIcon";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Spinner from "prp-components-library/src/components/Spinner";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import { ThemeProvider } from "styled-components";
import useGetEvents from "../../../hooks/InDepo/useGetEvents";
import useGetTranscriptions from "../../../hooks/InDepo/useGetTranscriptions";
import { GlobalStateContext } from "../../../state/GlobalState";
import actions from "../../../state/PostDepo/PostDepoActions";
import { DepositionID } from "../../../state/types";
import RealTime from "../../InDepo/RealTime";
import { RoughDraftDetailDepoPill, DashedLine } from "../styles";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/depositionDetails";
import { ReactComponent as ParticipantsIcon } from "../../../assets/icons/participants.svg";
import { ReactComponent as CourtReporterIcon } from "../../../assets/icons/court-reporter.svg";
import { ReactComponent as ExhibitsIcon } from "../../../assets/in-depo/Exhibits.svg";
import useAsyncCallback from "../../../hooks/useAsyncCallback";
import { theme } from "../../../constants/styles/theme";
import { ThemeMode } from "../../../types/ThemeType";
import DepositionDetailsVideoSection from "./DepositionDetailsVideoSection";
import { useGetRecordingInfo } from "../../../hooks/useGetRecordingInfo";
import { useEnteredExhibit } from "../../../hooks/useEnteredExhibits";
import { ReactComponent as DownloadIcon } from "../../../assets/icons/download.svg";
import downloadFile from "../../../helpers/downloadFile";
import { useTranscriptFileList, useGetSignedUrl } from "../../../hooks/transcripts/hooks";
import { StyledSummaryLayout, StyledCard, StyledRealTimeWrapper } from "./styles";
import { useFetchParticipants } from "../../../hooks/activeDepositionDetails/hooks";
import { IDeposition } from "../../../models/deposition";

interface IDepositionDetailsSummary {
    setActiveKey: (activeKey: string) => void;
    deposition: IDeposition;
}
export default function DepositionDetailsSummary({ setActiveKey, deposition }: IDepositionDetailsSummary) {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { dispatch, state } = useContext(GlobalStateContext);
    const [getTranscriptions, loading] = useGetTranscriptions(true);
    const { getRecordingInfo, recordingInfo } = useGetRecordingInfo();
    const [getDepositionEvents] = useGetEvents();
    const { depositionID } = useParams<DepositionID>();
    const { handleFetchFiles: handleFetchExhibitsFiles, enteredExhibits } = useEnteredExhibit();
    const [courtReporterName, setCourtReporterName] = useState("");
    const [downloadRecordingDisabled, setDownloadRecordingDisabled] = useState<boolean>(true);
    const [downloadTranscripDisabled, setDownloadTranscripDisabled] = useState<boolean>(true);
    const { handleFetchFiles: handleFetchTranscriptFileList, transcriptFileList } = useTranscriptFileList(depositionID);
    const { getSignedUrl, documentData: transcriptFileData } = useGetSignedUrl();
    const [fetchParticipants, , , participants] = useFetchParticipants();
    const { duration, currentTime, transcriptions, currentDeposition, transcriptionsWithoutEvents } = state.postDepo;

    const [setTranscriptions] = useAsyncCallback(async () => {
        const newTranscriptions = await getTranscriptions();
        const events = await getDepositionEvents(depositionID);
        dispatch(actions.setTranscriptions({ transcriptions: newTranscriptions || [], events: events || [] }));
    }, [depositionID, dispatch, getDepositionEvents, getTranscriptions]);

    useEffect(() => {
        handleFetchTranscriptFileList();
    }, [handleFetchTranscriptFileList]);

    useEffect(() => {
        if (transcriptFileList) {
            const transcriptFileDetails = transcriptFileList.find(
                (transcriptFile) => transcriptFile.documentType === CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPT_ROUGH_TYPE
            );

            if (transcriptFileDetails) {
                getSignedUrl(transcriptFileDetails.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcriptFileList]);

    useEffect(() => {
        if (transcriptFileData) setDownloadTranscripDisabled(false);
    }, [transcriptFileData]);

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
        handleFetchExhibitsFiles();
    }, [handleFetchExhibitsFiles]);

    useEffect(() => {
        if (recordingInfo && recordingInfo.publicUrl) setDownloadRecordingDisabled(false);
    }, [recordingInfo]);

    const handleDownloadRecording = () => {
        if (recordingInfo?.publicUrl) {
            downloadFile(recordingInfo.publicUrl);
        }
    };

    const handleDownloadTranscript = async () => {
        if (transcriptFileData?.url) {
            downloadFile(transcriptFileData.url);
        }
    };

    useEffect(() => {
        fetchParticipants(depositionID);
    }, [fetchParticipants, depositionID]);

    const manageTranscriptionClicked = (transcription) => {
        dispatch(
            actions.setChangeTime(
                // This to ensure the playtime is just a tiny bit after so that the highlight works
                transcription.transcriptionVideoTime + 0.02
            )
        );
        dispatch(actions.setPlaying(true));
    };

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
                <StyledCard
                    hasShaddow={false}
                    hasPadding={false}
                    fullWidth
                    extra={
                        <Button
                            type="link"
                            icon={<Icon icon={DownloadIcon} size={9} />}
                            onClick={handleDownloadRecording}
                            disabled={downloadRecordingDisabled}
                        >
                            {CONSTANTS.DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_RECORDING_TITLE}
                        </Button>
                    }
                >
                    <Space p={9} direction="horizontal" size="large">
                        <Title level={5} noMargin weight="light">
                            {CONSTANTS.DETAILS_SUMMARY_VIDEO_TITLE}
                        </Title>
                    </Space>
                    <DepositionDetailsVideoSection recordingInfo={recordingInfo} />
                </StyledCard>
                <StyledCard
                    hasShaddow={false}
                    hasPadding={false}
                    fullWidth
                    extra={
                        <Button
                            type="link"
                            icon={<Icon icon={DownloadIcon} size={9} />}
                            onClick={handleDownloadTranscript}
                            disabled={downloadTranscripDisabled}
                        >
                            {CONSTANTS.DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_ROUGH_DRAFT_TITLE}
                        </Button>
                    }
                >
                    <Space p={9} direction="vertical">
                        <Space size="large" direction="vertical">
                            <Space.Item>
                                <Title level={5} noMargin weight="light">
                                    {CONSTANTS.DETAILS_SUMMARY_TRANSCRIPT_TITLE}
                                </Title>
                            </Space.Item>
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
                                        transcriptionsWithoutEvents={transcriptionsWithoutEvents}
                                        manageTranscriptionClicked={duration > 0 && manageTranscriptionClicked}
                                        disableAutoscroll
                                        transcriptions={transcriptions}
                                        timeZone={deposition?.timeZone}
                                        playedTimeValue={currentTime * 1000}
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
