import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { RowSelectionType } from "antd/lib/table/interface.d";
import {
    useTranscriptFileList,
    useUploadFile,
    useRemoveTranscript,
    useGetDocumentsUrlList,
    useNotifyParties,
} from "../../../hooks/transcripts/hooks";
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
import downloadFile from "../../../helpers/downloadFile";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import ColorStatus from "../../../types/ColorStatus";
import Confirm from "../../../components/Confirm";
import { TranscriptFile } from "../../../types/TranscriptFile";
import Message from "../../../components/Message";
import { GlobalStateContext } from "../../../state/GlobalState";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

const DepositionDetailsTranscripts = () => {
    const emptyFile = { percent: 0, status: "", size: 0 };
    const [file, setFile] = React.useState(emptyFile);
    const [showProgressBar, setShowProgressBar] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const tableRef = React.useRef(null);

    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFile(depositionID);
    const { handleFetchFiles, transcriptFileList, loading } = useTranscriptFileList(depositionID);
    const [notifyParties, notifyPartiesLoading, notifyPartiesError, notified] = useNotifyParties();
    const { state } = React.useContext(GlobalStateContext);
    const { currentUser } = state?.user;
    const [selectedRows, setSelectedRows] = useState([]);
    const rowSelection = {
        type: "checkbox" as RowSelectionType,
        onChange: (selection: []) => {
            setSelectedRows(selection);
        },
    };
    const [removeTranscript, removeTranscriptLoading, removeTranscriptError] = useRemoveTranscript();
    const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
    const selectedRecord = useRef<TranscriptFile>(null);
    const { getDocumentsUrlList, errorGetTranscriptsUrlList, documentsUrlList, pendingGetTranscriptsUrlList } =
        useGetDocumentsUrlList();

    const refreshList = () => {
        setShowProgressBar(false);
        handleFetchFiles();
    };

    const isDownloadDisabled = !selectedRows.length || pendingGetTranscriptsUrlList;

    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);

    const handleUploadChange = (currentFile: any) => {
        setFile(currentFile);
    };

    useEffect(() => {
        if (file && file.status === "uploading") {
            setShowProgressBar(true);
        }
    }, [file]);

    useEffect(() => {
        if (documentsUrlList && !errorGetTranscriptsUrlList) {
            documentsUrlList.urLs.forEach((url) => {
                downloadFile(url);
            });
        }
        if (errorGetTranscriptsUrlList) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [documentsUrlList, errorGetTranscriptsUrlList]);

    const handleDownload = async () => {
        const documentIds = selectedRows.map((id) => id);
        getDocumentsUrlList(documentIds);
    };

    useEffect(() => {
        if (removeTranscriptError) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [removeTranscriptError]);

    const handleRemoveTranscript = async () => {
        toggleDeleteModal();
        await removeTranscript(depositionID, selectedRecord.current.id);
        handleFetchFiles();
    };

    const handleNotifyParties = () => {
        notifyParties(depositionID);
    };

    const addAlert = useFloatingAlertContext();
    useEffect(() => {
        if (notified && !notifyPartiesLoading) {
            addAlert({
                message: CONSTANTS.DEPOSITION_DETAILS_EMAIL_SENT_MESSAGE,
                type: "success",
                duration: 3,
            });
        }

        if (notifyPartiesError && !notifyPartiesLoading) {
            addAlert({
                message: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [notified, notifyPartiesLoading, notifyPartiesError, addAlert]);

    const columns = [
        ...CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPTS_COLUMNS,
        {
            render: (record: TranscriptFile) => {
                return record?.documentType === CONSTANTS.DEPOSITION_DETAILS_DELETABLE_TRANSCRIPT_TYPE
                    ? !!currentUser?.isAdmin && (
                          <Space fullWidth>
                              <Icon
                                  data-testid={`${record.id}_delete_icon`}
                                  icon={DeleteIcon}
                                  onClick={() => {
                                      selectedRecord.current = record;
                                      toggleDeleteModal();
                                  }}
                                  color={ColorStatus.primary}
                                  size={8}
                              />
                          </Space>
                      )
                    : null;
            },
            width: 50,
        },
    ];

    return (
        <>
            <Confirm
                negativeLoading={removeTranscriptLoading}
                positiveLoading={removeTranscriptLoading}
                title={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_TITLE}
                subTitle={`${CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE} ${selectedRecord?.current?.displayName}?`}
                negativeLabel={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_NO}
                positiveLabel={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_YES}
                visible={openDeleteModal}
                onPositiveClick={() => handleRemoveTranscript()}
                onNegativeClick={() => toggleDeleteModal()}
            >
                <span data-testid="modalconfirm" />
            </Confirm>
            <Space direction="vertical" size="middle" pt={6} fullWidth>
                <Space justify="space-between" fullWidth>
                    <Title level={5} noMargin weight="regular" dataTestId={CONSTANTS.DETAILS_TRANSCRIPT_TITLE}>
                        {CONSTANTS.DETAILS_TRANSCRIPT_TITLE}
                    </Title>
                    <Space>
                        {!!currentUser?.isAdmin && (
                            <Button
                                data-testid={CONSTANTS.DETAILS_TRANSCRIPT_NOTIFY_BUTTON_TEST_ID}
                                type="text"
                                disabled={transcriptFileList?.length < 2}
                                icon={<Icon icon={MessageIcon} size={9} />}
                                size="middle"
                                onClick={handleNotifyParties}
                                loading={notifyPartiesLoading}
                            >
                                {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_NOTIFY}
                            </Button>
                        )}

                        <Button
                            type="primary"
                            data-testid={CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID}
                            icon={<Icon icon={DownloadIcon} size={9} />}
                            size="middle"
                            disabled={isDownloadDisabled}
                            loading={pendingGetTranscriptsUrlList}
                            onClick={handleDownload}
                        >
                            {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_DOWNLOAD}
                        </Button>
                        {!!currentUser?.isAdmin && (
                            <UploadButton
                                name="file"
                                onUploadCompleted={refreshList}
                                customRequest={upload}
                                uploadProps={{ accept: ".pdf, .txt, .ptx" }}
                                onChange={handleUploadChange}
                                data-testid={CONSTANTS.DETAILS_TRANSCRIPT_UPLOAD_BUTTON_TEST_ID}
                            >
                                <Button type="primary" icon={<Icon icon={UploadIcon} size={9} />} size="middle">
                                    {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD}
                                </Button>
                            </UploadButton>
                        )}
                    </Space>
                </Space>
                {showProgressBar && (
                    <ProgressBar
                        percent={file?.percent}
                        errors={
                            file?.size > CONSTANTS.DEPOSITION_DETAILS_SUMMARY_FILE_SIZE_LIMIT && file?.percent === 100
                                ? [CONSTANTS.DETAILS_EXHIBIT_FILE_EXCEEDS_LIMIT]
                                : []
                        }
                        onClose={() => {
                            setShowProgressBar(false);
                            setFile(emptyFile);
                        }}
                    />
                )}
                <Table
                    ref={tableRef}
                    rowKey="id"
                    loading={loading}
                    dataSource={transcriptFileList || []}
                    columns={columns}
                    pagination={false}
                    style={{ height: "100%" }}
                    rowSelection={rowSelection}
                />
            </Space>
        </>
    );
};

export default DepositionDetailsTranscripts;
