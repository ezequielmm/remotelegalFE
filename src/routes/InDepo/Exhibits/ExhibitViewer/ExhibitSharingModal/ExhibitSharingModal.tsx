import React, { ReactElement } from "react";
import Confirm from "../../../../../components/Confirm";
import { IConfirmProps } from "../../../../../components/Confirm/Confirm";
import * as CONSTANTS from "../../../../../constants/exhibits";
import { ExhibitFile } from "../../../../../types/ExhibitFile";

interface ExhibitSharingModalProps extends IConfirmProps {
    visible: boolean;
    file: ExhibitFile;
    loading?: boolean;
    error?: string;
    onShareOk: () => void;
    onShareCancel: () => void;
    onCancel?: () => void;
}

const ExhibitSharingModal = ({
    file,
    loading,
    error,
    onShareOk,
    onShareCancel,
    ...props
}: ExhibitSharingModalProps): ReactElement => {
    return (
        <div data-testid="share_document_modal">
            <Confirm
                confirmLoading={loading}
                positiveLoading={loading}
                destroyOnClose
                onPositiveClick={async () => {
                    if (file) {
                        onShareCancel();
                    } else {
                        onShareOk();
                    }
                }}
                onNegativeClick={onShareCancel}
                positiveLabel={
                    file
                        ? CONSTANTS.MY_EXHIBITS_SHARE_MODAL_OK_BUTTON_LABEL_ERROR
                        : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_OK_BUTTON_LABEL
                }
                negativeLabel={file ? "" : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_CANCEL_BUTTON_LABEL}
                title={file ? CONSTANTS.MY_EXHIBITS_SHARE_MODAL_TITLE_ERROR : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_TITLE}
                subTitle={
                    file ? CONSTANTS.MY_EXHIBITS_SHARE_MODAL_SUBTITLE_ERROR : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_SUBTITLE
                }
                {...props}
            ></Confirm>
        </div>
    );
};

export default ExhibitSharingModal;
