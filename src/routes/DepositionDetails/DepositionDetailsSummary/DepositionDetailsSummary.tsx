import React, { useContext, useEffect } from "react";
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
import { RealTimeContainer, RoughDraftDetailDepoPill, DashedLine } from "../styles";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/depositionDetails";
import Spinner from "../../../components/Spinner";
import VideoPlaceholder from "../../../components/VideoPlaceholder";
import { ReactComponent as VideoAlertIcon } from "../../../assets/icons/Video-alert.svg";
import Icon from "../../../components/Icon";
import useAsyncCallback from "../../../hooks/useAsyncCallback";
import { theme } from "../../../constants/styles/theme";
import { ThemeMode } from "../../../types/ThemeType";

export default function DepositionDetailsSummary() {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { dispatch, state } = useContext(GlobalStateContext);
    const [getTranscriptions, loading] = useGetTranscriptions();
    const [getDepositionEvents] = useGetEvents();
    const { depositionID } = useParams<DepositionID>();
    const { transcriptions } = state.postDepo;

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

    return (
        <Space fullWidth align="stretch" size={6}>
            <Space align="stretch" flex="1 0 48%">
                <Card hasShaddow={false} hasPadding={false} fullWidth style={{ overflow: "hidden" }}>
                    <Space p={8} direction="vertical" size="large">
                        <Title level={5} noMargin weight="light">
                            {CONSTANTS.DETAILS_SUMMARY_VIDEO_TITLE}
                        </Title>
                        <Space py={12} />
                    </Space>
                    <VideoPlaceholder
                        padding="126px 0"
                        icon={<Icon icon={VideoAlertIcon} />}
                        title={CONSTANTS.VIDEO_PLACEHOLDER_TITLE}
                        subTitle={CONSTANTS.VIDEO_PLACEHOLDER_SUBTITLE}
                    />
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
                    {loading ? (
                        <Spinner />
                    ) : (
                        transcriptions && (
                            <RealTimeContainer>
                                <ThemeProvider theme={inDepoTheme}>
                                    <RealTime
                                        disableAutoscroll
                                        transcriptions={transcriptions}
                                        visible
                                        timeZone={TimeZones.EST}
                                    />
                                </ThemeProvider>
                            </RealTimeContainer>
                        )
                    )}
                </Card>
            </Space>
        </Space>
    );
}
