import react, {useContext, useEffect, useState} from 'react';
import {Box, Button, ButtonBase, Stack, TextField, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";
import {Checkbox, FormControlLabel} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useTheme} from '@mui/material/styles';
import {UserContext} from "../../context/UserContext";

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
        console.log("VALUE:", workspacesIndex);
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
            <Stack direction={"row"} sx={{alignItems: 'center'}} spacing={1}>
                <Button variant={"contained"} onClick={handleOnClick} disabled={workspaceName === '' || !!nameError}>
                    Save Work
                </Button>
                <Typography variant={"h4"} fontWeight={"lighter"}>Current Analysis: </Typography>
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
                <ButtonBase disabled={editWorkspaceName === ''} disableRipple>
                    <EditIcon sx={editWorkspaceName ? {color: theme.palette.primary.main} : {color: theme.palette.secondary.main}}
                              onClick={() => setEditWorkspaceName(!editWorkspaceName)}
                    />
                </ButtonBase>
            </Stack>

        </Box>
    );
};
export default SaveWorkspace;