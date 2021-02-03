import React from "react";
import { Row } from "antd";
import { CloseOutlined, PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib/upload";
import RHFWrapper from "../RHFWrapper";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import { IUploadButton } from "../ButtonUpload/ButtonUpload";
import Button from "../Button";
import Icon from "../Icon";
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

    const removeFile = (ev: React.MouseEvent, onChange: (file?: File) => void) => {
        if (ev) ev.stopPropagation();
        onChange(undefined);
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
                >
                    {UploadComponent ? (
                        <UploadComponent
                            label={wrapperProps.buttonLabel}
                            fileName={fileList[0]?.name}
                            removeFile={(ev) => removeFile(ev, onChange)}
                        />
                    ) : (
                        <Row>
                            <Button icon={<Icon icon={fileList[0] ? PaperClipOutlined : UploadOutlined} size={8} />}>
                                {fileList[0] ? fileList[0].name : placeholder || wrapperProps.label}
                                {fileList[0] && <CloseOutlined onClick={(ev) => removeFile(ev, onChange)} />}
                            </Button>
                        </Row>
                    )}
                </Upload>
            )}
            {...wrapperProps}
        />
    );
}
