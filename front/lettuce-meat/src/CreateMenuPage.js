import MiniDrawer from "./utils/MiniDrawer";
import MenuPres from "./utils/MenuPres";

import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

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
  question2: {
    fontFamily: "Roboto",
    fontSize: "23px",
    fontWeight: "600",
  },
  kcal: {
    paddingTop: "20px"
  },
  menus: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  previous: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default function CreateMenuPage() {
  const classes = useStyles();
  var isMenu = false;
  var menuKcal = 0.0;

  const [state, setState] = useState({
    breakfast: false,
    snack: false,
    lunch: false,
    dinner: false,
    supper: false,
  });
  const [menu, setMenu] = useState([]);
  const [previousMenus, setPreviousMenus] = useState([]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    generatePrevious();
  }, [])

  const { breakfast, snack, lunch, dinner, supper } = state;
  const error =
    [breakfast, snack, lunch, dinner, supper].filter((v) => v).length < 2;

  const generate = () => {
    let meals = [];
    for(let meal in state) {
      if(state[meal]) meals.push(meal);
    }
    
    fetch('http://localhost:5000/menu', {
      method: 'POST',
      body: JSON.stringify({
        meals,
        kcal: document.querySelector('#kcal').value,
        username: window.sessionStorage.getItem('login')
      }),
      headers: {
        Authorization: "Basic YWRtMW46U2VjdXJlUGFzcw==",
        "Content-Type": "application/json",
      },
    }).then(info => info.json())
    .then(resp => { 
      for(let recipe of resp.msg.recipes) {
        menuKcal += parseFloat(recipe.kcal);
      }
      setMenu(resp.msg.recipes);
      isMenu = true;
      generatePrevious();
    })
  }

  const generatePrevious = () => {
    fetch('http://localhost:5000/menu', {
      method: 'GET',
      headers: {
        Authorization: "Basic YWRtMW46U2VjdXJlUGFzcw==",
        "Content-Type": "application/json",
        "x-user": window.sessionStorage.getItem("login")
      },
    }).then(resp => resp.json())
    .then(info => {
      let menus = info.msg.filter(menu => {
        let kcal = 0.0;
        for(let recipe of menu) {
          kcal += parseFloat(recipe.kcal);
        }
        return kcal !== menuKcal;
      });
      
      if (isMenu) {
        setPreviousMenus(menus.slice(-3).reverse().slice(-2))
      } else {
        setPreviousMenus(menus.slice(-4).reverse().slice(-3))
      }
    });
  }

  return (
    <MiniDrawer
      content={
        <div className="content">
          <div className={classes.menuInfo}>
            <div className={classes.half}>
              <Typography className={classes.question}>
                1. Choose meal types:
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
              <div className={classes.kcal}>
                <TextField id="kcal" label="Calories" variant="filled" required/>
              </div>
            </div>
          </div>
          <Button variant="contained" color="primary" size="large" onClick={generate}>
            Generate menu
          </Button>
          <div className={classes.menus}>
            {menu.length ? <MenuPres recipes={menu} /> : null}
            <br />
            <div className={classes.previous}>
              <Typography className={classes.question2}>
                Previous menus:
              </Typography>
              {previousMenus.length 
              ? previousMenus.map(menu => (<MenuPres recipes={menu} key={Math.random()}/>))
              : console.log('problem')}
            </div>
          </div>
        </div>
      }
    />
  );
}
