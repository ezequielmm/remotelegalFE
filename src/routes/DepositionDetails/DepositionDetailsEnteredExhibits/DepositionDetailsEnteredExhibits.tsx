import React, { useEffect, useState } from "react";
import { RowSelectionType } from "antd/lib/table/interface.d";
import Title from "../../../components/Typography/Title";
import { DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE } from "../../../constants/depositionDetails";
import { useEnteredExhibit } from "../../../hooks/useEnteredExhibits";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import { ReactComponent as DownloadIcon } from "../../../assets/icons/download.svg";

import EnteredExhibitsTable from "./EnteredExhibitsTable";
import { StyledEnteredContainer } from "./styles";
import Space from "../../../components/Space";
import downloadFile from "../../../helpers/downloadFile";
import { useGetDocumentsUrlList } from "../../../hooks/transcripts/hooks";
import Message from "../../../components/Message";
import * as CONSTANTS from "../../../constants/depositionDetails";

export default function DepositionDetailsEnteredExhibits() {
    const { handleFetchFiles, enteredExhibits, enteredExhibitsPending } = useEnteredExhibit();
    const { getDocumentsUrlList, errorGetTranscriptsUrlList, documentsUrlList } = useGetDocumentsUrlList();
    const [selectedRows, setSelectedRows] = useState([]);
    const rowSelection = {
        type: "checkbox" as RowSelectionType,
        onChange: (selection: []) => {
            setSelectedRows(selection);
        },
    };
    const isDownloadDisabled = !selectedRows.length;

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

    return (
        <StyledEnteredContainer>
            <Space mb={4} mt={6} justify="space-between" align="flex-end">
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
                    disabled={isDownloadDisabled}
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
        </StyledEnteredContainer>
    );
}
