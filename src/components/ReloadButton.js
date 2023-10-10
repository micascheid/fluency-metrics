import {Button} from "@mui/material";


const ReloadButton = () => {

    const handeReload = () => {
        window.location.reload();
    };


    return (
        <Button
            variant={"outlined"}
            onClick={handeReload}
        >
            Refresh
        </Button>
    );
};


export default ReloadButton;