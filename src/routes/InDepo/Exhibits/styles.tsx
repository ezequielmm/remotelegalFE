import styled from "styled-components";
import { Space as AntSpace } from "antd";
import Dragger from "antd/lib/upload/Dragger";

export const ExhibitTabPaneSpacer = styled(AntSpace)`
    height: inherit;
    width: 100%;

    > :last-child {
        height: inherit;
    }
`;


// TODO delete when replace for component
export const StyledDragger = styled(Dragger)`
    background-color: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: dashed 1px #c09853;
    border-radius: 12px;
    height: 75px;
    width: 100%;
    gap: 10px;
    label {
        cursor: pointer;
        color: ${({ theme }) => theme.default.whiteColor};
    }
    &.ant-upload.ant-upload-drag {
        background: none;
    }
`;
