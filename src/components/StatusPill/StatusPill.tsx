import React from "react";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { ReactComponent as Confirmed } from "../../assets/icons/Success.svg";
import { ReactComponent as Pending } from "../../assets/icons/Pending.svg";
import { ReactComponent as Canceled } from "../../assets/icons/Error.svg";
import { ReactComponent as Completed } from "../../assets/icons/Checkmark.svg";
import Icon from "../Icon";
import { ThemeMode } from "../../types/ThemeType";

export enum Status {
    pending = "Pending",
    completed = "Completed",
    canceled = "Canceled",
    confirmed = "Confirmed",
}

export interface IStatusPillProps {
    status: Status;
}

const StyledPill = styled.span`
    ${({ theme }) => {
        const inDepoStyles = `
            color: ${theme.colors.neutrals[6]};
            &.Completed {
                background-color: ${theme.colors.success[5]};
            }
            &.Confirmed {
                background-color: ${theme.colors.inDepoNeutrals[9]};
            }
            &.Pending {
                background-color: ${theme.colors.warning[5]};
            }
            &.Canceled {
                background-color: ${theme.colors.error[5]};
            }`;
        const defaultStyles = `
            &.Completed {
                background-color: ${hexToRGBA(theme.colors.success[5], 0.1)};
                color: ${theme.colors.success[5]};
            }
            &.Confirmed {
                background-color: ${hexToRGBA(theme.colors.inDepoNeutrals[9], 0.1)};
                color: ${theme.colors.inDepoNeutrals[9]};
            }
            &.Pending {
                background-color: ${hexToRGBA(theme.colors.warning[5], 0.1)};
                color: ${theme.colors.warning[5]};
            }
            &.Canceled {
                background-color: ${hexToRGBA(theme.colors.error[5], 0.1)};
                color: ${theme.colors.error[5]};
            }`;

        const styles = `
            display: flex;
            align-items: center;
            line-height: 1.625rem;
            padding: 0 ${getREM(theme.default.spaces[3])};
            border-radius: ${getREM(theme.default.borderRadiusBase)};
            font-size: ${getREM(theme.default.fontSizes[8])};
            width: 6rem;

            .anticon {
                margin-right: ${getREM(theme.default.spaces[2])};
                font-size: ${getREM(theme.default.fontSizes[6])};
                color: inherit;
            }
            
            ${theme.mode === ThemeMode.inDepo ? inDepoStyles : defaultStyles};
        `;

        return styles;
    }}
`;

const StatusPill = ({ status, ...rest }: IStatusPillProps) => {
    return (
        <StyledPill {...rest} className={status}>
            {
                {
                    Completed: <Icon icon={Completed} />,
                    Confirmed: <Icon icon={Confirmed} />,
                    Pending: <Icon icon={Pending} />,
                    Canceled: <Icon icon={Canceled} />,
                }[status]
            }
            {status}
        </StyledPill>
    );
};

export default StatusPill;
