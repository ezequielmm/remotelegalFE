import React, { useContext } from "react";
import backgroundImage from "../../../assets/pre-depo/bg.png";
import Space from "../../../components/Space";
import Modal from "../../../components/Modal";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import Logo from "../../../components/Logo";
import { LOADING_DEPOSITION_TITLE, LOADING_DEPOSITION_SUBTITLE } from "../../../constants/preJoinDepo";
import { GlobalStateContext } from "../../../state/GlobalState";

const LoadingScreen = () => {
    const { state } = useContext(GlobalStateContext);
    const { userStatus } = state.room;
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
                            <strong>
                                {`${userStatus?.participant?.name},` || `${userStatus?.participant?.user?.name},` || ""}
                            </strong>
                        </Text>
                        <Title
                            textAlign="center"
                            ellipsis={false}
                            level={4}
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
