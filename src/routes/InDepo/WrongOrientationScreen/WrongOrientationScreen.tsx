import { Col, Row } from "antd";
import Icon from "prp-components-library/src/components/Icon";
import Result, { CustomStatus } from "prp-components-library/src/components/Result/Result";
import styled from "styled-components";
import * as CONSTANTS from "../../../constants/preJoinDepo";
import { theme } from "../../../constants/styles/theme";
import { ReactComponent as rotatePhoneIcon } from "../../../assets/icons/Rotate.Phone.svg";
import { ReactComponent as rotateTabletIcon } from "../../../assets/icons/Rotate.Tablet.svg";
import ORIENTATION_STATE from "../../../types/orientation";

const WrapperStyled = styled.div`
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: ${({ theme }) => theme.colors.inDepoNeutrals[10]};
`;

const WrongOrientationScreen = ({ orientation = ORIENTATION_STATE.LANDSCAPE }: { orientation: ORIENTATION_STATE }) => {
    return (
        <WrapperStyled data-testid="deposition_orientation_screen">
            <Row justify="center" align="middle" style={{ height: "100%" }}>
                <Col sm={18} lg={14} xl={13} xxl={9}>
                    <Result
                        icon={
                            <Icon
                                icon={orientation === ORIENTATION_STATE.LANDSCAPE ? rotatePhoneIcon : rotateTabletIcon}
                                size="6rem"
                                color="primary"
                            />
                        }
                        title={CONSTANTS.ORIENTATION_SCREEN[orientation].title}
                        subTitle={CONSTANTS.ORIENTATION_SCREEN[orientation].subtitle}
                        status={CustomStatus.empty}
                        titleColor={theme.default.primaryColor}
                        subTitleColor={theme.default.whiteColor}
                    />
                </Col>
            </Row>
        </WrapperStyled>
    );
};

export default WrongOrientationScreen;
