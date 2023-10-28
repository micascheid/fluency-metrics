import {useState, useEffect} from "react";
import logo from './logo.svg';
import './App.css';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import Routes from './routes';
import {UserContext} from "./context/UserContext";
import {useNavigate} from "react-router-dom";
import {signOut, onAuthStateChanged,} from "firebase/auth";
import {auth} from './FirebaseConfig';
import {UserProvider} from "./context/UserContext";
import {ToolProvider} from "./context/ToolContext";
import {StutteredProvider} from "./context/StutteredContext";

const App = () => {



  return (
      <UserProvider>
          <ThemeCustomization>
              <ScrollTop>
                  <ToolProvider>
                      <StutteredProvider>
                          <Routes />
                      </StutteredProvider>
                  </ToolProvider>
              </ScrollTop>
          </ThemeCustomization>
      </UserProvider>

  )

};

export default App;
