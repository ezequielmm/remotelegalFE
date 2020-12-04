import React from "react";
import { Col } from "antd";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import WitnessItem from "./WitnessItem";

const WitnessesSection = () => {
    const { control } = useFormContext();
    const { append, fields } = useFieldArray({ control, name: "depositions" });
    return (
        <Card>
            {fields.map((field, index) => (
                <WitnessItem key={field.id} deposition={field} witnessNumber={index} />
            ))}
            <Col xs={24}>
                <Button disabled htmlType="submit" onClick={() => append({})} type="primary">
                    Add Witness
                </Button>
            </Col>
        </Card>
    );
};

export default WitnessesSection;
