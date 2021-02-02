import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Card as ANTDCard } from "antd";
import { CardProps } from "antd/lib/card";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";
import ColorStatus from "../../types/ColorStatus";

export interface ICardProps extends CardProps {
    bg?: ColorStatus | string;
    noPadding?: boolean;
    fullWidth?: boolean;
}

const StyledCard = styled(ANTDCard)<ICardProps>`
    ${({ theme, noPadding, fullWidth, bg }) => {
        const { spaces, fontSizes, headerFontFamilies } = theme.default;

        const styles = `
            &.ant-card {
                width: ${fullWidth ? "100%" : "unset"};
                padding: ${noPadding ? 0 : getREM(spaces[12])};
                box-shadow: 0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 rgba(0, 0, 0, 0.08);
                background: ${theme.default[`${bg}Color`]};

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

const Card = ({ bordered = false, fullWidth = false, bg, ...props }: ICardProps) => {
    const themeContext = useContext(ThemeContext);
    const defaultBg = bg || (themeContext.mode === ThemeMode.inDepo ? ColorStatus.inDepo : ColorStatus.white);

    return <StyledCard bordered={bordered} fullWidth={fullWidth} bg={defaultBg} {...props} />;
};

export default Card;
