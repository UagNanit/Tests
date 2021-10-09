import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../context";
import { getAuth, signOut } from "firebase/auth";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ModalStartTest from "./ModalStartTest";
import Modal from "@mui/material/Modal";

import { app, db } from "../base";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where
} from "firebase/firestore";

export default function Start(props) {
  const auth = getAuth();
  const { userCon, setUserCon } = useContext(AuthContext);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUserCon(null);
        // Sign-out successful.
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const [data, setData] = useState([]);
  const [loadingData, setloadingData] = useState(true);
  const [testList, setTestList] = useState([]);

  useEffect(() => {
    const temp = [];
    const docRef = doc(db, "Users", userCon.reloadUserInfo.email);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        docSnap.data().tests.forEach((el) => {
          temp.push(el);
        });
        console.log(docSnap.data().tests);
      }
    });

    const dataFromDb = [];
    getDocs(collection(db, "testList")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        dataFromDb.push({ ...doc.data(), key: doc.id });
        //console.log({ ...doc.data(), key: doc.id });
      });

      setTestList(
        dataFromDb.map((val) => {
          if (temp.includes(val.name)) {
            return (
              <FormControlLabel
                key={val.key}
                value={val.key}
                control={<Radio />}
                label={val.name}
              />
            );
          }
        })
      );
    });
    setData(dataFromDb);
    setloadingData(false);
  }, []);

  const [value, setValue] = useState({
    name: "",
    description: "",
    key: "",
    open: false
  });
  const handleRadioChange = (event) => {
    const result = data.filter((el) => el.key === event.target.value);
    setValue({
      name: result[0].name,
      description: result[0].description,
      key: result[0].key,
      open: false
    });
  };

  const handleSubmit = (event) => {
    setValue({
      name: value.name,
      description: value.description,
      key: value.key,
      open: true
    });
    console.log(value);
    event.preventDefault();
  };

  const handClose = () => {
    setValue({
      name: value.name,
      description: value.description,
      key: value.key,
      open: false
    });
  };

  if (userCon === null || userCon?.uid !== props.match.params.id) {
    return <Redirect to={`/`} />;
  }

  if (loadingData) {
    return (
      <div>
        <h1>Loading ...</h1>
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
    <div>
      <h1>List of tests</h1>
      <Tooltip title={"Logout"}>
        <Button onClick={logout} variant="outlined" color="error">
          Logout
        </Button>
      </Tooltip>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" variant="standard">
          <FormLabel style={{ fontSize: 22 }} component="legend">
            Select test
          </FormLabel>

          <RadioGroup
            aria-label="quiz"
            name="quiz"
            //value={value}
            onChange={handleRadioChange}
          >
            {testList}
          </RadioGroup>

          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Start
          </Button>
        </FormControl>
      </form>
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={value.open}
        children={
          <ModalStartTest
            name={value.name}
            description={value.description}
            testKey={value.key}
            close={handClose}
          />
        }
      ></Modal>
    </div>
  );
}
