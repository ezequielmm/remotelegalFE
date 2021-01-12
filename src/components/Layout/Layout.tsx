import React from "react";
import { Auth } from "aws-amplify";
import { useHistory, useLocation } from "react-router-dom";
import { Layout, Menu, Dropdown, Row, Space } from "antd";
import Logo from "../Logo";
import Icon from "../Icon";
import Button from "../Button";
import Text from "../Typography/Text";
import Sider from "./Sider";
import Content from "./Content";
import { ReactComponent as Bell } from "../../assets/layout/Bell.svg";
import { ReactComponent as Messages } from "../../assets/layout/Messages.svg";
import { ReactComponent as DropdownArrow } from "../../assets/layout/DropdownArrow.svg";
import * as CONSTANTS from "../../constants/layout";
import ColorStatus from "../../types/ColorStatus";

const { Header } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: DashboardProps) => {
    const history = useHistory();
    const { pathname } = useLocation();

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
            <Menu.Item onClick={signOut}>Log Out</Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ height: "100vh" }}>
            <Header>
                <Row justify="space-between" align="middle">
                    <Logo />
                    <Row align="middle">
                        <Space size="large" align="start">
                            <Icon style={{ fontSize: "1.25rem" }} icon={Messages} />
                            <Icon style={{ fontSize: "1.25rem" }} icon={Bell} />
                            <Dropdown data-testid="user_menu" overlay={menu} trigger={["click"]}>
                                <Space align="center" size={12}>
                                    <Text data-testid="user_option" ellipsis={false}>
                                        User Name
                                    </Text>
                                    <Icon
                                        style={{ fontSize: "0.625rem", marginLeft: "0.25rem" }}
                                        icon={DropdownArrow}
                                    />
                                </Space>
                            </Dropdown>
                        </Space>
                    </Row>
                </Row>
            </Header>
            <Layout>
                <Sider width="16%">
                    <div>
                        <Button
                            data-testid="schedule_deposition"
                            disabled={pathname.includes("deposition/new")}
                            type="primary"
                            block
                            onClick={() => history.push("/deposition/new")}
                        >
                            Schedule deposition
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
                                            <Icon icon={item.icon} />
                                            {item.name}
                                        </Menu.Item>
                                    ))}
                                </Menu.ItemGroup>
                            ))}
                        </Menu>
                    </div>
                    <div>
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
