import "./styles.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthContext } from "./context";
import Start from "./components/Start";
import Question from "./components/Question";
import Authnt from "./components/Authnt";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { app, db } from "./base";

import {
  getAuth,
  //signInWithCustomToken,
  onAuthStateChanged
} from "firebase/auth";

//import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

export default function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(true);

  /*useEffect(() => {
    storeCPlusPlus.questions.forEach(async (element) => {
      const docRef = await addDoc(collection(db, storeCPlusPlus.name), element);
      console.log("Document written with ID: ", docRef.id);
    });
  }, []);*/

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      setUser(userAuth);
      setPending(false);
    });
  });

  if (pending) {
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        userCon: user,
        setUserCon: (val) => setUser(val)
      }}
    >
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <Authnt />
            </Route>
            <Route
              exact
              path="/start/:id"
              render={(props) => <Start {...props} />}
            />
            <Route
              exact
              path="/question/:id"
              render={(props) => <Question {...props} />}
            />
            <Route children={() => <h1>404 page</h1>} />
          </Switch>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}
