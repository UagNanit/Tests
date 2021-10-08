import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../base";
import { collection, getDocs } from "firebase/firestore";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Tooltip from "@mui/material/Tooltip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

export default function Question(props) {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleBackToStart = () => {
    history.push(`/`);
    //setOpen(false);
  };

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

  useEffect(() => {
    const dataFromDb = [];
    getDocs(collection(db, props.match.params.id)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        dataFromDb.push({ ...doc.data(), key: doc.id });
        //console.log({ ...doc.data(), key: doc.id });
      });
      setData(dataFromDb);
    });
    //setData(dataFromDb);
    setloadingData(false);
  }, []);

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [rightAnsers, setRightAnsers] = useState(0);
  const maxSteps = data?.length;

  const handleNext = (event) => {
    if (valueAnser === false) {
      return;
    }
    if (valueAnser?.includes("true")) {
      setRightAnsers((prev) => prev + 1);
    }
    setValueAnser(false);
    if (activeStep < maxSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [valueAnser, setValueAnser] = useState(false);
  const handleRadioChange = (event) => {
    setValueAnser(event.target.value);
  };

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

  if (userCon === null) {
    return <Redirect to={`/`} />;
  }

  return (
    <div>
      <h1>Questions {props.match.params.id}</h1>
      <Tooltip title={"Logout"}>
        <Button
          sx={{ margin: 1 }}
          onClick={logout}
          variant="outlined"
          color="error"
        >
          Logout
        </Button>
      </Tooltip>
      <Box sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            height: 70,
            pl: 2,
            bgcolor: "info.main"
          }}
        >
          <Typography sx={{ color: "white" }}>
            {data[activeStep]?.question}
          </Typography>
        </Paper>
        <Box sx={{ height: 355, maxWidth: 500, width: "100%", p: 2 }}>
          <RadioGroup
            aria-label="quiz"
            name="quiz"
            onChange={handleRadioChange}
          >
            {data[activeStep]?.ansers.map((val, i) => {
              return (
                <FormControlLabel
                  key={data[activeStep]?.key + getRandomString(20)}
                  value={
                    val.value === true
                      ? "true" + activeStep
                      : data[activeStep]?.key + i
                  }
                  control={<Radio />}
                  label={val.var}
                />
              );
            })}
          </RadioGroup>
        </Box>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps}
            >
              {activeStep < maxSteps - 1 ? "Next" : "Finish"}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              sx={{
                display: "none"
              }}
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </Box>

      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">Resalts of the test</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Right ansers: ${rightAnsers}, from ${maxSteps} questions`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBackToStart}>Back</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
