import React, { ReactElement, useState, cloneElement } from "react";
import { Upload } from "antd";
import { UploadProps } from "antd/lib/upload";

interface IUploadButton {
    name: string;
    onUploadCompleted: () => void;
    customRequest: ({ onSuccess, onError, file, onProgress }: any) => Promise<void>;
    uploadProps?: UploadProps;
    children: JSX.Element;
    onChange: any; // TODO: define this.
}
export default function UploadButton({
    onUploadCompleted,
    customRequest,
    uploadProps,
    children,
    onChange,
    ...rest
}: IUploadButton): ReactElement {
    const [disabled, setDisabled] = useState(false);
    const component = cloneElement(children, { disabled });
    return (
        <Upload
            multiple={false}
            showUploadList={false}
            onChange={({ file }) => {
                if (file.status === "done") {
                    onUploadCompleted();
                    setDisabled(false);
                } else if (file.status === "uploading") {
                    setDisabled(true);
                    onChange(file);
                }
            }}
            customRequest={customRequest}
            {...uploadProps}
            {...rest}
        >
            {component}
        </Upload>
    );
}
