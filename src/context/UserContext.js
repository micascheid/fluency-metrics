import {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db} from "../FirebaseConfig";
import {collection, doc, getDoc, getDocs, onSnapshot} from "firebase/firestore";
import {BASE_URL, SUBSCRIPTION_STATUS} from "../constants";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [workspacesIndex, setWorkspacesIndex] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const [badHealth, setBadHealth] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const navigate = useNavigate();
    const login = (user) => {
        setUser(user);
    };

    const logout = () => {
        signOut(auth).then(() => {
            navigate('/login');
            setUser(null);
            setRegistrationComplete(false);
        });
        setUser(null);
    };

    const trialValid = (firestoreTime) => {
        const firestoreDate = firestoreTime.toDate();
        const currentDate = new Date();
        return firestoreDate > currentDate;
    }

    const subscriptionCanceledCheck = (subscriptionEpochEnd) => {
        const currentEpochInSeconds = Math.floor(Date.now() / 1000);
        return subscriptionEpochEnd <= currentEpochInSeconds;
    }

    const shouldBlock = async (userId) => {
        // First check if they are individual or organizational
        const subscriptionRef = doc(db, 'users', userId,);
        let block = true;
        try {
            const userSnap = await getDoc(subscriptionRef);
            const subscriptionData = userSnap.data().subscription;
            const trial_valid = trialValid(subscriptionData.trial_end_date);

            if (subscriptionData.subscription_status === SUBSCRIPTION_STATUS.ACTIVE || trial_valid) {
                block = false;
            }
            if (subscriptionData.organization_id) {
                const organRef = doc(db, 'organizations', subscriptionData.organization_id);
                const orgSnap = await getDoc(organRef);
                const orgData = orgSnap.data();
                console.log("ORG DATA:", orgData);
                //Check that they're organization is in good standing and they infact exist
                if (orgData.subscription_status === SUBSCRIPTION_STATUS.ACTIVE && orgData.members.includes(userId)) {
                    block = false;
                }
            }


            if (subscriptionData.subscription_status === SUBSCRIPTION_STATUS.ACTIVE && subscriptionCanceledCheck(subscriptionData.subscription_end_time)) {
                block = true;
                try {
                    await axios.post(`${BASE_URL}/subscription_cancel`, {
                        "userId": userId,
                    })
                } catch (error) {
                    console.log("Unable to reach backend and deactivate user subscription: ", error);
                }
            }
        } catch (error) {
            console.log("trouble fetching subscription info", error);
        }

        return block;
    }

    const checkBackendHealth = async () => {
        const healthCheckRef = doc(db, 'health', 'maintenance');
        try {
            const healthSnap = await getDoc(healthCheckRef);
            const data = healthSnap.data();
            if (data.reason !== "") {
                setBadHealth(data.reason);
            }
        } catch (error) {
            setBadHealth("An issue connecting has occured");
            console.log("HEALTH CHECK ERROR:", error);
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                try {
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userExtended = {
                            ...currentUser,
                            subscription: userData.subscription
                        }
                        setUser(userExtended);

                        const workspacesIndexRef = collection(db, 'users', currentUser.uid, 'workspaces_index');

                        // Setup the real-time listener
                        const unsubscribeSnapshot = onSnapshot(workspacesIndexRef, (snapshot) => {
                            const workspacesIndexTemp = {};
                            snapshot.docs.forEach(doc => {
                                workspacesIndexTemp[doc.id] = doc.data();
                            });
                            setWorkspacesIndex(workspacesIndexTemp);
                        });

                        setIsLoading(false);

                        // Clean up the snapshot listener when the component is unmounted
                        return () => {
                            unsubscribeSnapshot();
                        };
                    } else {
                        navigate('/profile-error')
                    }
                } catch (error) {
                }
            } else {
                navigate('/login');
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    useEffect(() => {
        // This will trigger every time 'user' changes.
        // If necessary, add more dependencies to the dependency array.
        if (registrationComplete) {
            shouldBlock(user.uid).then(result => {
                if (result) {
                    console.log("Should be blocked");
                    setIsBlocked(true);
                }
            });

            checkBackendHealth().then(() => {
                // Handle the result if needed.
            });
        }
    }, [registrationComplete]);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            const unsubscribe = onSnapshot(userRef, (doc) => {
                const userData = doc.data();
                if (userData && userData.subscription) {
                    setRegistrationComplete(true);
                    // Also, you can set other user data here if needed
                } else {
                    setRegistrationComplete(false);
                }
            });

            // Cleanup the listener on component unmount
            return () => unsubscribe();
        }
    }, [user, db]);


    const contextValues = {
        user,
        login,
        logout,
        workspacesIndex: workspacesIndex,
        setWorkspacesIndex: setWorkspacesIndex,
        isLoading,
        setIsLoading,
        isBlocked,
        badHealth,
        setRegistrationComplete
    };

    return (
        <UserContext.Provider value={contextValues}>
            {children}
        </UserContext.Provider>
    )

};