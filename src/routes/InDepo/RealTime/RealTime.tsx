import React, { useContext, useEffect, useRef } from "react";
import moment from "moment-timezone";
import Space from "../../../components/Space";
import Text from "../../../components/Typography/Text";
import Alert from "../../../components/Alert";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { RoughDraftPill, StyledRealTimeContainer } from "./styles";
import * as CONSTANTS from "../../../constants/inDepo";
import ColorStatus from "../../../types/ColorStatus";
import { TimeZones } from "../../../models/general";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";

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
                        <Space
                            direction="vertical"
                            justify="center"
                            align="center"
                            py={`${getREM(theme.default.spaces[6] * 6)}`}
                        >
                            <Text state={ColorStatus.primary} font="code" size="small" weight="bold" block uppercase>
                                KOREMATSU V. UNITED STATES
                            </Text>
                            <Text state={ColorStatus.disabled} font="code" size="small" block>
                                Case No. 123-45214
                            </Text>
                        </Space>
                        <div>
                            <RoughDraftPill>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftPill>
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
                                                key={transcription.from + transcription.to}
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
