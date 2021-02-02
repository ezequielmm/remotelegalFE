import React from "react";
import { Divider } from "antd";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";
import { ReactComponent as AddIcon } from "../../../assets/general/Add.svg";
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
        <Card fullWidth>
            {fields.map((field, index) => (
                <>
                    <WitnessItem
                        removeWitness={() => remove(index)}
                        key={field.id}
                        deposition={field}
                        witnessNumber={index}
                    />
                    {fields.length > index + 1 && <Divider />}
                </>
            ))}
            <Button
                data-testid="add_witness_button"
                disabled={fields.length === CONSTANTS.WITNESSES_LIMIT}
                onClick={handleAddDeposition}
                type="ghost"
                icon={<Icon icon={AddIcon} style={{ fontSize: "1.225rem" }} />}
            >
                Add Witness
            </Button>
        </Card>
    );
};

export default WitnessesSection;
