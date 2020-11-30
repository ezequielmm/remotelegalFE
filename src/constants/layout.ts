import { ReactComponent as DashboardIcon } from "../assets/layout/Dashboard.svg";
import { ReactComponent as CasesIcon } from "../assets/layout/Cases.svg";
import { ReactComponent as SupportIcon } from "../assets/layout/Support.svg";

// eslint-disable-next-line import/prefer-default-export
export const menuRoutes = [
    {
        title: "MENU",
        routes: [
            { path: "/dashboard", name: "Dashboard", icon: DashboardIcon },
            { path: "/my-cases", name: "My cases", icon: CasesIcon },
        ],
    },
    {
        title: "SUPPORT",
        routes: [{ path: "/help", name: "Help", icon: SupportIcon }],
    },
];
