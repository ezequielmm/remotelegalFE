import React from "react"
import style from "styled-components"
import { Button } from "antd"
import "antd/dist/antd.css"

interface Props {
    
}

export const AntButton = (props: Props) => {
    return (
        <Button type="primary">
            Ant primary button
        </Button>
    )
}
