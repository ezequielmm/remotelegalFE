import React from "react";
import styled from "styled-components";
import { Card as ANTDCard } from "antd";
import { CardProps } from "antd/lib/card";
import { getREM, hexToRGBA } from "../../constants/styles/utils";

export interface ICardProps extends CardProps {
    bordered?: boolean;
}

const StyledCard = styled(ANTDCard)`
    ${({ theme }) => {
        const { neutrals } = theme.colors;
        const { spaces, fontSizes, headerFontFamily } = theme.default;
        const styles = `
            &.ant-card {
                padding: ${getREM(spaces[12])};
                box-shadow: 0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 ${hexToRGBA(neutrals[2], 0.08)}
                
                .ant-card-head {
                    font-family: ${headerFontFamily};
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

const Card = ({ bordered, ...props }: ICardProps) => <StyledCard bordered={bordered ? bordered : false} {...props} />;

export default Card;
