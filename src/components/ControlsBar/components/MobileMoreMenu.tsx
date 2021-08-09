import React from "react";
import Button from "prp-components-library/src/components/Button";
import Drawer from "prp-components-library/src/components/Drawer";
import Text from "prp-components-library/src/components/Text";
import Icon from "prp-components-library/src/components/Icon";
import Menu from "prp-components-library/src/components/Menu";
import Space from "prp-components-library/src/components/Space";
import ColorStatus from "prp-components-library/src/types/ColorStatus";
import { StyledMobileMenu } from "../styles";
import * as CONSTANTS from "../../../constants/inDepo";
import { ReactComponent as SettingsIcon } from "../../../assets/in-depo/settings.svg";
import { ReactComponent as SupportIcon } from "../../../assets/in-depo/Support.svg";

export interface IMobileMoreMenuProps {
    moreOpen?: boolean;
    toggleMore?: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    toggleSettingsModal?:
        | React.Dispatch<React.SetStateAction<boolean>>
        | ((value: React.SetStateAction<boolean>) => void);
    handleHelpModal?: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
}

const MobileMoreMenu = ({ moreOpen, toggleMore, toggleSettingsModal, handleHelpModal }: IMobileMoreMenuProps) => {
    return (
        <Drawer
            visible={moreOpen}
            onClose={() => toggleMore(false)}
            placement="bottom"
            height="100%"
            title={CONSTANTS.CONTROLS_BAR_MORE_LABEL}
        >
            <StyledMobileMenu selectable={false}>
                <Menu.Item key="1" onClick={() => toggleSettingsModal(true)}>
                    <Button data-testid="settings_button" type="link">
                        <Space size="small" align="center">
                            <Icon icon={SettingsIcon} size={8} color={ColorStatus.white} />
                            <Text state={ColorStatus.white} size="small">
                                {CONSTANTS.CONTROLS_BAR_SETTINGS_LABEL}
                            </Text>
                        </Space>
                    </Button>
                </Menu.Item>
                <Menu.Item key="0" onClick={() => handleHelpModal(true)}>
                    <Button data-testid="support_button" type="link">
                        <Space size="small" align="center">
                            <Icon icon={SupportIcon} size={8} color={ColorStatus.white} />
                            <Text state={ColorStatus.white} size="small">
                                {CONSTANTS.CONTROLS_BAR_SUPPORT_LABEL}
                            </Text>
                        </Space>
                    </Button>
                </Menu.Item>
            </StyledMobileMenu>
        </Drawer>
    );
};

export default MobileMoreMenu;
