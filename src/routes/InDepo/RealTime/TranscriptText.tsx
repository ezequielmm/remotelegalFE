import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Text from "../../../components/Typography/Text";
import { ITextProps } from "../../../components/Typography/Text/Text";

interface TranscriptTextProps extends ITextProps {
    scrollTo: boolean;
    highlighted: boolean;
    pointer: boolean;
    onClick: () => void;
}

const TranscriptionText = styled(Text)<Omit<TranscriptTextProps, "scrollTo">>`
    background-color: ${({ highlighted, theme }) => highlighted && theme.colors.warning[2]};
    cursor: ${({ pointer }) => pointer && "pointer"};
`;

const TranscriptText = ({ highlighted, scrollTo, ...rest }: TranscriptTextProps) => {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (elementRef?.current && scrollTo) {
            elementRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [scrollTo]);

    return <TranscriptionText highlighted={highlighted} ref={elementRef} {...rest} />;
};
export default TranscriptText;
