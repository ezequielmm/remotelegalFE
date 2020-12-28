import React, { useContext, useEffect, useRef } from "react";
import moment from "moment";
import { Space } from "antd";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import Icon from "../../../components/Icon";
import Text from "../../../components/Typography/Text";
import { theme } from "../../../constants/styles/theme";
import { GlobalStateContext } from "../../../state/GlobalState";
import { StyledLayoutCotainer, StyledLayoutHeader, StyledLayoutContent, ContainerProps } from "../styles";
import { RoughDraftContainer, StyledRealTimeContainer, RealTimeHeader } from "./styles";

const RealTime = ({ visible, onClick }: ContainerProps) => {
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
            <StyledLayoutHeader>
                <Icon icon={CloseIcon} onClick={onClick} style={{ color: theme.default.whiteColor }} />
            </StyledLayoutHeader>
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
                                        <Text state="disabled" font="code" size="small" weight="bold" block>
                                            <>
                                                {transcription.participantName} |{" "}
                                                {moment(transcription.time).format("HH:mm:ss A")}
                                            </>
                                        </Text>
                                        <Text font="code" size="small" block ellipsis={false}>
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
