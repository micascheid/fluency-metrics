import {styled, TextField} from "@mui/material";



const CustomWordInput = styled(TextField)(({theme}) => ({
    ...theme.typography.h5,
    '& input': {
        textAlign: 'center',
    },

}));

const CustomSyllableInput = styled(TextField)(({theme}) => ({
    ...theme.typography.body1,
    width: '55px',
    '& input': {
        textAlign: 'center',
    },
}));

const dividerStyles = {
    "&::before, &::after": {
        borderColor: "lightgray",
    },
    pt: 1,
    pb: 1,
}

export {dividerStyles, CustomWordInput, CustomSyllableInput};