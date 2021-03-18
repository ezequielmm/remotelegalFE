import React from "react";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { ReactComponent as Confirmed } from "../../assets/icons/Success.svg";
import { ReactComponent as Pending } from "../../assets/icons/Pending.svg";
import { ReactComponent as Canceled } from "../../assets/icons/Error.svg";
import { ReactComponent as Completed } from "../../assets/icons/Checkmark.svg";
import Icon from "../Icon";
import { ThemeMode } from "../../types/ThemeType";
import Tag, { ITagProps } from "../Tag/Tag";
import ColorStatus from "../../types/ColorStatus";

export enum Status {
    pending = "Pending",
    completed = "Completed",
    canceled = "Canceled",
    confirmed = "Confirmed",
}

const IconStatus = {
    Pending,
    Completed,
    Canceled,
    Confirmed,
};

const PillColorStatus = {
    Pending: "warning",
    Completed: "success",
    Canceled: "error",
    Confirmed: "info",
};

export interface IStatusPillProps extends Omit<ITagProps, "pill" | "color"> {
    status: Status;
}

const StyledPill = styled(Tag)`
    ${({ theme, color }) => {
        const inDepoStyles = `
            color: ${theme.colors.neutrals[6]};
            `;
        const defaultStyles = `
            color: ${theme.default[`${color}Color`]};
            background-color: ${hexToRGBA(theme.default[`${color}Color`], 0.1)};
            `;

        const styles = `
            line-height: 1.625rem;
            padding: 0 ${getREM(theme.default.spaces[3])};
            font-weight: normal;
            display: flex;
            align-items: center;
            width: 6rem;
            .anticon {
                & + span{
                    margin-left: ${getREM(theme.default.spaces[2])};
                }
            }
            
            ${theme.mode === ThemeMode.inDepo ? inDepoStyles : defaultStyles};
        `;
        return styles;
    }}
`;

const StatusPill = ({ status, ...rest }: IStatusPillProps) => {
    return (
        <StyledPill
            color={ColorStatus[PillColorStatus[status]]}
            icon={<Icon icon={IconStatus[status]} size={6} />}
            pill
            {...rest}
        >
            {status}
        </StyledPill>
    );
};

export default StatusPill;
