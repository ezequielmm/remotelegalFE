import React, { ReactElement, useState } from "react";
import { Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import Column from "antd/lib/table/Column";
import Space from "../../../components/Space";
import Table from "../../../components/Table";
import Card from "../../../components/Card";
import Text from "../../../components/Typography/Text";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import { MAX_PARTICIPANTS_ALLOWED } from "../../../constants/otherParticipants";
import * as CONSTANTS from "../../../constants/otherParticipants";
import OtherParticipantsModal from "./OtherParticipantsModal";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import Icon from "../../../components/Icon";
import OtherParticipantsEmptySection from "./OtherParticipantsEmptySection";
import ColorStatus from "../../../types/ColorStatus";

export default function OtherParticipantsSection(): ReactElement {
    const [openOtherParticipants, setOpenOtherParticipants] = React.useState(false);
    const [currentOtherParticipant, setCurrentOtherParticipant] = useState(null);
    const [currentOtherParticipantIndex, setCurrentOtherParticipantIndex] = useState(-1);
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const { control } = useFormContext();
    const { append, insert, remove, fields } = useFieldArray({ control, name: "otherParticipants" });

    const onAddOtherParticipant = (data, isEditing = false) => {
        if (!isEditing) {
            append(data);
        } else {
            remove(currentOtherParticipantIndex);
            insert(currentOtherParticipantIndex, data);
        }
        setCurrentOtherParticipant(null);
    };

    const onRemoveOtherParticipant = () => {
        remove(currentOtherParticipantIndex);
        setOpenOtherParticipants(false);
        setCurrentOtherParticipant(null);
    };

    const onEditOtherParticipant = (item, index) => {
        setEditMode(true);
        setDeleteMode(false);
        setOpenOtherParticipants(true);
        setCurrentOtherParticipant(item);
        setCurrentOtherParticipantIndex(index);
    };

    const onRemoveParticipant = (index: number) => {
        setDeleteMode(true);
        setEditMode(false);
        setOpenOtherParticipants(true);
        setCurrentOtherParticipantIndex(index);
    };

    const onAddParticipant = () => {
        setDeleteMode(false);
        setEditMode(false);
        setCurrentOtherParticipant(null);
        setOpenOtherParticipants(true);
    };

    return (
        <>
            <OtherParticipantsModal
                handleClose={() => {
                    setCurrentOtherParticipant(null);
                    setOpenOtherParticipants(false);
                }}
                open={openOtherParticipants}
                handleSubmitParticipants={onAddOtherParticipant}
                handleRemoveParticipant={onRemoveOtherParticipant}
                currentParticipant={currentOtherParticipant}
                editMode={editMode}
                deleteMode={deleteMode}
            />
            <Card fullWidth>
                <Space direction="vertical" size="middle" fullWidth>
                    <Space.Item fullWidth>
                        <Title level={5} weight="regular" dataTestId="other_participants_title">
                            {CONSTANTS.OTHER_PARTICIPANTS_SECTION_TITLE}
                        </Title>
                        <Text state={ColorStatus.disabled} ellipsis={false}>
                            {CONSTANTS.OTHER_PARTICIPANTS_SECTION_SUBTITLE}
                        </Text>
                    </Space.Item>
                    <Table
                        data-testid="add_participants_table"
                        style={{ width: "100%" }}
                        locale={{
                            emptyText: <OtherParticipantsEmptySection />,
                        }}
                        rowKey="email"
                        dataSource={fields}
                        pagination={false}
                    >
                        <Column
                            width="23%"
                            title={CONSTANTS.OTHER_PARTICIPANTS_COLUMNS_TITLES[0]}
                            dataIndex="email"
                            key="email"
                        />
                        <Column
                            width="25%"
                            title={CONSTANTS.OTHER_PARTICIPANTS_COLUMNS_TITLES[1]}
                            dataIndex="name"
                            key="name"
                        />
                        <Column
                            width="20%"
                            title={CONSTANTS.OTHER_PARTICIPANTS_COLUMNS_TITLES[2]}
                            dataIndex="phone"
                            key="phone"
                        />
                        <Column
                            width="20%"
                            title={CONSTANTS.OTHER_PARTICIPANTS_COLUMNS_TITLES[3]}
                            dataIndex="role"
                            key="role"
                        />
                        <Column
                            align="right"
                            width="12%"
                            render={(item, data, index) => {
                                return (
                                    <Space size="large">
                                        {/* TODO add size property to Icon component */}
                                        <Button
                                            type="link"
                                            data-testid="other_participant_section_edit_button"
                                            onClick={() => onEditOtherParticipant(item, index)}
                                        >
                                            <Icon icon={EditIcon} size={8} />
                                        </Button>
                                        <Button
                                            type="link"
                                            onClick={() => onRemoveParticipant(index)}
                                            data-testid="delete_participants_modal_prompt"
                                        >
                                            <Icon icon={DeleteIcon} size={8} />
                                        </Button>
                                    </Space>
                                );
                            }}
                        />
                    </Table>
                    <Button
                        disabled={fields.length >= MAX_PARTICIPANTS_ALLOWED}
                        data-testid="show_modal_add_participants_button"
                        type="ghost"
                        onClick={onAddParticipant}
                        icon={<PlusOutlined />}
                    >
                        {CONSTANTS.OTHER_PARTICIPANTS_ADD_BUTTON_LABEL}
                    </Button>
                </Space>
                <Row style={{ width: "100%" }}>
                    {fields.map((item, index) => {
                        return (
                            <div key={item.id}>
                                <Controller
                                    as={<input type="hidden" />}
                                    name={`otherParticipants[${index}].email`}
                                    control={control}
                                    defaultValue={item.email}
                                />
                                <Controller
                                    as={<input type="hidden" />}
                                    name={`otherParticipants[${index}].name`}
                                    control={control}
                                    defaultValue={item.name}
                                />
                                <Controller
                                    as={<input type="hidden" />}
                                    name={`otherParticipants[${index}].phone`}
                                    control={control}
                                    defaultValue={item.phone}
                                />
                                <Controller
                                    as={<input type="hidden" />}
                                    name={`otherParticipants[${index}].role`}
                                    control={control}
                                    defaultValue={item.role}
                                />
                            </div>
                        );
                    })}
                </Row>
            </Card>
        </>
    );
}
