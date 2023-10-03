import react, {useContext, useEffect, useRef, useState} from 'react';
import {Box, Button, ButtonBase, Stack, TextField, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";
import {Checkbox, FormControlLabel} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useTheme} from '@mui/material/styles';
import {UserContext} from "../../context/UserContext";
import useStatusMessage from "./custom-hooks/useStatusMessage";

const SaveWorkspace = ({sx}) => {
    const {
        workspaceName,
        setWorkspaceName,
        updateWorkspace,
    } = useContext(StutteredContext);
    const {
        workspacesIndex,
    } = useContext(UserContext);
    const [editWorkspaceName, setEditWorkspaceName] = useState(false);
    const [localName, setLocalName] = useState(workspaceName);
    const theme = useTheme();
    const [isNameError, setIsNameError] = useState(false);
    const [nameError, setNameError] = useState("");

    const statusMessage = useStatusMessage();

    const handleOnClick = () => {
        if (localName.trim() === "") {
            setIsNameError(true);
            return;
        }
        setWorkspaceName(localName);
        updateWorkspace(localName);
    };



    const handleOnChange = (event) => {
        const value = (event.target.value);
        const doesExist = Object.values(workspacesIndex).some(workspace => workspace.name === value);
        if (doesExist){
            setNameError("Name already in use");
        } else {
            setNameError('');
        }
        setLocalName(value);


    }

    const handleKeyPress = (event) => {
        event.stopPropagation();
    };


    useEffect(() => {
        setLocalName(workspaceName);
    }, [workspaceName])




    return (
        <Box sx={sx}>
            <Stack direction={"row"}
                   sx={{
                       alignItems: 'center',
                       justifyContent: 'space-between',  // Add this line
                       width: '100%'                     // Ensure it takes full width
                   }}
                   spacing={1}>
                <Stack direction={"row"} sx={{alignItems: 'center'}} spacing={1}>
                    <Typography variant={"h5"} fontWeight={"medium"}>Current Workspace: </Typography>
                    <TextField
                        required
                        error={isNameError}
                        helperText={isNameError ? "Name this analysis" : ""}
                        disabled={!editWorkspaceName}
                        value={localName}
                        onKeyPress={handleKeyPress}
                        onChange={handleOnChange}
                        label={"Workspace Name"}
                    />
                    <ButtonBase disabled={editWorkspaceName === ''}>
                        <EditIcon
                            sx={{
                                borderRadius: '5px',
                                color: editWorkspaceName ? theme.palette.primary.main : theme.palette.secondary.main,
                                '&:hover': {
                                    color: theme.palette.primary.main
                                }
                            }}
                            onClick={() => setEditWorkspaceName(!editWorkspaceName)}
                        />
                    </ButtonBase>
                </Stack>
            </Stack>
            <Button variant={"outlined"} onClick={handleOnClick} disabled={workspaceName === '' || !!nameError}>
                Save Work
            </Button>
            <Typography
                variant={"body"}
                sx={{color: theme.palette.success.main}}
            >{statusMessage}</Typography>
        </Box>
    );
};
export default SaveWorkspace;