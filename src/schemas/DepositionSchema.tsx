import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as yup from "yup";
import * as CONSTANTS from "../constants/createDeposition";
import getNextWorkingDay from "../helpers/getNextWorkingDay";

dayjs.extend(isSameOrAfter);

const getDepositionSchema = (isAdmin) =>
    yup.object().shape({
        depositions: yup.array().of(
            yup.object().shape({
                date: yup.string().nullable().required(CONSTANTS.DATE_ERROR).label("Date"),
                witness: yup.object().shape({
                    email: yup.string().email(CONSTANTS.EMAIL_ERROR).nullable().label("Email Address"),
                    phone: yup
                        .string()
                        .matches(
                            /^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^$/,
                            CONSTANTS.PHONE_ERROR
                        )
                        .nullable(),
                }),
                file: yup.mixed().test("is-pdf", CONSTANTS.PDF_ERROR, (value) => {
                    return !value || value.type === "application/pdf";
                }),
                startTime: yup
                    .string()
                    .nullable()
                    .required(CONSTANTS.REQUIRED_TIME_ERROR)
                    .label("Start Time")
                    .test(
                        "start_time_test",
                        isAdmin ? CONSTANTS.INVALID_START_TIME_ERROR : CONSTANTS.INVALID_START_TIME_ERROR_END_USER,
                        function (value) {
                            const { date } = this.parent;
                            if (!date || !value) return true;
                            const firstAvailableDay = isAdmin ? dayjs() : getNextWorkingDay(dayjs(), 2);
                            const compareTo = isAdmin ? dayjs(value) : getNextWorkingDay(dayjs(value), 2);
                            const isSame = firstAvailableDay.isSame(dayjs(date), "day");
                            if (isSame && firstAvailableDay.isSameOrAfter(compareTo)) return false;
                            return true;
                        }
                    ),
                endTime: yup
                    .string()
                    .nullable()
                    .label("End")
                    .test("end_time_test", CONSTANTS.INVALID_END_TIME_ERROR, function (value) {
                        const { startTime } = this.parent;
                        if (!startTime || !value) return true;
                        if (dayjs(startTime).add(59, "m").isSameOrAfter(dayjs(value))) return false;
                        return true;
                    }),
                isVideoRecordingNeeded: yup.string().nullable().required(CONSTANTS.OPTION_ERROR),
            })
        ),
        otherParticipants: yup.array().of(
            yup.object().shape({
                email: yup.string().nullable().label("Email Address"),
                name: yup.string().nullable().label("Name"),
                phone: yup
                    .string()
                    .matches(/^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^$/, CONSTANTS.PHONE_ERROR)
                    .nullable()
                    .label("Phone Number"),
                role: yup.string().nullable().label("Role"),
            })
        ),
        ...(isAdmin
            ? {
                  requesterEmail: yup.string().email(CONSTANTS.EMAIL_ERROR).required(CONSTANTS.EMAIL_REQUIRED_ERROR),
                  requesterName: yup.string().required(CONSTANTS.NAME_REQUIRED_ERROR),
                  requesterPhone: yup
                      .string()
                      .matches(
                          /^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$|^$/,
                          CONSTANTS.PHONE_ERROR
                      )
                      .nullable(),
              }
            : {}),
    });
export default getDepositionSchema;
