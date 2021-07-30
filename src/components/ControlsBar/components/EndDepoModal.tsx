import React from "react";
import Confirm from "prp-components-library/src/components/Confirm";

const EndDepoModal = ({
    visible,
    closeModal,
    endDepoFunc,
}: {
    visible: boolean;
    closeModal: () => void;
    endDepoFunc: () => void;
}) => {
    return (
        <Confirm
            visible={visible}
            title="End deposition for all participants?"
            subTitle="All participants will be disconnected from this deposition."
            positiveLabel="Yes, end deposition"
            negativeLabel="No, stay"
            onPositiveClick={endDepoFunc}
            onNegativeClick={closeModal}
        />
    );
};
export default EndDepoModal;
