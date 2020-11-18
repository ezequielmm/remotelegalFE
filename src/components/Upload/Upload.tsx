import { Upload } from "antd";
import styled from "styled-components";

const StyledUpload = styled(Upload)`
    max-width: 100%;
    .ant-upload.ant-upload-select.ant-upload-select-text {
        display: block;
    }
`;

export default StyledUpload;
