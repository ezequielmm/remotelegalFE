import React from "react";
import { ReactComponent as Record } from "../../assets/in-depo/Record.pill.svg";
import { StyledRecordPill, StyledIcon } from "./styles";

export interface IRecordPillProps {
    on: boolean;
}

const RecordPill = ({ on = false }: IRecordPillProps) => {
    return (
        <StyledRecordPill $on={on}>
            <StyledIcon icon={Record} $on={on} />
            {on ? "on" : "off"} the record
        </StyledRecordPill>
    );
};

export default RecordPill;
