import React, { Fragment } from "react";
import { Divider } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Card from "@rl/prp-components-library/src/components/Card";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ReactComponent as AddIcon } from "../../../assets/general/Add.svg";
import * as CONSTANTS from "../../../constants/createDeposition";
import WitnessItem from "./WitnessItem";

const WitnessesSection = ({
    addWitnessIsEnabled = false,
    shouldValidateDepoDate = false,
}: {
    addWitnessIsEnabled: boolean;
    shouldValidateDepoDate: boolean;
}) => {
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
                <Fragment key={field.id}>
                    <WitnessItem
                        removeWitness={() => remove(index)}
                        deposition={field}
                        witnessNumber={index}
                        shouldValidateDepoDate={shouldValidateDepoDate}
                    />
                    {fields.length > index + 1 && <Divider />}
                </Fragment>
            ))}
            {addWitnessIsEnabled && (
                <Button
                    data-testid={CONSTANTS.ADD_WITNESS_BUTTON_TEST_ID}
                    disabled={fields.length === CONSTANTS.WITNESSES_LIMIT}
                    onClick={handleAddDeposition}
                    type="ghost"
                    icon={<Icon icon={AddIcon} size={8} />}
                >
                    Add Witness
                </Button>
            )}
        </Card>
    );
};

export default WitnessesSection;
