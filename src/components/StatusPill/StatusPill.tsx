import React from "react";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
import { ReactComponent as Completed } from "../../assets/icons/Success.svg";
import { ReactComponent as Pending } from "../../assets/icons/Pending.svg";
import { ReactComponent as Canceled } from "../../assets/icons/Error.svg";
import Icon from "../Icon";

export interface IStatusPillProps {
    status: "Completed" | "Pending" | "Canceled";
}

const StyledPill = styled.span`
    display: inline-flex;
    align-items: center;
    line-height: ${getREM(theme.default.spaces[9] + theme.default.spaces[1])};
    padding: 0 ${getREM(theme.default.spaces[3])};
    border-radius: ${getREM(theme.default.borderRadiusBase)};
    font-size: ${getREM(theme.default.fontSizes[8])};

    &.Completed {
        background-color: ${hexToRGBA(theme.colors.success[5], 0.1)};
        color: ${theme.colors.success[5]};
    }
    &.Pending {
        background-color: ${hexToRGBA(theme.colors.warning[5], 0.1)};
        color: ${theme.colors.warning[5]};
    }
    &.Canceled {
        background-color: ${hexToRGBA(theme.colors.error[5], 0.1)};
        color: ${theme.colors.error[5]};
    }

    .anticon {
        margin-right: ${getREM(theme.default.spaces[2])};
        font-size: ${getREM(theme.default.fontSizes[6])};
        color: inherit;
    }
`;

const StatusPill = ({ status, ...rest }: IStatusPillProps) => {
    return (
        <StyledPill {...rest} className={status}>
            {
                {
                    Completed: <Icon icon={Completed} />,
                    Pending: <Icon icon={Pending} />,
                    Canceled: <Icon icon={Canceled} />,
                }[status]
            }
            {status}
        </StyledPill>
    );
};

export default StatusPill;
