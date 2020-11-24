import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme } from "../../constants/styles/theme";
import Control from "../../components/Control/Control";
import "@testing-library/jest-dom";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import Icon from "../../components/Icon";

test("expect a control button with label Circle Button and Mute Icon", async () => {
    const { getByText } = render(
        <ThemeProvider theme={theme}>
            <Control
                isToggled={true}
                color="blue"
                type="circle"
                icon={<Icon icon={MuteIcon} style={{ fontSize: "1.625rem" }} />}
                label="Circle Button"
            />
        </ThemeProvider>
    );
    expect(getByText(/Circle Button/)).toBeInTheDocument();
    expect(getByText(/Mute.svg/)).toBeInTheDocument();
});

test("expect a control button with label Rounded Button and UnMute Icon", async () => {
    const { getByText } = render(
        <ThemeProvider theme={theme}>
            <Control
                isToggled={true}
                color="blue"
                type="rounded"
                icon={<Icon icon={UnmuteIcon} style={{ fontSize: "1.625rem" }} />}
                label="Circle Button"
            />
        </ThemeProvider>
    );
    expect(getByText(/Circle Button/)).toBeInTheDocument();
    expect(getByText(/Unmute.svg/)).toBeInTheDocument();
});
