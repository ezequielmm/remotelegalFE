import React, { useEffect, useRef } from "react";
import moment from "moment-timezone";
import Space from "../../../components/Space";
import Text from "../../../components/Typography/Text";
import Alert from "../../../components/Alert";
import Icon from "../../../components/Icon";
import { ReactComponent as TimeIcon } from "../../../assets/icons/time.svg";
import { ReactComponent as InfoIcon } from "../../../assets/icons/information.svg";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { RoughDraftPill, StyledRealTimeContainer } from "./styles";
import * as CONSTANTS from "../../../constants/inDepo";
import ColorStatus from "../../../types/ColorStatus";
import { TimeZones } from "../../../models/general";
import { TranscriptionModel } from "../../../models";

const RealTime = ({
    disableAutoscroll,
    visible,
    timeZone,
    transcriptions,
}: ContainerProps & {
    disableAutoscroll?: boolean;
    timeZone: TimeZones;
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
}) => {
    const scrollableRef = useRef(null);

    useEffect(() => {
        if (scrollableRef && scrollableRef.current) {
            scrollableRef.current.addEventListener("DOMNodeInserted", (event) => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: "smooth" });
            });
        }
    }, []);

    return (
        <StyledLayoutCotainer noBackground={disableAutoscroll} visible={visible}>
            <StyledLayoutContent>
                <StyledRealTimeContainer>
                    <div ref={scrollableRef}>
                        <div>
                            {!disableAutoscroll && <RoughDraftPill>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftPill>}
                            <Space direction="vertical" size="middle">
                                {transcriptions.map(
                                    (transcription) =>
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
                                                            .tz(timeZone)
                                                            .format("hh:mm:ss A")}
                                                    </>
                                                </Text>
                                                <Text
                                                    font="code"
                                                    size="small"
                                                    block
                                                    ellipsis={false}
                                                    dataTestId="transcription_text"
                                                >
                                                    {transcription.text}
                                                </Text>
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
