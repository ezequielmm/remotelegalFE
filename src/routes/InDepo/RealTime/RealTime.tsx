import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
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
    const [clicked, setClicked] = useState(null);

    useEffect(() => {
        const highlightTranscript = () => {
            const lastTranscription = transcriptionsWithoutEvents[transcriptionsWithoutEvents.length - 1];
            if (playedSeconds >= lastTranscription.transcriptionVideoTime) {
                return setClicked(lastTranscription.id);
            }
            const clickedTranscription = transcriptionsWithoutEvents.find(
                (transcription, index) =>
                    playedSeconds <=
                    transcription.transcriptionVideoTime +
                        transcriptionsWithoutEvents[index + 1].transcriptionVideoTime -
                        transcription.transcriptionVideoTime
            );

            return setClicked(clickedTranscription?.id);
        };

        if (transcriptionsWithoutEvents && playedSeconds) {
            highlightTranscript();
        }
    }, [playedSeconds, transcriptionsWithoutEvents]);

    useEffect(() => {
        const innerRef = scrollableRef;
        const scrollToBottom = (event) => {
            const { currentTarget: target } = event;
            if (!scrollToHighlighted) target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        };
        if (scrollableRef?.current && !scrollToHighlighted) {
            innerRef.current.addEventListener("DOMNodeInserted", scrollToBottom);
        }
        return () => innerRef?.current?.removeEventListener("DOMNodeInserted", scrollToBottom);
    }, [scrollToHighlighted]);

    return (
        <StyledLayoutCotainer noBackground={disableAutoscroll} visible={visible}>
            <StyledLayoutContent>
                <StyledRealTimeContainer>
                    <div ref={scrollableRef}>
                        <div>
                            {!disableAutoscroll && <RoughDraftPill>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftPill>}
                            <Space direction="vertical" size="middle">
                                {transcriptions
                                    ?.sort(
                                        (a, b) =>
                                            new Date(a.transcriptDateTime).getTime() -
                                            new Date(b.transcriptDateTime).getTime()
                                    )
                                    .map(
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
                                                            {moment(transcription.transcriptDateTime)
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
                                                        highlighted={clicked === transcription.id}
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
