import styled from "styled-components";
import Menu from "prp-components-library/src/components/Menu";
import Tag from "prp-components-library/src/components/Tag";
import StatusPill from "prp-components-library/src/components/StatusPill";
import { Layout } from "antd";
import Sider from "../../components/Layout/Sider";
import { getREM } from "../../constants/styles/utils";

export const StyledLayout = styled(Layout)`
    background-color: ${({ theme }) => theme.default.whiteColor};
`;
export const StyledSider = styled(Sider)`
    background-color: ${({ theme }) => theme.colors.neutrals[4]};
`;

export const StyledMenu = styled(Menu)`
    width: 100%;
    background-color: transparent;
    border-right: 0;
    .ant-menu-item {
        &:hover {
            color: ${({ theme }) => theme.colors.neutrals[1]};
        }
        &.ant-menu-item-selected {
            background-color: ${({ theme }) => theme.colors.neutrals[3]};
            color: ${({ theme }) => theme.colors.neutrals[0]};
        }
    }
`;

export const StyledTag = styled(Tag)`
    font-size: ${({ theme }) => getREM(theme.default.spaces[3] + theme.default.spaces[1])};
`;

export const StyledStatusPill = styled(StatusPill)`
    width: fit-content;
    padding: 0 ${({ theme }) => getREM(theme.default.spaces[6])};
`;
