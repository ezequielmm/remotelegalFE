import React, { ReactElement } from "react";
import Confirm from "prp-components-library/src/components/Confirm";
import { IConfirmProps } from "prp-components-library/src/components/Confirm/Confirm";
import * as CONSTANTS from "../../../../../constants/exhibits";
import { ExhibitFile } from "../../../../../types/ExhibitFile";

interface ExhibitClosingModalProps extends IConfirmProps {
    visible: boolean;
    isStamped: boolean;
    file: ExhibitFile;
    loading?: boolean;
    onCancel?: () => void;
    onKeepSharedExhibit?: () => void;
    onCloseSharedExhibit?: () => void;
}

const ExhibitClosingModal = ({
    file,
    isStamped,
    loading,
    onCancel,
    onKeepSharedExhibit,
    onCloseSharedExhibit,
    ...props
}: ExhibitClosingModalProps): ReactElement => {
    return (
        <div data-testid="close_shared_exhibit_modal">
            <Confirm
                destroyOnClose
                onCancel={onKeepSharedExhibit}
                onPositiveClick={() => {
                    if (isStamped) {
                        onCloseSharedExhibit();
                    } else {
                        onKeepSharedExhibit();
                    }
                }}
                onNegativeClick={() => {
                    if (isStamped) {
                        onKeepSharedExhibit();
                    } else {
                        onCloseSharedExhibit();
                    }
                }}
                positiveLabel={
                    isStamped
                        ? CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_OK_BUTTON_LABEL
                        : CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_CANCEL_BUTTON_LABEL
                }
                negativeLabel={
                    isStamped
                        ? CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_CANCEL_BUTTON_LABEL
                        : CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_OK_BUTTON_LABEL
                }
                title={
                    isStamped
                        ? CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_TITLE
                        : CONSTANTS.MY_EXHIBITS_CLOSE_NOT_STAMPED_MODAL_TITLE
                }
                subTitle={
                    isStamped
                        ? CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_SUBTITLE
                        : CONSTANTS.MY_EXHIBITS_CLOSE_NOT_STAMPED_MODAL_SUBTITLE
                }
                positiveLoading={isStamped ? loading : false}
                negativeLoading={!isStamped ? loading : false}
                {...props}
            />
        </div>
    );
};

export default ExhibitClosingModal;
