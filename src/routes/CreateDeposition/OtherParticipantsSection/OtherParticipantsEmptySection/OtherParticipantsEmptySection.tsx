import React, { ReactElement } from "react";

import { Space } from "antd";
import Icon from "../../../../components/Icon";
import Text from "../../../../components/Typography/Text";
import { ReactComponent as ParticipantsIcon } from "../../../../assets/icons/participants.svg";
import * as CONSTANTS from "../../../../constants/otherParticipants";
import ColorStatus from "../../../../types/ColorStatus";

export default function OtherParticipantsEmptySection(): ReactElement {
    return (
        <Space size="small" direction="vertical" data-testid="empty_data_section">
            {/* TODO add size property to Icon component */}
            <Icon data-testid="remove" style={{ fontSize: "2.8rem" }} icon={ParticipantsIcon} />
            <Text size="extralarge" weight="light" ellipsis={false} state={ColorStatus.disabled} font="header">
                {CONSTANTS.EMPTY_STATE_TITLE}
            </Text>
        </Space>
    );
}
