import {forwardRef, useEffect} from 'react';
import {Box, Typography, styled} from "@mui/material";


const StyledBox = styled(Box)({
    display: 'none',
    '@media print': {
        display: 'block'
    }

});

const PrintOut = forwardRef((props, ref) => {
    console.log("RENDER PRINT OUT");
    return (
        <StyledBox ref={ref} >
            <Typography>Re-organized components go here</Typography>
        </StyledBox>
    );
});

export default PrintOut;