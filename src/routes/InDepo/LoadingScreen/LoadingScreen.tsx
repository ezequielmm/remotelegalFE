import { useContext } from "react";
import Modal from "prp-components-library/src/components/Modal";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import backgroundImage from "../../../assets/pre-depo/bg.png";
import Logo from "../../../components/Logo";
import { LOADING_DEPOSITION_TITLE, LOADING_DEPOSITION_SUBTITLE } from "../../../constants/preJoinDepo";
import { GlobalStateContext } from "../../../state/GlobalState";
import getUserNameString from "../../../helpers/getUserNameString";
import useWindowSize from "../../../hooks/useWindowSize";
import { theme } from "../../../constants/styles/theme";

const LoadingScreen = () => {
    const { state } = useContext(GlobalStateContext);
    const { userStatus } = state.room;
    const [windowWidth] = useWindowSize();

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
                        <Text dataTestId="deposition_loading_screen_user_name" size="large">
                            <strong>{getUserNameString(userStatus)}</strong>
                        </Text>
                        <Title
                            textAlign="center"
                            ellipsis={false}
                            level={windowWidth < parseInt(theme.default.breakpoints.sm, 10) ? 5 : 4}
                            weight="light"
                            dataTestId="deposition_loading_screen_header"
                        >
                            {`${LOADING_DEPOSITION_TITLE}
                           ${LOADING_DEPOSITION_SUBTITLE}
                           `}
                        </Title>
                    </Space>
                </Space>
            </Modal>
        </div>
    );
};

export default LoadingScreen;
