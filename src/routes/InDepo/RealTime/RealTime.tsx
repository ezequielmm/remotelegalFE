import React, { useEffect, useRef } from "react";
import moment from "moment-timezone";
import Space from "../../../components/Space";
import Text from "../../../components/Typography/Text";
import Alert from "../../../components/Alert";
import Icon from "../../../components/Icon";
import { ReactComponent as TimeIcon } from "../../../assets/icons/time.svg";
import { ReactComponent as InfoIcon } from "../../../assets/icons/information.svg";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { HiddenRef, RoughDraftPill, StyledRealTimeContainer, TranscriptionText } from "./styles";
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
}: ContainerProps & {
    disableAutoscroll?: boolean;
    manageTranscriptionClicked?: (transcription: TranscriptionModel.Transcription) => void;
    timeZone: TimeZones;
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    playedSeconds?: number;
    scrollToHighlighted?: boolean;
}) => {
    const scrollableRef = useRef(null);

    useEffect(() => {
        if (scrollableRef && scrollableRef.current) {
            scrollableRef.current.addEventListener("DOMNodeInserted", (event) => {
                const { relatedNode, currentTarget: target } = event;
                if (
                    scrollToHighlighted &&
                    2 * relatedNode.offsetHeight + relatedNode.offsetTop - target.offsetTop >=
                        target.scrollTop + target.offsetHeight
                )
                    return event.relatedNode.scrollIntoView({ behavior: "smooth" });
                if (!scrollToHighlighted) target.scroll({ top: target.scrollHeight, behavior: "smooth" });
            });
        }
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
                                                        highlighted={
                                                            playedSeconds !== undefined &&
                                                            (i === 0 ||
                                                                playedSeconds - transcription.prevEndTime >= 0) &&
                                                            playedSeconds - transcription.transcriptionVideoTime < 0
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
