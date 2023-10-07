import {useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// third party
import * as Yup from 'yup';
import {Formik} from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import {strengthColor, strengthIndicator} from 'utils/password-strength';

// assets
import {EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons';

// firebase auth
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {initializeApp} from "firebase/app";
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";
import {db, auth} from "../../../FirebaseConfig";
import {useTheme} from "@mui/material/styles";
import OrganizationCodeInfo from "../../dashboard/modals/OrganizationCodeInfo";
import {UserContext} from "../../../context/UserContext";

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
    const {setRegistrationComplete} = useContext(UserContext);
    const navigate = useNavigate();
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isShowOrgInfoModal, setIsShowOrgInfoModal] = useState(false);
    const theme = useTheme();

    //
    // const firestoreTimestamp = serverTimestamp();
    const trialPeriod = 30
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialStartDate.getDate() + trialPeriod);


    const subscription_info = {
        subscription_status: "trial",
        trial_start_date: trialStartDate,
        trial_end_date: trialEndDate,
        subscription_end_time: "",
        organization_id: "",
        stripe_id: "",
        subscription_type: 1,
    }

    const addUserIfNotExists = async (userId, userData) => {
        const userRef = doc(db, 'users', `${userId}`)
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()){
            await setDoc(userRef, {subscription: userData});
        } else {
            console.log("user already exists")
        }
    };

    const handleOrgInfo = () => {
        setIsShowOrgInfoModal(true);
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    const handleRegistration = async (values) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: values.displayname,
                photoURL: ''
            });

            setIsRegistering(true);

            await addUserIfNotExists(user.uid, subscription_info);
            setRegistrationComplete(true);
            navigate('/tool');
        } catch (error) {
            console.error("Error during registration:", error);
            // Handle or display the error to the user.
        }
    };

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            {isShowOrgInfoModal &&
                <OrganizationCodeInfo setIsShow={setIsShowOrgInfoModal} />
            }
            <Formik
                initialValues={{
                    displayname: '',
                    email: '',
                    company: '',
                    password: '',
                    submit: null,
                    organizationCode: '',
                }}
                validationSchema={Yup.object().shape({
                    displayname: Yup.string().max(255).required('First Name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    organizationCode: Yup.string().max(50)
                })}
                onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                    setStatus({success: false});
                    setSubmitting(false);

                    await handleRegistration(values);

                    // createUserWithEmailAndPassword(auth, values.email, values.password)
                    //     .then((userCredential) => {
                    //         const user = userCredential.user;
                    //         updateProfile(user, {
                    //             displayName: values.displayname, photoURL: ''
                    //         }).then(() => {
                    //             setIsRegistering(true);
                    //
                    //             addUserIfNotExists(user.uid, subscription_info).then(() => {
                    //                 navigate('/');
                    //             });
                    //         })
                    //     })
                    //     .catch((error) => {
                    //         const errorCode = error.code;
                    //         const errorMessage = error.message;
                    //         console.error(errorCode);
                    //         console.error(errorMessage);
                    //         setStatus({success: false});
                    //         setErrors({submit: error.message});
                    //         setSubmitting(false);
                    //         setIsRegistering(false);
                    //     })

                }
                }
            >
                {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="displayname-signup">Display Name*</InputLabel>
                                    <OutlinedInput
                                        id="displayname-login"
                                        type="displayname"
                                        value={values.displayname}
                                        name="displayname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={"Amazing SLP"}
                                        fullWidth
                                        error={Boolean(touched.displayname && errors.displayname)}
                                    />
                                    {touched.displayname && errors.displayname && (
                                        <FormHelperText error id="helper-text-displayname-signup">
                                            {errors.displayname}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={"AmazingSLP@email.com"}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="helper-text-email-signup">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                            <Stack spacing={1}>
                                <Stack direction={"row"} sx={{alignItems: 'center'}} spacing={1}>
                                    <Tooltip title={"Don't pay?"}>
                                        <IconButton onClick={handleOrgInfo}>
                                            <InfoIcon sx={{color: theme.palette.primary.main}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <InputLabel htmlFor="organizationCode-signup">Organization Code (Optional)</InputLabel>
                                </Stack>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(touched.organizationCode && errors.organizationCode)}
                                    id="organizationCode-signup"
                                    type="text"
                                    value={values.organizationCode}
                                    name="organizationCode"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter your organization code"
                                />
                                {touched.organizationCode && errors.organizationCode && (
                                    <FormHelperText error id="helper-text-organizationCode-signup">
                                        {errors.organizationCode}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-signup"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="******"
                                        inputProps={{}}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="helper-text-password-signup">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Stack>
                                <FormControl fullWidth sx={{mt: 2}}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box sx={{
                                                bgcolor: level?.color,
                                                width: 85,
                                                height: 8,
                                                borderRadius: '7px'
                                            }}/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    By Signing up, you agree to our &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Terms of Service
                                    </Link>
                                    &nbsp; and &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        disabled={isRegistering || Boolean(!touched.email)}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        {isRegistering ? 'Creating Account' : 'Create Account'}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthRegister;
