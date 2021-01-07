import React, { useContext, useEffect, useRef } from "react";
import { Space } from "antd";
import moment from "moment-timezone";
import Text from "../../../components/Typography/Text";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { RealTimeHeader, RoughDraftContainer, StyledRealTimeContainer } from "./styles";
import { TimeZones } from "../../../models/general";

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
                                    <Text state="primary" font="code" size="small" weight="bold" block uppercase>
                                        KOREMATSU V. UNITED STATES
                                    </Text>
                                    <Text state="disabled" font="code" size="small" block>
                                        Case No. 123-45214
                                    </Text>
                                </Space>
                            </RealTimeHeader>
                        </div>
                        <div>
                            <RoughDraftContainer>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftContainer>
                            <Space direction="vertical" size="middle">
                                {transcriptions.map((transcription) => (
                                    <Space direction="vertical" size="small" key={transcription.time}>
                                        <Text
                                            state="disabled"
                                            font="code"
                                            size="small"
                                            weight="bold"
                                            block
                                            dataTestId="transcription_title"
                                        >
                                            <>
                                                {transcription.participantName} |{" "}
                                                {moment(transcription.time).tz(timeZone).format("hh:mm:ss A")}
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
                                ))}
                            </Space>
                        </div>
                    </div>
                </StyledRealTimeContainer>
            </StyledLayoutContent>
        </StyledLayoutCotainer>
    );
};

export default RealTime;
