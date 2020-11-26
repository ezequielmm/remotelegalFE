import React from "react";
import styled from "styled-components";
import { Card as ANTDCard } from "antd";
import { CardProps } from "antd/lib/card";
import { getREM } from "../../constants/styles/utils";

export interface ICardProps extends CardProps {
    bordered?: boolean;
}

const StyledCard = styled(ANTDCard)`
    ${({ theme }) => {
        const styles = `
            &.ant-card {
                padding: ${getREM(theme.default.spaces[7])};
                box-shadow: 0 ${getREM(theme.default.spaces[2])} ${getREM(
            theme.default.spaces[5]
        )} 0 rgba(162,195,216,0.08); // TODO hex to rgba
                
                .ant-card-head {
                    font-family: ${theme.default.headerFontFamily};
                    padding: 0;
                    margin: 0 0 ${getREM(theme.default.spaces[3])};
                    border: 0;
                    min-height: auto;

                    .ant-card-head-title {
                        padding: 0;
                        font-size: ${getREM(theme.default.fontSizes[4])};
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
