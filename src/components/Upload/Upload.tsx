import { Upload } from "antd";
import styled from "styled-components";

const StyledUpload = styled(Upload)`
    max-width: 100%;
    .ant-upload.ant-upload-select.ant-upload-select-text {
        display: block;
    }
    .ant-upload:focus button {
        background: #fffcf0;
    }
`;

export default StyledUpload;
