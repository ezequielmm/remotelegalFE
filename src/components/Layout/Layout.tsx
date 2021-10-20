import React, { useContext, useState } from "react";
import Button from "@rl/prp-components-library/src/components/Button";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Dropdown from "@rl/prp-components-library/src/components/Dropdown";
import Menu from "@rl/prp-components-library/src/components/Menu";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import { Auth } from "aws-amplify";
import { useHistory, useLocation } from "react-router-dom";
import { Layout } from "antd";
import Logo from "../Logo";
import Sider from "./Sider";
import Content from "./Content";
import { ReactComponent as DropdownArrow } from "../../assets/layout/DropdownArrow.svg";
import * as CONSTANTS from "../../constants/layout";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as AddIcon } from "../../assets/general/Add.svg";
import { GlobalStateContext } from "../../state/GlobalState";
import { useToggleSider } from "../../hooks/generalUi/useGeneralUi";
import actions from "../../state/Depositions/DepositionsListActions";

const { Header } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: DashboardProps) => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { toggleSider } = useToggleSider();
    const [isSiderCollapsing, setIsSiderColapsing] = useState(false);

    const toggleSiderCollapse = () => {
        setIsSiderColapsing(true);
        toggleSider();
        setTimeout(() => {
            setIsSiderColapsing(false);
        }, 400);
    };

    const {
        state: {
            generalUi: { isSiderCollapsed },
            user: { currentUser },
        },
        dispatch,
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
                    <a href="/">
                        <Logo height="2.25rem" />
                    </a>
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
                <Sider collapsible collapsed={isSiderCollapsed} onCollapse={toggleSiderCollapse}>
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
                            onSelect={(item) => {
                                if (item?.key === "/depositions") {
                                    dispatch(actions.clear());
                                }
                                history.push(`${item.key}`);
                            }}
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
                                        <Menu.Item
                                            icon={<Icon icon={item.icon} color={ColorStatus.primary} />}
                                            data-testid={item.dataTestId}
                                            key={item.path}
                                        >
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
                {!isSiderCollapsing && <Content>{children}</Content>}
            </Layout>
        </Layout>
    );
};

export default AppLayout;
