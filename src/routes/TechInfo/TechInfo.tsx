import Text from "@rl/prp-components-library/src/components/Text";
import Space from "@rl/prp-components-library/src/components/Space";
import Title from "@rl/prp-components-library/src/components/Title";
import Spinner from "@rl/prp-components-library/src/components/Spinner";
import { useState, useEffect } from "react";
import Content from "../../components/Layout/Content";
import ColorStatus from "../../types/ColorStatus";
import * as CONSTANTS from "../../constants/techInfo";
import Overview from "./components/Overview";
import ParticipantTab from "./components/ParticipantTab";
import useFloatingAlertContext from "../../hooks/useFloatingAlertContext";
import useGetDepositionInfo from "../../hooks/techInfo/useGetDepositionInfo";
import { StyledLayout, StyledMenu, StyledSider, StyledTag } from "./styles";

const TechInfo = () => {
    const [selectedOption, setSelectedOption] = useState(CONSTANTS.Options.overview);
    const [getDepositionInfo, depositionInfoLoading, depositionInfoError, depositionInfo] = useGetDepositionInfo();
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const addAlert = useFloatingAlertContext();

    useEffect(() => {
        getDepositionInfo();
    }, [getDepositionInfo]);

    useEffect(() => {
        if (selectedOption !== CONSTANTS.Options.overview && depositionInfo) {
            const selectedParticipant = depositionInfo.participants
                .filter((item) => !!item)
                .find((participant) => participant.id === selectedOption);
            setSelectedParticipant(selectedParticipant);
        }
    }, [depositionInfo, selectedOption]);

    useEffect(() => {
        if (depositionInfoError) {
            addAlert({
                message: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [addAlert, depositionInfoError]);

    if (depositionInfoLoading) {
        return <Spinner />;
    }

    return (
        <StyledLayout style={{ height: "100vh" }}>
            <StyledSider>
                <div>
                    <Space direction="vertical" fullWidth>
                        <Title dataTestId={CONSTANTS.TECH_TAB_HEADER} noMargin level={4} weight="regular">
                            {CONSTANTS.TECH_TAB_HEADER}
                        </Title>
                        <StyledTag data-testid={CONSTANTS.TECH_TAB_PILL} color={ColorStatus.inDepo}>
                            {CONSTANTS.TECH_TAB_PILL}
                        </StyledTag>
                    </Space>
                    <Space mt={6} direction="vertical" fullWidth>
                        <StyledMenu defaultSelectedKeys={[CONSTANTS.Options.overview]}>
                            {depositionInfo &&
                                CONSTANTS.techInfoOptions(depositionInfo.participants.filter((item) => !!item)).map(
                                    (group) => (
                                        <StyledMenu.ItemGroup
                                            title={
                                                <Text
                                                    dataTestId={group.title}
                                                    state={ColorStatus.disabled}
                                                    size="small"
                                                    weight="bold"
                                                >
                                                    {group.title}
                                                </Text>
                                            }
                                            key={group.title}
                                        >
                                            {group.option.map((item) => (
                                                <StyledMenu.Item
                                                    onClick={() => setSelectedOption(item.id)}
                                                    data-testid={item.name}
                                                    key={item.id}
                                                >
                                                    {item.name}
                                                </StyledMenu.Item>
                                            ))}
                                        </StyledMenu.ItemGroup>
                                    )
                                )}
                        </StyledMenu>
                    </Space>
                </div>
            </StyledSider>
            <Content>
                {selectedOption === CONSTANTS.Options.overview && depositionInfo ? (
                    <Overview depositionInfo={depositionInfo} />
                ) : (
                    selectedParticipant && <ParticipantTab ParticipantInfo={selectedParticipant} />
                )}
            </Content>
        </StyledLayout>
    );
};

export default TechInfo;
