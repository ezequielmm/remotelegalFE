import React from "react";
import { ReactComponent as Record } from "../../assets/in-depo/Record.pill.svg";
import { StyledRecordPill, StyledIcon, StyledText } from "./styles";

export interface IRecordPillProps {
    on: boolean;
}

const RecordPill = ({ on = false }: IRecordPillProps) => {
    const pillText = `${on ? "on" : "off"} the record`;

    return (
        <StyledRecordPill $on={on}>
            <StyledIcon icon={Record} $on={on} />
            <StyledText>{pillText}</StyledText>
        </StyledRecordPill>
    );
};

export default RecordPill;
