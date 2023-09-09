import {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db} from "../FirebaseConfig";
import {collection, getDocs} from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [workspacesIndex, setWorkspacesIndex] = useState({});
    const [isLoading, setIsLoading] = useState(true);
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

                setWorkspacesIndex(workspacesIndexTemp);
                setIsLoading(false);
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
    };

    return (
        <UserContext.Provider value={contextValues}>
            {children}
        </UserContext.Provider>
    )

};