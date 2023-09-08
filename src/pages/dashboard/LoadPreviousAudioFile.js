import react, {useContext} from 'react';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";
import {UserContext} from "../../context/UserContext";
import {doc, getDoc} from "firebase/firestore";
import {db} from '../../FirebaseConfig';



const LoadPreviousAudioFile = ({open, setIsLoadingModal, handleFile}) => {
    const {
        updateStateFromObject,
    } = useContext(StutteredContext);
    const {
        user
    } = useContext(UserContext);
    let audioFile;
    let audioFileName;
    const helperText = "Please select the file associated with the workspace you have chosen";

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        display: 'flex',
        justifyContent: 'center'
    }

    const handleFileChange = (event) => {
        event.stopPropagation();

        const file = event.target.files[0];
         if (file) {
             audioFile = file;
             audioFileName = file.name;
         }
    };

    const handleLoadFile = () => {
        const fileObj = {
            audioFile: audioFile,
            audioFileName: audioFileName,
            fileChosen: true
        }
        handleFile(fileObj);
        handleOnClose();

    };

    const handleOnClose = () => {
        setIsLoadingModal(false);
    }


    return (
        <Modal open={open} onClose={handleOnClose}>
            <MainCard style={style}>
                <Stack spacing={2}>
                    <Typography>{helperText}</Typography>
                    <input
                        type={"file"}
                        onChange={handleFileChange}
                    />
                    <Button variant={"contained"} onClick={handleLoadFile}>
                        Done
                    </Button>
                </Stack>

            </MainCard>
        </Modal>
    );
};

export default LoadPreviousAudioFile;