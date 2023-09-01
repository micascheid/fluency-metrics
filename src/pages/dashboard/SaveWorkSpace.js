import react, {useContext, useState} from 'react';
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";
import {Checkbox, FormControlLabel} from "@mui/material";

const SaveWorkSpace = () => {
    const [editWorkspaceName, setEditWorkspaceName] = useState(false);
    const [localName, setLocalName] = useState('');
    const {
        saveWorkspace,
        workspaceName,
        setWorkspaceName,
    } = useContext(StutteredContext);
    const [isNameError, setIsNameError] = useState(false);

    const handleOnClick = () => {
        // save_data but pass name in instead and setworkspaceName after db transaction
        // saveWorkspace(localName);
        if (localName.trim() === "") {
            setIsNameError(true);
            return;
        }
        console.log("saving work process");
        if (localName === workspaceName) {
            saveWorkspace();
        } else {
            setWorkspaceName(localName);
        }
    };

    const handleOnChange = (event) => {
        setLocalName(event.target.value);
    }

    const handleKeyPress =(event) => {
        event.stopPropagation();
    };


    return (
        <MainCard>
            <Box>
                <Stack direction={"row"} sx={{alignItems:'center'}} spacing={1}>
                    <Typography variant={"h3"}>Current Work Space: </Typography>
                    <TextField
                        required
                        error={isNameError}
                        helperText={isNameError ? "Name this analysis" : ""}
                        disabled={!editWorkspaceName}
                        value={workspaceName}
                        onKeyPress={handleKeyPress}
                        onChange={handleOnChange}
                        label={"Workspace Name"}
                    />
                    <FormControlLabel control={
                        <Checkbox label={"Edit Name"} checked={editWorkspaceName} onChange={() => setEditWorkspaceName(!editWorkspaceName)}/>
                    } label={"Edit Name"}/>
                </Stack>
                <Button variant={"contained"} onClick={handleOnClick}>
                    Save Work
                </Button>
            </Box>
        </MainCard>
    );
};
export default SaveWorkSpace;