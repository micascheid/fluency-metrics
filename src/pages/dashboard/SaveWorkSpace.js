import react, {useContext} from 'react';
import {Box, Button} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const SaveWork = () => {
    const {
        saveWork
    } = useContext(StutteredContext);

    return (
        <Box>
            <Button variant={"contained"} onClick={saveWork}>
                Save Work
            </Button>
        </Box>
    );
};
export default SaveWork;