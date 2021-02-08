enum ColorStatus {
    primary = "primary",
    secondary = "secondary",
    disabled = "disabled",
    error = "error",
    warning = "warning",
    success = "success",
    info = "info",
    white = "white",
    inDepo = "inDepo",
}

export const isColorStatusType = (color: string): color is keyof typeof ColorStatus => {
    return Object.keys(ColorStatus).includes(String(color as string));
};

export default ColorStatus;
