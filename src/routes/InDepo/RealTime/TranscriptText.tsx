import styled from "styled-components";
import Text from "@rl/prp-components-library/src/components/Text";
import { ITextProps } from "@rl/prp-components-library/src/components/Text/Text";

interface TranscriptTextProps extends ITextProps {
    highlighted: boolean;
    pointer: boolean;
    onClick: () => void;
}

const TranscriptionText = styled(Text)<Omit<TranscriptTextProps, "scrollTo">>`
    background-color: ${({ highlighted, theme }) => highlighted && theme.colors.warning[2]};
    cursor: ${({ pointer }) => pointer && "pointer"};
`;

const TranscriptText = ({ highlighted, ...rest }: TranscriptTextProps) => {
    return <TranscriptionText highlighted={highlighted} {...rest} />;
};
export default TranscriptText;
