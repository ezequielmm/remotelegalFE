import React from "react";
import Icon from "../../../components/Icon";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { StyledLayoutCotainer, StyledLayoutHeader, StyledLayoutContent, ContainerProps } from "../styles";
import { getREM } from "../../../constants/styles/utils";
import { theme } from "../../../constants/styles/theme";

const RealTime = ({ visible, onClick }: ContainerProps) => {
    return (
        <StyledLayoutCotainer visible={visible}>
            <StyledLayoutHeader>
                <Icon
                    icon={CloseIcon}
                    onClick={onClick}
                    style={{ fontSize: getREM(theme.default.fontSizes[5]), color: theme.default.whiteColor }}
                />
            </StyledLayoutHeader>
            <StyledLayoutContent />
        </StyledLayoutCotainer>
    );
};

export default RealTime;
