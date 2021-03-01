import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranscriptList, useUploadFile } from "../../../hooks/transcripts/hooks";
import { useUserIsAdmin } from "../../../hooks/users/hooks";
import Table from "../../../components/Table";
import Space from "../../../components/Space";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import { ReactComponent as UploadIcon } from "../../../assets/icons/upload.svg";
import { ReactComponent as DownloadIcon } from "../../../assets/icons/download.svg";
import { ReactComponent as MessageIcon } from "../../../assets/icons/Messages.svg";
import * as CONSTANTS from "../../../constants/depositionDetails";
import UploadButton from "./UploadButton";
import ProgressBar from "../../../components/ProgressBar";

const DepositionDetailsTranscripts = () => {
    const [file, setFile] = React.useState({ percent: 0, status: "" });
    const [showProgressBar, setShowProgressBar] = React.useState(false);
    const tableRef = React.useRef(null);

    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFile(depositionID);
    const { handleFetchFiles, files, loading } = useTranscriptList(depositionID);
    const [checkIfUserIsAdmin, loadingUserIsAdmin, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();

    const refreshList = () => {
        setShowProgressBar(false);
        handleFetchFiles();
    };

    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);

    useEffect(() => {
        checkIfUserIsAdmin();
    }, [checkIfUserIsAdmin]);

    const handleUploadChange = (currentFile: any) => {
        setFile(currentFile);
    };

    useEffect(() => {
        if (file && file.status === "uploading") {
            setShowProgressBar(true);
        }
    }, [file]);

    return (
        <Space direction="vertical" size="middle" pt={6} fullWidth>
            <Space justify="space-between" fullWidth>
                <Title level={5} noMargin weight="regular" dataTestId={CONSTANTS.DETAILS_TRANSCRIPT_TITLE}>
                    {CONSTANTS.DETAILS_TRANSCRIPT_TITLE}
                </Title>
                <Space>
                    {!loadingUserIsAdmin &&
                        !errorUserIsAdmin &&
                        userIsAdmin &&
                        false /* TODO: Remove this when this feature is enabled */ && (
                            <Button type="text" disabled icon={<Icon icon={MessageIcon} size={9} />} size="small">
                                {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_NOTIFY}
                            </Button>
                        )}

                    {false && ( // TODO: remove this when this feature is enabled
                        <Button type="primary" icon={<Icon icon={DownloadIcon} size={9} />} size="small">
                            {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_DOWNLOAD}
                        </Button>
                    )}
                    {!loadingUserIsAdmin && !errorUserIsAdmin && userIsAdmin && (
                        <UploadButton
                            name="file"
                            onUploadCompleted={refreshList}
                            customRequest={upload}
                            uploadProps={{ accept: ".pdf, .txt, .ptx" }}
                            onChange={handleUploadChange}
                        >
                            <Button type="primary" icon={<Icon icon={UploadIcon} size={9} />} size="small">
                                {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD}
                            </Button>
                        </UploadButton>
                    )}
                </Space>
            </Space>
            {showProgressBar && <ProgressBar percent={file?.percent} />}
            <Table
                ref={tableRef}
                rowKey="id"
                loading={loading}
                dataSource={files || []}
                columns={CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPTS_COLUMNS}
                pagination={false}
                style={{ height: "100%" }}
            />
        </Space>
    );
};

export default DepositionDetailsTranscripts;
