import React, { useEffect, useState } from "react";
import { RowSelectionType } from "antd/lib/table/interface.d";
import Button from "@rl/prp-components-library/src/components/Button";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Space from "@rl/prp-components-library/src/components/Space";
import Title from "@rl/prp-components-library/src/components/Title";
import { DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE } from "../../../constants/depositionDetails";
import { useEnteredExhibit } from "../../../hooks/useEnteredExhibits";
import { ReactComponent as DownloadIcon } from "../../../assets/icons/download.svg";
import EnteredExhibitsTable from "./EnteredExhibitsTable";
import downloadFile, { DownloadStatusType } from "../../../helpers/downloadFile";
import { useGetDocumentsUrlList } from "../../../hooks/transcripts/hooks";
import Message from "../../../components/Message";
import * as CONSTANTS from "../../../constants/depositionDetails";

export default function DepositionDetailsEnteredExhibits() {
    const [downloadEnteredExhibitsStatus, setDownloadEnteredExhibitsStatus] = useState<DownloadStatusType>(null);
    const { handleFetchFiles, enteredExhibits, enteredExhibitsPending } = useEnteredExhibit();
    const { getDocumentsUrlList, errorGetTranscriptsUrlList, documentsUrlList, pendingGetTranscriptsUrlList } =
        useGetDocumentsUrlList();
    const [selectedRows, setSelectedRows] = useState([]);
    const rowSelection = {
        type: "checkbox" as RowSelectionType,
        onChange: (selection: []) => {
            setSelectedRows(selection);
        },
    };
    const isDownloadDisabled = !selectedRows.length || pendingGetTranscriptsUrlList;

    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);

    const handleDownload = async () => {
        const documentIds = selectedRows.map((id) => id);
        getDocumentsUrlList(documentIds);
    };

    useEffect(() => {
        if (documentsUrlList && !errorGetTranscriptsUrlList) {
            documentsUrlList.urLs.forEach((url) => {
                downloadFile(url, null, (status) => setDownloadEnteredExhibitsStatus(status));
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

    return (
        <Space direction="vertical" size="middle" pt={6} fullWidth>
            <Space justify="space-between" fullWidth>
                <Space.Item>
                    <Title level={5} weight="regular" dataTestId="entered_exhibits_title">
                        {DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE}
                    </Title>
                </Space.Item>
                <Button
                    type="primary"
                    data-testid={CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID}
                    icon={<Icon icon={DownloadIcon} size={8} />}
                    size="middle"
                    disabled={
                        isDownloadDisabled ||
                        downloadEnteredExhibitsStatus === "pending" ||
                        downloadEnteredExhibitsStatus === "error"
                    }
                    loading={pendingGetTranscriptsUrlList || downloadEnteredExhibitsStatus === "pending"}
                    onClick={handleDownload}
                >
                    {CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_DOWNLOAD}
                </Button>
            </Space>
            <EnteredExhibitsTable
                loading={enteredExhibitsPending}
                dataSource={enteredExhibits || []}
                rowSelection={rowSelection}
            />
        </Space>
    );
}
