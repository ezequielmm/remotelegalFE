import React from "react";
import * as H from "history";
import { Link } from "react-router-dom";
import Space from "../Space";
import { ICardProps } from "../Card/Card";
import { StyledCardIcon, IStyledCardIconProps, StyledButton, StyledIconWrapper } from "./styles";
import Icon from "../Icon";
import { ReactComponent as ArrowIcon } from "../../assets/general/Arrow.svg";
import ColorStatus from "../../types/ColorStatus";

export interface ICardIconProps<S = H.LocationState> extends Omit<ICardProps, "hasPadding" | "title"> {
    icon: React.ComponentType;
    to?: H.LocationDescriptor<S> | ((location: H.Location<S>) => H.LocationDescriptor<S>);
    onClick?: (e) => void;
}

const ActionWrapper = ({
    children,
    hasAction,
    to,
    onClick,
}: Pick<IStyledCardIconProps, "children" | "hasAction" | "to" | "onClick">) => {
    if (!hasAction) return <>{children}</>;

    return to ? (
        <Link to={to}>{children}</Link>
    ) : (
        <StyledButton onClick={onClick} type="link" block>
            {children}
        </StyledButton>
    );
};

const CardIcon = ({ icon, to, onClick, children, hasShaddow = false, ...cardProps }: ICardIconProps) => {
    const hasAction = Boolean(to || onClick);

    return (
        <ActionWrapper hasAction={hasAction} to={to} onClick={onClick}>
            <StyledCardIcon hasAction={hasAction} hasShaddow={hasShaddow} {...cardProps}>
                <Space size="middle" align="center" fullWidth justify="space-between">
                    <Space size="middle" align="center" fullWidth>
                        <StyledIconWrapper>
                            <Icon icon={icon} size={8} color={ColorStatus.white} />
                        </StyledIconWrapper>
                        <Space.Item style={{ display: "grid" }}>{children}</Space.Item>
                    </Space>
                    {(to || onClick) && (
                        <Space.Item className="card-icon__action">
                            <Icon icon={ArrowIcon} size="2rem" rotate={-90} />
                        </Space.Item>
                    )}
                </Space>
            </StyledCardIcon>
        </ActionWrapper>
    );
};

export default CardIcon;
