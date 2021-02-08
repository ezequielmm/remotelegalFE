import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Card as ANTDCard } from "antd";
import { CardProps } from "antd/lib/card";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";
import ColorStatus, { isColorStatusType } from "../../types/ColorStatus";

export interface ICardProps extends CardProps {
    bg?: ColorStatus | string;
    hasPadding?: boolean;
    hasShaddow?: boolean;
    fullWidth?: boolean;
    hasBorder?: boolean;
}

export const StyledCard = styled(ANTDCard)<ICardProps>`
    ${({ theme, hasPadding, hasShaddow, fullWidth, bg }) => {
        const { spaces, fontSizes, headerFontFamilies } = theme.default;

        const styles = `
            &.ant-card {
                width: ${fullWidth ? "100%" : "unset"};
                padding: ${hasPadding ? getREM(spaces[12]) : 0};
                box-shadow: ${
                    hasShaddow ? `0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 rgba(0, 0, 0, 0.08)` : "unset"
                };
                background: ${isColorStatusType(bg) ? theme.default[`${bg}Color`] : bg};
  
                .ant-card-head {
                    font-family: ${headerFontFamilies};
                    padding: 0;
                    margin: 0 0 ${getREM(spaces[6])};
                    border: 0;
                    min-height: auto;

                    .ant-card-head-title {
                        padding: 0;
                        font-size: ${getREM(fontSizes[4])};
                    }
                }
                
                .ant-card-body {
                    padding: 0;
                }
            }
        `;
        return styles;
    }}
`;

const Card = ({
    hasBorder = false,
    hasPadding = true,
    hasShaddow = true,
    bg,
    fullWidth = false,
    ...props
}: ICardProps) => {
    const themeContext = useContext(ThemeContext);
    const defaultBg = bg || (themeContext.mode === ThemeMode.inDepo ? ColorStatus.inDepo : ColorStatus.white);

    return (
        <StyledCard
            bordered={hasBorder}
            hasPadding={hasPadding}
            hasShaddow={hasShaddow}
            fullWidth={fullWidth}
            bg={defaultBg}
            {...props}
        />
    );
};

export default Card;
