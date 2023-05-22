import logo from './logo.svg';
import './App.css';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import Routes from './routes';
import UserContext from "./context/UserContext";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {signOut, onAuthStateChanged,} from "firebase/auth";
import {auth} from './FirebaseConfig';

const App = () => {
    const [user, setUser] = useState(null);
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
  return (
      <UserContext.Provider value={{user, login, logout}}>
          <ThemeCustomization>
              <ScrollTop>
                  <Routes />
              </ScrollTop>
          </ThemeCustomization>
      </UserContext.Provider>

  )

};

export default App;
