import React from "react";
import Icon from "../../../../../components/Icon";
import Text from "../../../../../components/Typography/Text";
import { ITextProps } from "../../../../../components/Typography/Text/Text";
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
