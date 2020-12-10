import React from "react";
import moment from "moment-timezone";
import { Row, Col, Space } from "antd";
import { ArrayField, useFormContext } from "react-hook-form";
import ButtonUpload from "../../../../components/ButtonUpload";
import Icon from "../../../../components/Icon";
import RHFDatePicker from "../../../../components/RHFDatePicker";
import RHFInput from "../../../../components/RHFInput";
import RHFRadioButton from "../../../../components/RHFRadioButton/RHFRadioButton";
import RHFSelect from "../../../../components/RHFSelect";
import RHFTimePicker from "../../../../components/RHFTimePicker";
import RHFUploadFile from "../../../../components/RHFUploadFile";
import Text from "../../../../components/Typography/Text";
import Title from "../../../../components/Typography/Title";
import * as CONSTANTS from "../../../../constants/createDeposition";
import { theme } from "../../../../constants/styles/theme";
import { DeleteWitnessButton, SectionRow, WitnessTitleContainer } from "../../styles";
import { ReactComponent as DeleteIcon } from "../../../../assets/general/Delete.svg";

interface WitnessItemProps {
    deposition: Partial<ArrayField<Record<string, any>>>;
    removeWitness: () => void;
    witnessNumber?: number;
}

const WitnessItem = ({ deposition, removeWitness, witnessNumber }: WitnessItemProps) => {
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
        return (
            current &&
            (current.isBefore(moment().startOf("day")) || current.isAfter(moment().startOf("day").add(1, "y")))
        );
    };

    return (
        <SectionRow separator>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Col xs={24}>
                    <WitnessTitleContainer data-testid="witness_title">
                        <Title level={5} weight="regular">
                            {`${CONSTANTS.WITNESS_TITLE} ${witnessNumber + 1}`}
                        </Title>
                        {witnessNumber > 0 && (
                            <DeleteWitnessButton
                                type="link"
                                onClick={removeWitness}
                                data-testid="witness_delete_button"
                                icon={<Icon icon={DeleteIcon} style={{ fontSize: "1.225rem" }} />}
                            >
                                Delete witness
                            </DeleteWitnessButton>
                        )}
                    </WitnessTitleContainer>
                    <Text state="disabled" ellipsis={false}>
                        {CONSTANTS.WITNESS_SUBTITLE}
                    </Text>
                </Col>
                <Col xs={24}>
                    <Row gutter={theme.default.baseUnit * theme.default.spaces[5]} style={{ width: "100%" }}>
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
                    <Row gutter={theme.default.baseUnit * theme.default.spaces[5]} style={{ width: "100%" }}>
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
                                control={control}
                                defaultValue={deposition.startTime}
                                timePickerProps={CONSTANTS.TIME_PICKER_PROPS}
                                errorMessage={depositionErrors?.startTime?.message}
                                name={`depositions[${witnessNumber}].startTime`}
                                label={CONSTANTS.START_LABEL}
                                placeholder={CONSTANTS.START_PLACEHOLDER}
                            />
                        </Col>
                        <Col xs={5}>
                            <RHFTimePicker
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
                                control={control}
                                defaultValue={deposition.timeZone}
                                errorMessage={depositionErrors?.timeZone?.message}
                                name={`depositions[${witnessNumber}].timeZone`}
                                label={CONSTANTS.TIME_ZONE_LABEL}
                                placeholder={CONSTANTS.TIME_ZONE_PLACEHOLDER}
                                items={["EST", "CST", "MST", "PST"]}
                            />
                        </Col>
                    </Row>
                    <Row gutter={theme.default.baseUnit * theme.default.spaces[5]} style={{ width: "100%" }}>
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
                </Col>
            </Space>
        </SectionRow>
    );
};

export default WitnessItem;
