import MiniDrawer from "./utils/MiniDrawer";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import "./App.css";
import "./recipe.css";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  menuInfo: {
    width: "100%",
    display: "flex",
  },
  half: {
    width: "50%",
    backgroundColor: "#e7e7e7",
    margin: "20px",
    borderRadius: "10px",
    border: "solid 3px #d0d0d0",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    padding: "5px",
    paddingLeft: "30px",
  },
  question: {
    fontFamily: "Roboto",
    fontSize: "25px",
    fontWeight: "600",
  },
});

export default function CreateMenuPage() {
  const classes = useStyles();

  const [state, setState] = useState({
    breakfast: false,
    snack: false,
    lunch: false,
    dinner: false,
    supper: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { breakfast, snack, lunch, dinner, supper } = state;
  const error =
    [breakfast, snack, lunch, dinner, supper].filter((v) => v).length < 2;

  return (
    <MiniDrawer
      content={
        <div className="content">
          <div className={classes.menuInfo}>
            <div className={classes.half}>
              <Typography className={classes.question}>
                1. Choose wanted meal types:
              </Typography>
              <FormControl
                required
                error={error}
                component="fieldset"
                className={classes.formControl}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={breakfast}
                        onChange={handleChange}
                        name="breakfast"
                      />
                    }
                    label="Breakfast"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={snack}
                        onChange={handleChange}
                        name="snack"
                      />
                    }
                    label="Snack"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={lunch}
                        onChange={handleChange}
                        name="lunch"
                      />
                    }
                    label="Lunch"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dinner}
                        onChange={handleChange}
                        name="dinner"
                      />
                    }
                    label="Dinner"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={supper}
                        onChange={handleChange}
                        name="supper"
                      />
                    }
                    label="Supper"
                  />
                </FormGroup>
                {error ? (
                  <FormHelperText>Pick more than one!</FormHelperText>
                ) : null}
              </FormControl>
            </div>
            <div className={classes.half}>
              <Typography className={classes.question}>
                2. How many calories do you need?
              </Typography>
            </div>
          </div>
          <Button variant="contained" color="primary" size="large">
            Generate menu
          </Button>
        </div>
      }
    />
  );
}
