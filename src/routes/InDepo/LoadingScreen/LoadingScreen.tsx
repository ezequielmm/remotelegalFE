import { useContext } from "react";
import Modal from "@rl/prp-components-library/src/components/Modal";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import backgroundImage from "../../../assets/pre-depo/bg.png";
import Logo from "../../../components/Logo";
import { LOADING_DEPOSITION_MESSAGE } from "../../../constants/preJoinDepo";
import { GlobalStateContext } from "../../../state/GlobalState";
import getUserNameString from "../../../helpers/getUserNameString";
import { theme } from "../../../constants/styles/theme";
import { WindowSizeContext } from "../../../contexts/WindowSizeContext";

const LoadingScreen = () => {
    const { state } = useContext(GlobalStateContext);
    const { userStatus } = state.room;
    const [windowWidth] = useContext(WindowSizeContext);
    return (
        <div
            data-testid="deposition_loading_screen"
            style={{
                height: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
            }}
        >
            <Modal onlyBody destroyOnClose closable={false} visible centered mask={false}>
                <Space align="center" justify="space-between" direction="vertical" size="large" fullWidth>
                    <Space justify="center" fullWidth>
                        <Logo version="dark" />
                    </Space>
                    <Space align="center" direction="vertical" fullWidth>
                        <Title
                            textAlign="center"
                            ellipsis={false}
                            level={windowWidth < parseInt(theme.default.breakpoints.sm, 10) ? 5 : 4}
                            weight="light"
                            dataTestId="deposition_loading_screen_header"
                        >
                            {getUserNameString(userStatus) + LOADING_DEPOSITION_MESSAGE}
                        </Title>
                    </Space>
                </Space>
            </Modal>
        </div>
    );
};

export default LoadingScreen;
