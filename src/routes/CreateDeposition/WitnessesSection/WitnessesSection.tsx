import { PlusOutlined } from "@ant-design/icons";
import { Col } from "antd";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import * as CONSTANTS from "../../../constants/createDeposition";
import WitnessItem from "./WitnessItem";

const WitnessesSection = () => {
    const { errors, control, trigger } = useFormContext();
    const { append, fields, remove } = useFieldArray({ control, name: "depositions" });

    const handleAddDeposition = async () => {
        await trigger("depositions");
        if (errors.depositions) return;
        append(CONSTANTS.DEPOSITION_DEFAULT_VALUE);
    };

    return (
        <Card>
            {fields.map((field, index) => (
                <WitnessItem
                    removeWitness={() => remove(index)}
                    key={field.id}
                    deposition={field}
                    witnessNumber={index}
                />
            ))}
            <Col xs={24}>
                <Button
                    data-testid="add_witness_button"
                    disabled={fields.length === CONSTANTS.WITNESSES_LIMIT}
                    onClick={handleAddDeposition}
                    type="ghost"
                    icon={<PlusOutlined />}
                >
                    Add Witness
                </Button>
            </Col>
        </Card>
    );
};

export default WitnessesSection;
