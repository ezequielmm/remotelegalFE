import { UserModel } from "../models";

const getUserNameString = (userStatus: UserModel.UserInfo) => {
    if (userStatus?.participant?.name) {
        return `${userStatus?.participant?.name},`;
    }
    if (userStatus?.participant?.user?.firstName) {
        return `${userStatus?.participant?.user?.firstName} ${userStatus?.participant?.user?.lastName || ""},`;
    }
    return "";
};
export default getUserNameString;
