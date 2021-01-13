import React, { ReactElement, useEffect, useState } from "react";
import Confirm from "../../../../../components/Confirm";
import { IConfirmProps } from "../../../../../components/Confirm/Confirm";
import * as CONSTANTS from "../../../../../constants/exhibits";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { useShareExhibitFile } from "../../../../../hooks/exhibits/hooks";

interface ExhibitSharingModalProps extends IConfirmProps {
    visible: boolean;
    file: ExhibitFile;
    onShareOk: () => void;
    onShareCancel: () => void;
}

const ExhibitSharingModal = ({ file, onShareOk, onShareCancel, ...props }: ExhibitSharingModalProps): ReactElement => {
    const [isErrorMode, setIsErrorMode] = useState(false);
    const [error, setError] = useState("");
    const [isActionPerformed, setIsActionPerformed] = useState(false);
    const { shareExhibit, shareExhibitPending, sharedExhibit, sharingExhibitFileError } = useShareExhibitFile();

    useEffect(() => {
        if (sharedExhibit && isActionPerformed && !sharingExhibitFileError && !shareExhibitPending) {
            onShareOk();
            setIsActionPerformed(false);
        }
    }, [sharedExhibit, sharingExhibitFileError, shareExhibitPending, isActionPerformed, onShareOk]);
    useEffect(() => {
        if (sharingExhibitFileError) {
            setError(CONSTANTS[`LIVE_EXHIBITS_SHARE_ERROR_${sharingExhibitFileError}`]);
        }
    }, [sharingExhibitFileError, shareExhibitPending, setError, shareExhibit]);
    useEffect(() => {
        if (error || sharedExhibit) {
            setIsErrorMode(true);
        }
        return () => {
            setIsErrorMode(false);
        };
    }, [sharedExhibit, error, setIsErrorMode]);
    return (
        <div data-testid="share_document_modal">
            <Confirm
                afterClose={() => setError("")}
                confirmLoading={shareExhibitPending}
                destroyOnClose
                onPositiveClick={() => {
                    if (isErrorMode) {
                        onShareCancel();
                    } else {
                        shareExhibit(file);
                        setIsActionPerformed(true);
                    }
                }}
                onNegativeClick={onShareCancel}
                positiveLabel={
                    isErrorMode
                        ? CONSTANTS.MY_EXHIBITS_SHARE_MODAL_OK_BUTTON_LABEL_ERROR
                        : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_OK_BUTTON_LABEL
                }
                negativeLabel={isErrorMode ? "" : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_CANCEL_BUTTON_LABEL}
                title={
                    isErrorMode
                        ? CONSTANTS.MY_EXHIBITS_SHARE_MODAL_TITLE_ERROR
                        : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_TITLE
                }
                subTitle={
                    isErrorMode
                        ? CONSTANTS.MY_EXHIBITS_SHARE_MODAL_SUBTITLE_ERROR
                        : CONSTANTS.MY_EXHIBITS_SHARE_MODAL_SUBTITLE
                }
                {...props}
            ></Confirm>
        </div>
    );
};

export default ExhibitSharingModal;
