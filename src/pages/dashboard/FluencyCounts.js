import React from 'react';
import MainCard from "../../components/MainCard";
import {Stack, Typography} from "@mui/material";


const FluencyCounts = ({ss, nss}) => {

  return (
        <MainCard>
            <Typography variant={"h4"} sx={{pb: 3}}>Fluency Counts</Typography>
            <Stack direction={"column"}>
                <Typography>Stuttered Syllables: {ss}</Typography>
                <Typography>Non-Stuttered Syllables: {nss}</Typography>
            </Stack>
        </MainCard>

  );

};

export default FluencyCounts;