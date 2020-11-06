import React, { useEffect, useState } from "react";
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

const { Header } = Layout;

interface DashboardProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: DashboardProps) => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const history = useHistory();
    const location = useLocation();

    const getArrSelectedMenuItem = (routes: string[][], pathName: string): string[] =>
        routes.map((group): string => (group.includes(pathName.toLowerCase()) && pathName ? pathName : null));

    useEffect(() => {
        const routesPath: string[][] = CONSTANTS.menuRoutes.map((group) =>
            group.routes.map((route) => route.path.toLowerCase())
        );

        setSelectedMenuItem(getArrSelectedMenuItem(routesPath, location.pathname));
    }, [location]);

    const signOut = async () => {
        await Auth.signOut({ global: true });
        history.push("/");
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
                            <Dropdown overlay={menu} trigger={["click"]}>
                                <Space align="center" size={12}>
                                    <Text ellipsis={false}>User Name</Text>
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
                        <Button type="primary" block onClick={() => history.push("/deposition")}>
                            Schedule deposition
                        </Button>
                        <Menu
                            theme="dark"
                            selectedKeys={selectedMenuItem}
                            onSelect={(item) => history.push(`${item.key}`)}
                        >
                            {CONSTANTS.menuRoutes.map((group) => (
                                <Menu.ItemGroup
                                    title={
                                        <Text state="white" size="small">
                                            {group.title}
                                        </Text>
                                    }
                                    key={group.title}
                                >
                                    {group.routes.map((item) => (
                                        <Menu.Item key={item.path}>
                                            <Icon icon={item.icon} />
                                            {item.name}
                                        </Menu.Item>
                                    ))}
                                </Menu.ItemGroup>
                            ))}
                        </Menu>
                    </div>
                    <div>
                        <Text state="disabled" size="small" ellipsis={false}>
                            Remote Legal © 2021
                        </Text>
                        <Text state="disabled" size="small" ellipsis={false}>
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
