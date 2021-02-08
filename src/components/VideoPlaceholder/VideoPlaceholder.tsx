import React from "react";
import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import Result, { IResultProps } from "../Result/Result";

interface IVideoPlaceholderProps extends IResultProps {
    padding?: string;
}

interface IStyledVideoPlaceholderProps extends IResultProps {
    $padding?: string;
}

const StyledVideoPlaceholder = styled(Result)<IStyledVideoPlaceholderProps>`
    background-color: ${theme.default.disabledBg};
    ${({ $padding }) => ($padding ? `padding: ${$padding};` : ``)}
    .ant-result-icon {
        margin-bottom: ${getREM(theme.default.spaces[6])};
        & > .anticon {
            font-size: ${getREM(3.5)};
        }
    }
`;

const VideoPlaceholder = ({ padding, ...rest }: IVideoPlaceholderProps) => {
    return <StyledVideoPlaceholder $padding={padding} {...rest} />;
};

export default VideoPlaceholder;
