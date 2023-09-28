import {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db} from "../FirebaseConfig";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [workspacesIndex, setWorkspacesIndex] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const navigate = useNavigate();
    const login = (user) => {
        setUser(user);
    };

    const logout = () => {
        signOut(auth).then(() => {
            navigate('/login');
        });
        setUser(null);
    };

    const trialValid = (firestoreTime) => {
        const firestoreDate = firestoreTime.toDate();
        const currentDate = new Date();
        return firestoreDate > currentDate;
    }

    const shouldBlock = async (userId) => {
        // First check if they are individual or organizational
        const subscriptionRef = doc(db, 'users', userId,);
        let block = true;
        try {
            const userSnap = await getDoc(subscriptionRef);
            const subscriptionData = userSnap.data().subscription;
            const trial_valid = trialValid(subscriptionData.trial_end_date);

            if (subscriptionData.subscription_status === "active" || trial_valid) {
                block = false;
            }
            if (subscriptionData.organization_id) {
                const organRef = doc(db, 'organizations', subscriptionData.organization_id);
                const orgSnap = await getDoc(organRef);
                const orgData = orgSnap.data();
                console.log("ORG DATA:", orgData);
                //Check that they're organization is in good standing and they infact exist
                if (orgData.subscription_status === "active" && orgData.members.includes(userId)){
                    block = false;
                }
            }
        } catch (error) {
            console.log("trouble fetching subscription info", error);
        }

        return block;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        const signedIn = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const workspacesIndexTemp = {};
                const workspacesIndexRef = collection(db, 'users', currentUser.uid, 'workspaces_index');
                const workspacesIndexDocs = await getDocs(workspacesIndexRef);
                workspacesIndexDocs.docs.forEach((doc) => {
                    workspacesIndexTemp[doc.id] = doc.data();
                });
                await delay(1000);
                setWorkspacesIndex(workspacesIndexTemp);
                setIsLoading(false);
                if (await shouldBlock(currentUser.uid)) {
                    console.log("Should be blocked");
                    setIsBlocked(true);
                }
            } else {
                navigate('/login');
            }
        });
        return () => {
            signedIn();
        };
    }, []);


    const contextValues = {
        user,
        login,
        logout,
        workspacesIndex: workspacesIndex,
        setWorkspacesIndex: setWorkspacesIndex,
        isLoading,
        setIsLoading,
        isBlocked,
    };

    return (
        <UserContext.Provider value={contextValues}>
            {children}
        </UserContext.Provider>
    )

};