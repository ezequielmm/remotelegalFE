import moment from "moment";
import * as yup from "yup";
import * as CONSTANTS from "../constants/createDeposition";

const DepositionSchema = yup.object().shape({
    caseId: yup.string().nullable().required(CONSTANTS.CASE_ERROR).label("Case"),
    depositions: yup.array().of(
        yup.object().shape({
            date: yup.string().nullable().required(CONSTANTS.DATE_ERROR).label("Date"),
            witness: yup.object().shape({
                email: yup.string().email(CONSTANTS.EMAIL_ERROR).nullable().label("Email Address"),
                phone: yup
                    .string()
                    .matches(/^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^$/, CONSTANTS.PHONE_ERROR)
                    .nullable(),
            }),
            file: yup.mixed().test("is-pdf", CONSTANTS.PDF_ERROR, (value) => {
                return !value?.type || value.type === "application/pdf";
            }),
            startTime: yup
                .string()
                .nullable()
                .required(CONSTANTS.REQUIRED_TIME_ERROR)
                .label("Start Time")
                .test("start_time_test", CONSTANTS.INVALID_START_TIME_ERROR, function (value) {
                    const { date } = this.parent;
                    if (!date || !value) return true;
                    const today = moment();
                    const isSame = today.isSame(moment(date), "day");
                    if (isSame && today.add(1, "h").isSameOrAfter(moment(value))) return false;
                    return true;
                }),
            endTime: yup
                .string()
                .nullable()
                .label("End")
                .test("end_time_test", CONSTANTS.INVALID_END_TIME_ERROR, function (value) {
                    const { startTime } = this.parent;
                    if (!startTime || !value) return true;
                    if (moment(startTime).add(59, "m").isSameOrAfter(moment(value))) return false;
                    return true;
                }),
            isVideoRecordingNeeded: yup.string().nullable().required(CONSTANTS.OPTION_ERROR),
        })
    ),
    requesterEmail: yup.string().email(CONSTANTS.EMAIL_ERROR).required(CONSTANTS.EMAIL_REQUIRED_ERROR),
    requesterName: yup.string().required(CONSTANTS.NAME_REQUIRED_ERROR),
    requesterPhone: yup
        .string()
        .matches(/^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^$/, CONSTANTS.PHONE_ERROR)
        .nullable(),
});
export default DepositionSchema;
