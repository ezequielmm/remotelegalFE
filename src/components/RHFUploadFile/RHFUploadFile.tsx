import React from "react";
import { Row } from "antd";
import { CloseOutlined, PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import { IUploadButton } from "../ButtonUpload/ButtonUpload";
import Button from "../Button";
import Upload from "../Upload";

interface RHFUploadFileProps extends RHFWrapperProps {
    UploadComponent?: React.FC<IUploadButton>;
    placeholder?: string;
    uploadProps?: UploadProps;
    buttonLabel: string;
}

export default function RHFUploadFile({
    UploadComponent,
    uploadProps,
    placeholder,
    ...wrapperProps
}: RHFUploadFileProps) {
    const [fileList, setFileList] = React.useState([]);

    const handleChange = ({ file }, onChange, onBlur) => {
        setFileList([file]);
        onChange(file);
        onBlur();
    };

    const removeFile = (ev) => {
        if (ev) ev.stopPropagation();
        setFileList([]);
    };

    return (
        <RHFWrapper
            defaultValue={fileList[0]}
            component={({ name: inputName, onChange, onBlur }) => (
                <Upload
                    data-testid="upload_button"
                    beforeUpload={() => false}
                    fileList={fileList}
                    multiple={false}
                    name={inputName}
                    onChange={(file) => handleChange(file, onChange, onBlur)}
                    showUploadList={false}
                    {...uploadProps}
                    style={{ width: "100%", background: "red" }}
                >
                    {UploadComponent ? (
                        <UploadComponent
                            label={wrapperProps.buttonLabel}
                            fileName={fileList[0]?.name}
                            removeFile={removeFile}
                        />
                    ) : (
                        <Row>
                            <Button icon={fileList[0] ? <PaperClipOutlined /> : <UploadOutlined />}>
                                {fileList[0] ? fileList[0].name : placeholder || wrapperProps.label}
                                {fileList[0] && <CloseOutlined onClick={(ev) => removeFile(ev)} />}
                            </Button>
                        </Row>
                    )}
                </Upload>
            )}
            {...wrapperProps}
        />
    );
}