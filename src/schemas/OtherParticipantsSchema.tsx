import * as yup from "yup";
import * as CONSTANTS from "../constants/otherParticipants";

const OtherParticipantsSchema = yup.object().shape({
    email: yup.string().email(CONSTANTS.EMAIL_ERROR).nullable().label("Email Address"),
    name: yup.string().max(50).nullable().label("Name"),
    phone: yup
        .string()
        .matches(/^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^$/, CONSTANTS.PHONE_NUMBER_ERROR)
        .nullable()
        .label("Phone Number"),
    role: yup.string().nullable().required(CONSTANTS.ROLE_ERROR).label("Role"),
});
export default OtherParticipantsSchema;
