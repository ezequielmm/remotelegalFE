import React, { useContext } from "react";
import { Auth } from "aws-amplify";
import { useHistory, useLocation } from "react-router-dom";
import { Layout } from "antd";
import Space from "../Space";
import Logo from "../Logo";
import Icon from "../Icon";
import Button from "../Button";
import Dropdown from "../Dropdown";
import Menu from "../Menu";
import Text from "../Typography/Text";
import Sider from "./Sider";
import Content from "./Content";
import { ReactComponent as DropdownArrow } from "../../assets/layout/DropdownArrow.svg";
import * as CONSTANTS from "../../constants/layout";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as AddIcon } from "../../assets/general/Add.svg";
import { GlobalStateContext } from "../../state/GlobalState";
import { useToggleSider } from "../../hooks/generalUi/useGeneralUi";

const { Header } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: DashboardProps) => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { toggleSlider } = useToggleSider();

    const {
        state: {
            generalUi: { isSiderCollapsed },
            user: { currentUser },
        },
    } = useContext(GlobalStateContext);

    const signOut = async () => {
        try {
            await Auth.signOut({ global: true });
        } catch (error) {
            await Auth.signOut();
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
        }
    };
    const menu = (
        <Menu>
            <Menu.Item data-testid="log_out_button" onClick={signOut}>
                Log Out
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ height: "100vh" }}>
            <Header>
                <Space justify="space-between" align="center">
                    <Logo height="2.25rem" />
                    <Space size="large" align="flex-start">
                        {currentUser && (
                            <Dropdown
                                data-testid="user_menu"
                                overlay={menu}
                                trigger={["click"]}
                                styled
                                arrow
                                placement="bottomRight"
                                overlayStyle={{ width: "12rem", maxWidth: "12rem", minWidth: "12rem" }}
                            >
                                <Space align="center" size={4}>
                                    <Text data-testid="user_option" ellipsis={false}>
                                        {`${currentUser?.firstName} ${currentUser?.lastName}`.trim()}
                                    </Text>
                                    <Space.Item>
                                        <Icon size="0.625rem" icon={DropdownArrow} />
                                    </Space.Item>
                                </Space>
                            </Dropdown>
                        )}
                    </Space>
                </Space>
            </Header>
            <Layout>
                <Sider collapsible collapsed={isSiderCollapsed} onCollapse={toggleSlider}>
                    <div>
                        <Button
                            data-testid="schedule_deposition"
                            disabled={pathname.includes("deposition/new")}
                            type="primary"
                            block
                            onClick={() => history.push("/deposition/new")}
                        >
                            {isSiderCollapsed ? <Icon icon={AddIcon} /> : "Schedule deposition"}
                        </Button>
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={[pathname]}
                            onSelect={(item) => history.push(`${item.key}`)}
                        >
                            {CONSTANTS.menuRoutes.map((group) => (
                                <Menu.ItemGroup
                                    title={
                                        <Text state={ColorStatus.white} size="small">
                                            {group.title}
                                        </Text>
                                    }
                                    key={group.title}
                                >
                                    {group.routes.map((item) => (
                                        <Menu.Item data-testid={item.dataTestId} key={item.path}>
                                            <Icon icon={item.icon} color={ColorStatus.primary} />
                                            {item.name}
                                        </Menu.Item>
                                    ))}
                                </Menu.ItemGroup>
                            ))}
                        </Menu>
                    </div>
                    <div className="sider__copyright">
                        <Text state={ColorStatus.disabled} size="small" ellipsis={false}>
                            Remote Legal © 2021
                        </Text>
                        <Text state={ColorStatus.disabled} size="small" ellipsis={false}>
                            All rights Reserved
                        </Text>
                    </div>
                </Sider>
                <Content>{children}</Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
