import react, {useState} from 'react';
import {Box, Button, Popover, Stack, Typography} from "@mui/material";



const AddTextPopover = ({leftId, rightId, setAnchorEl, anchorEl,}) => {

    const handleClose = (event) => {
        event.stopPropagation();
        console.log("HANDLING ADDTEXTPOPOVER CLICK");
        setAnchorEl(null);
    }
    return (
        <Popover
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorEl={anchorEl}
        >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Stack>
                    <Typography>Under construction...</Typography>
                    <Button variant={"contained"} onClick={handleClose}>
                        Done
                    </Button>
                </Stack>

            </Box>

        </Popover>
    );
};

export default AddTextPopover;