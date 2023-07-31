import React from "react";
import {Box} from "@mui/material";


const ErrorBox = ({errMsg}) => {


    return (
        <Box>{errMsg}</Box>
    )
}

export default ErrorBox;
