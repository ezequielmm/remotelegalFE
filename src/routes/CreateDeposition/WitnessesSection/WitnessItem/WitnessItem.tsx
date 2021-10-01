import React from "react";
import { Row, Col } from "antd";
import { ArrayField, useFormContext } from "react-hook-form";
import ButtonUpload from "prp-components-library/src/components/ButtonUpload";
import Icon from "prp-components-library/src/components/Icon";
import RHFDatePicker from "prp-components-library/src/components/RHF/RHFDatePicker";
import RHFInput from "prp-components-library/src/components/RHF/RHFInput";
import RHFRadioButton from "prp-components-library/src/components/RHF/RHFRadioButton";
import RHFSelect from "prp-components-library/src/components/RHF/RHFSelect";
import RHFTimePicker from "prp-components-library/src/components/RHF/RHFTimePicker";
import RHFUploadFile from "prp-components-library/src/components/RHF/RHFUploadFile";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import dayjs from "dayjs";
import * as CONSTANTS from "../../../../constants/createDeposition";
import { theme } from "../../../../constants/styles/theme";
import { DeleteWitnessButton, WitnessTitleContainer } from "../../styles";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete.svg";
import ColorStatus from "../../../../types/ColorStatus";
import { TimeZones } from "../../../../models/general";
import getNextWorkingDay from "../../../../helpers/getNextWorkingDay";

interface WitnessItemProps {
    deposition: Partial<ArrayField<Record<string, any>>>;
    removeWitness: () => void;
    witnessNumber?: number;
    shouldValidateDepoDate: boolean;
}

const WitnessItem = ({ deposition, removeWitness, witnessNumber, shouldValidateDepoDate }: WitnessItemProps) => {
    const { control, errors, setValue, trigger, watch } = useFormContext();
    const depositionErrors = errors.depositions ? errors.depositions[witnessNumber] : {};

    const date = watch(`depositions[${witnessNumber}].date`);
    const startTime = watch(`depositions[${witnessNumber}].startTime`);
    const endTime = watch(`depositions[${witnessNumber}].endTime`);

    React.useEffect(() => {
        if (startTime && endTime) trigger(`depositions[${witnessNumber}].endTime`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime]);

    React.useEffect(() => {
        if (date && startTime) trigger(`depositions[${witnessNumber}].startTime`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    const disabledDate = (current) => {
        const validDateFrom = shouldValidateDepoDate ? getNextWorkingDay(dayjs(), 2) : dayjs();
        return (
            current &&
            (current.isBefore(validDateFrom.startOf("day")) ||
                current.isAfter(dayjs().startOf("day").add(1, "y")) ||
                [0, 6].includes(current.day()))
        );
    };

    return (
        <Space direction="vertical" size="large" fullWidth>
            <Space.Item fullWidth>
                <WitnessTitleContainer data-testid="witness_title">
                    <Title level={5} weight="regular" dataTestId="witness_sub_title">
                        {`${CONSTANTS.WITNESS_TITLE}`}
                    </Title>
                    {witnessNumber > 0 && (
                        <DeleteWitnessButton
                            type="link"
                            onClick={removeWitness}
                            data-testid="witness_delete_button"
                            icon={<Icon icon={DeleteIcon} size={8} />}
                        >
                            Delete witness
                        </DeleteWitnessButton>
                    )}
                </WitnessTitleContainer>
                <Text state={ColorStatus.disabled} ellipsis={false}>
                    {CONSTANTS.WITNESS_SUBTITLE}
                </Text>
            </Space.Item>
            <Space.Item fullWidth>
                <Row gutter={theme.default.baseUnit * theme.default.spaces[9]} style={{ width: "100%" }}>
                    <Col xs={6}>
                        <RHFInput
                            control={control}
                            defaultValue={deposition.witness?.email}
                            errorMessage={depositionErrors?.witness?.email?.message}
                            name={`depositions[${witnessNumber}].witness.email`}
                            label={CONSTANTS.OPTIONAL_EMAIL_LABEL}
                            placeholder={CONSTANTS.EMAIL_PLACEHOLDER}
                        />
                    </Col>
                    <Col xs={6}>
                        <RHFInput
                            control={control}
                            defaultValue={deposition.witness?.name}
                            errorMessage={depositionErrors?.witness?.name?.message}
                            name={`depositions[${witnessNumber}].witness.name`}
                            label={CONSTANTS.OPTIONAL_NAME_LABEL}
                            placeholder={CONSTANTS.WITNESS_NAME_PLACEHOLDER}
                            maxLength={50}
                        />
                    </Col>
                    <Col xs={6}>
                        <RHFInput
                            control={control}
                            defaultValue={deposition.witness?.phone}
                            errorMessage={depositionErrors?.witness?.phone?.message}
                            name={`depositions[${witnessNumber}].witness.phone`}
                            label={CONSTANTS.OPTIONAL_PHONE_LABEL}
                            placeholder={CONSTANTS.PHONE_PLACEHOLDER}
                        />
                    </Col>
                    <Col xs={6}>
                        <RHFUploadFile
                            defaultValue={deposition.file}
                            errorMessage={depositionErrors?.file?.message}
                            name={`depositions[${witnessNumber}].file`}
                            label={CONSTANTS.UPLOAD_CAPTION_LABEL}
                            buttonLabel={CONSTANTS.UPLOAD_BUTTON_LABEL}
                            placeholder={CONSTANTS.UPLOAD_CAPTION_PLACEHOLDER}
                            control={control}
                            uploadProps={{ accept: ".pdf" }}
                            UploadComponent={ButtonUpload}
                        />
                    </Col>
                </Row>
                <Row gutter={theme.default.baseUnit * theme.default.spaces[9]} style={{ width: "100%" }}>
                    <Col xs={6}>
                        <RHFDatePicker
                            defaultValue={deposition.date}
                            datePickerProps={{
                                allowClear: false,
                                disabledDate,
                                format: CONSTANTS.DATE_FORMAT,
                                mode: "date",
                            }}
                            errorMessage={depositionErrors?.date?.message}
                            name={`depositions[${witnessNumber}].date`}
                            label={CONSTANTS.DATE_LABEL}
                            control={control}
                            placeholder={CONSTANTS.DATE_PLACEHOLDER}
                        />
                    </Col>
                    <Col xs={5}>
                        <RHFTimePicker
                            dataTestId="witness_start_picker"
                            control={control}
                            defaultValue={deposition.startTime}
                            timePickerProps={CONSTANTS.TIME_PICKER_PROPS}
                            errorMessage={depositionErrors?.startTime?.message}
                            name={`depositions[${witnessNumber}].startTime`}
                            label={CONSTANTS.START_LABEL}
                            placeholder={CONSTANTS.START_PLACEHOLDER}
                            disabledErrorEllipsis
                        />
                    </Col>
                    <Col xs={5}>
                        <RHFTimePicker
                            dataTestId="witness_end_picker"
                            control={control}
                            defaultValue={deposition.endTime}
                            timePickerProps={CONSTANTS.TIME_PICKER_PROPS}
                            extraFooterText="TO BE DEFINED"
                            handleExtraFooterClick={(onChange) => onChange("")}
                            errorMessage={depositionErrors?.endTime?.message}
                            name={`depositions[${witnessNumber}].endTime`}
                            label={CONSTANTS.END_LABEL}
                            placeholder={CONSTANTS.END_PLACEHOLDER}
                        />
                    </Col>
                    <Col xs={4}>
                        <RHFSelect
                            dataTestId="witness_timezone"
                            control={control}
                            defaultValue={deposition.timeZone}
                            errorMessage={depositionErrors?.timeZone?.message}
                            name={`depositions[${witnessNumber}].timeZone`}
                            label={CONSTANTS.TIME_ZONE_LABEL}
                            placeholder={CONSTANTS.TIME_ZONE_PLACEHOLDER}
                            items={Object.keys(TimeZones)}
                        />
                    </Col>
                </Row>
                <Row gutter={theme.default.baseUnit * theme.default.spaces[9]} style={{ width: "100%" }}>
                    <Col xs={12}>
                        <RHFRadioButton
                            control={control}
                            defaultValue={deposition.isVideoRecordingNeeded}
                            errorMessage={depositionErrors?.isVideoRecordingNeeded?.message}
                            name={`depositions[${witnessNumber}].isVideoRecordingNeeded`}
                            label={CONSTANTS.RESCORD_LABEL}
                            options={["YES", "NO"]}
                            infoToolTip={CONSTANTS.RESCORD_TOOLTIP}
                            setValue={setValue}
                        />
                    </Col>
                </Row>
            </Space.Item>
        </Space>
    );
};

export default WitnessItem;
