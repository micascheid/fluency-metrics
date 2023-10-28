import MainCard from "../../components/MainCard";
import {Stack, Typography} from "@mui/material";


const ProfileError = () => {


    return (
        <MainCard title={"Hmmmmmmm"}>
            <Typography variant={"h3"} fontWeight={"light"}>We are having trouble with your profile at the moment: For the fastest help, please send "bad profile" to:</Typography>
            <Stack direction={"row"} spacing={2}>
                <Typography variant="h6">
                    Email:
                </Typography>
                <Typography variant="h6">
                    micalinscheid@fluencymetrics.com
                </Typography>
            </Stack>
            <Stack direction={"row"} spacing={2}>
                <Typography variant="h6">
                    Phone:
                </Typography>
                <Typography variant="h6">
                    1-907-942-2446
                </Typography>
            </Stack>
        </MainCard>
    );
};

export default ProfileError;