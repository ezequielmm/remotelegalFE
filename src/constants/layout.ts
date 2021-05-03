// import { ReactComponent as DashboardIcon } from "../assets/layout/Dashboard.svg";
import { ReactComponent as CasesIcon } from "../assets/layout/Cases.svg";
import { ReactComponent as DepositionsIcon } from "../assets/layout/Depositions.svg";
import { ReactComponent as SupportIcon } from "../assets/layout/Support.svg";

// eslint-disable-next-line import/prefer-default-export
export const menuRoutes = [
    {
        title: "MENU",
        routes: [
            //    { path: "/dashboard", name: "Dashboard", icon: DashboardIcon, dataTestId: "dashboard" },
            { path: "/my-cases", name: "My cases", icon: CasesIcon, dataTestId: "my_cases" },
            { path: "/depositions", name: "My depositions", dataTestId: "my_depositions", icon: DepositionsIcon },
        ],
    },
    {
        title: "SUPPORT",
        routes: [{ path: "/help", name: "Help", dataTestId: "help", icon: SupportIcon }],
    },
];
