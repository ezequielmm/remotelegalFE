import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Space from "../../../components/Space";
import Text from "../../../components/Typography/Text";
import Alert from "../../../components/Alert";
import Icon from "../../../components/Icon";
import { ReactComponent as TimeIcon } from "../../../assets/icons/time.svg";
import { ReactComponent as InfoIcon } from "../../../assets/icons/information.svg";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { HiddenRef, RoughDraftPill, StyledRealTimeContainer } from "./styles";
import TranscriptionText from "./TranscriptText";
import * as CONSTANTS from "../../../constants/inDepo";
import ColorStatus from "../../../types/ColorStatus";
import { mapTimeZone, TimeZones } from "../../../models/general";
import { TranscriptionModel } from "../../../models";

dayjs.extend(utc);
dayjs.extend(timezone);

const RealTime = ({
    disableAutoscroll,
    manageTranscriptionClicked,
    visible,
    timeZone,
    transcriptions,
    playedSeconds,
    scrollToHighlighted,
    transcriptionsWithoutEvents,
}: ContainerProps & {
    disableAutoscroll?: boolean;
    manageTranscriptionClicked?: (transcription: TranscriptionModel.Transcription) => void;
    timeZone: TimeZones;
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    transcriptionsWithoutEvents?: TranscriptionModel.Transcription[];
    playedSeconds?: number;
    scrollToHighlighted?: boolean;
}) => {
    const scrollableRef = useRef(null);
    const [currentTranscript, setCurrentTranscript] = useState(null);

    useEffect(() => {
        const highlightTranscript = () => {
            const lastTranscription = transcriptionsWithoutEvents[transcriptionsWithoutEvents.length - 1];
            if (playedSeconds >= lastTranscription.transcriptionVideoTime) {
                return setCurrentTranscript(lastTranscription.id);
            }
            const currentTranscriptTranscription = transcriptionsWithoutEvents.find(
                (transcription, index) =>
                    playedSeconds <=
                    transcription.transcriptionVideoTime +
                        transcriptionsWithoutEvents[index + 1].transcriptionVideoTime -
                        transcription.transcriptionVideoTime
            );

            return setCurrentTranscript(currentTranscriptTranscription?.id);
        };

        if (transcriptionsWithoutEvents?.length && playedSeconds) {
            highlightTranscript();
        }
    }, [playedSeconds, transcriptionsWithoutEvents]);

    const transcriptionSlicingLength = transcriptions?.length > 20 ? transcriptions?.length - 20 : 0;

    const sortedTranscriptions = !scrollToHighlighted
        ? transcriptions
              ?.slice(transcriptionSlicingLength)
              .sort((a, b) => new Date(a.transcriptDateTime).getTime() - new Date(b.transcriptDateTime).getTime())
        : [];

    const transcriptionsWithoutDuplicates = !scrollToHighlighted
        ? [].concat(transcriptions.slice(0, transcriptionSlicingLength), sortedTranscriptions)
        : transcriptions;

    useEffect(() => {
        if (!scrollToHighlighted && transcriptionsWithoutDuplicates?.length) {
            setCurrentTranscript(transcriptionsWithoutDuplicates[transcriptionsWithoutDuplicates.length - 1]?.id);
        }
    }, [scrollToHighlighted, transcriptionsWithoutDuplicates]);

    return (
        <StyledLayoutCotainer noBackground={disableAutoscroll} visible={visible}>
            <StyledLayoutContent>
                <StyledRealTimeContainer>
                    <div>
                        <div ref={scrollableRef}>
                            {!disableAutoscroll && <RoughDraftPill>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftPill>}
                            <Space direction="vertical" size="middle">
                                {transcriptionsWithoutDuplicates?.map(
                                    (transcription, i) =>
                                        (transcription.from || transcription.text) &&
                                        (transcription.from ? (
                                            <Alert
                                                data-testid={
                                                    transcription.to
                                                        ? "transcription_paused"
                                                        : "transcription_currently_paused"
                                                }
                                                key={transcription.id}
                                                message={
                                                    transcription.to
                                                        ? CONSTANTS.getPauseText(
                                                              transcription.from,
                                                              transcription.to,
                                                              timeZone
                                                          )
                                                        : CONSTANTS.TRANSCRIPTIONS_PAUSED
                                                }
                                                type={transcription.to ? "info" : "warning"}
                                                icon={<Icon icon={transcription.to ? TimeIcon : InfoIcon} />}
                                            />
                                        ) : (
                                            <Space direction="vertical" key={transcription.id}>
                                                {playedSeconds !== undefined &&
                                                    (i === 0 || playedSeconds - transcription.prevEndTime >= 0) &&
                                                    playedSeconds - transcription.transcriptionVideoTime < 0 && (
                                                        <HiddenRef />
                                                    )}
                                                <Text
                                                    state={ColorStatus.disabled}
                                                    font="code"
                                                    size="small"
                                                    weight="bold"
                                                    block
                                                    dataTestId="transcription_title"
                                                >
                                                    <>
                                                        {`${transcription.userName || "Guest"} `}
                                                        {dayjs(transcription.transcriptDateTime)
                                                            .tz(mapTimeZone[timeZone])
                                                            ?.format("hh:mm:ss A")}
                                                    </>
                                                </Text>
                                                <TranscriptionText
                                                    font="code"
                                                    size="small"
                                                    block
                                                    ellipsis={false}
                                                    dataTestId="transcription_text"
                                                    scrollTo={currentTranscript === transcription.id}
                                                    highlighted={
                                                        scrollToHighlighted && currentTranscript === transcription.id
                                                    }
                                                    pointer={!!manageTranscriptionClicked}
                                                    onClick={() => {
                                                        if (manageTranscriptionClicked)
                                                            manageTranscriptionClicked(transcription);
                                                    }}
                                                >
                                                    {transcription.text}
                                                </TranscriptionText>
                                            </Space>
                                        ))
                                )}
                            </Space>
                        </div>
                    </div>
                </StyledRealTimeContainer>
            </StyledLayoutContent>
        </StyledLayoutCotainer>
    );
};

export default RealTime;
