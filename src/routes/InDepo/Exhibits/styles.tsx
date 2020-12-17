import styled from "styled-components";
import { Space as AntSpace } from "antd";

export const ExhibitTabPaneSpacer = styled(AntSpace)`
    height: inherit;
    width: 100%;

    > :last-child {
        height: inherit;
    }
`;

// TODO delete when replace for component
export const UploadFilesContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: dashed 1px #c09853;
    border-radius: 12px;
    height: 75px;
    width: 100%;
`;
