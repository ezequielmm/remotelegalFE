import React, { useContext, useEffect, useRef } from "react";
import { Space } from "antd";
import Text from "../../../components/Typography/Text";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { RealTimeHeader, RoughDraftContainer, StyledRealTimeContainer, TranscriptionsContainer } from "./styles";
import { TimeZones } from "../../../models/general";
import ColorStatus from "../../../types/ColorStatus";
import Alert from "../../../components/Alert";
import * as CONSTANTS from "../../../constants/inDepo";

const RealTime = ({
    visible,
    timeZone,
}: ContainerProps & {
    timeZone: TimeZones;
}) => {
    const { state } = useContext(GlobalStateContext);
    const scrollableRef = useRef(null);
    const { transcriptions } = state.room;

    useEffect(() => {
        if (scrollableRef && scrollableRef.current) {
            scrollableRef.current.addEventListener("DOMNodeInserted", (event) => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: "smooth" });
            });
        }
    }, []);

    return (
        <StyledLayoutCotainer visible={visible}>
            <StyledLayoutContent>
                <StyledRealTimeContainer>
                    <div ref={scrollableRef}>
                        <div>
                            <RealTimeHeader>
                                <Space direction="vertical" size="small">
                                    <Text
                                        state={ColorStatus.primary}
                                        font="code"
                                        size="small"
                                        weight="bold"
                                        block
                                        uppercase
                                    >
                                        KOREMATSU V. UNITED STATES
                                    </Text>
                                    <Text state={ColorStatus.disabled} font="code" size="small" block>
                                        Case No. 123-45214
                                    </Text>
                                </Space>
                            </RealTimeHeader>
                        </div>
                        <div>
                            <RoughDraftContainer>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftContainer>
                            <TranscriptionsContainer direction="vertical" size="middle">
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
                                            />
                                        ) : (
                                            <Space
                                                direction="vertical"
                                                size="small"
                                                key={
                                                    transcription.from
                                                        ? transcription.from + transcription.to
                                                        : transcription.transcriptDateTime + transcription.userName
                                                }
                                            >
                                                <Text
                                                    state={ColorStatus.disabled}
                                                    font="code"
                                                    size="small"
                                                    weight="bold"
                                                    block
                                                    dataTestId="transcription_title"
                                                >
                                                    {`${transcription.userName || "Guest"} `}
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
                            </TranscriptionsContainer>
                        </div>
                    </div>
                </StyledRealTimeContainer>
            </StyledLayoutContent>
        </StyledLayoutCotainer>
    );
};

export default RealTime;
