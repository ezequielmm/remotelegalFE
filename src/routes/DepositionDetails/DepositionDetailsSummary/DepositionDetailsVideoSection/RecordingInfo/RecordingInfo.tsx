import React from "react";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Text from "@rl/prp-components-library/src/components/Text";
import { ITextProps } from "@rl/prp-components-library/src/components/Text/Text";
import ColorStatus from "../../../../../types/ColorStatus";
import { RecordingInfoContainer, RecordingInfoTextsContainer } from "./styles";

interface IRecordingInfo extends Pick<ITextProps, "dataTestId"> {
    title?: string;
    value?: string;
    icon?: any;
}

export default function RecordingInfo({ title, value, icon, dataTestId = "" }: IRecordingInfo) {
    return (
        <RecordingInfoContainer data-testid={dataTestId}>
            <Icon icon={icon} size={8} />
            <RecordingInfoTextsContainer>
                <Text uppercase state={ColorStatus.disabled} size="small" dataTestId={`${dataTestId}_title`}>
                    {title}
                </Text>
                <Text dataTestId={`${dataTestId}_value`}>{value}</Text>
            </RecordingInfoTextsContainer>
        </RecordingInfoContainer>
    );
}
