import { AlertProps } from "antd/lib/alert";
import React, { useEffect, useState } from "react";
import StyledAlert from "./styles";

export interface IAlertProps extends AlertProps {
    float?: boolean;
    duration?: number;
    isVisible?: boolean;
}

const Alert = ({ showIcon = true, duration, ...rest }: IAlertProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const timeOut = duration * 1000;
    useEffect(() => {
        const handleClose = () => {
            setIsVisible(false);
        };
        const timer = setTimeout(() => {
            handleClose();
        }, timeOut);
        return () => clearTimeout(timer);
    }, [timeOut]);
    return duration ? (
        isVisible && <StyledAlert showIcon={showIcon} {...rest} />
    ) : (
        <StyledAlert showIcon={showIcon} {...rest} />
    );
};

export default Alert;
