import React from "react";
import styled from "styled-components";
import { Card as ANTDCard } from "antd";
import { CardProps } from "antd/lib/card";
import { getREM, hexToRGBA } from "../../constants/styles/utils";

export interface ICardProps extends CardProps {
    noPadding?: boolean;
}

const StyledCard = styled(ANTDCard)<ICardProps>`
    ${({ theme, noPadding }) => {
        const { neutrals } = theme.colors;
        const { spaces, fontSizes, headerFontFamilies } = theme.default;

        const inDepoTheme =
            theme.mode === "inDepo"
                ? `
                    background: ${theme.colors.inDepoNeutrals[4]};
                `
                : "";

        const styles = `
            &.ant-card {
                padding: ${noPadding ? 0 : getREM(spaces[12])};
                box-shadow: 0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 ${hexToRGBA(neutrals[2], 0.08)}
                
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
            ${inDepoTheme}
        `;
        return styles;
    }}
`;

const Card = ({ bordered = false, ...props }: ICardProps) => <StyledCard bordered={bordered} {...props} />;

export default Card;
