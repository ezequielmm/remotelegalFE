import React from "react";
import styled from "styled-components";
import { Layout } from "antd";
import { getREM } from "../../constants/styles/utils";

export interface IContentProps {
    children: React.ReactNode;
}

const { Content } = Layout;

const StyledContent = styled(Content)`
    ${({ theme }) => {
        const styles = `
            padding: ${getREM(theme.default.spaces[6] * 3)};
            `;

        return styles;
    }};
`;

const sider = ({ children }: IContentProps) => {
    return <StyledContent>{children}</StyledContent>;
};

export default sider;
