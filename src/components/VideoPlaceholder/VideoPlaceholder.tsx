import styled from "styled-components";
import Result, { IResultProps } from "prp-components-library/src/components/Result/Result";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";

const StyledVideoPlaceholder = styled(Result)<IResultProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${theme.default.disabledBg};
    padding: ${getREM(theme.default.spaces[6] * 8)} 0;
    .ant-result-icon {
        margin-bottom: ${getREM(theme.default.spaces[6])};
        & > .anticon {
            font-size: ${getREM(3.5)};
        }
    }
`;

const VideoPlaceholder = ({ ...rest }: IResultProps) => {
    return <StyledVideoPlaceholder {...rest} />;
};

export default VideoPlaceholder;
