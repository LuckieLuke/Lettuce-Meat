import MiniDrawer from "./utils/MiniDrawer";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import "./App.css";
import "./recipe.css";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  recipe: {
    padding: "20px",
    border: "1px solid #3f51b5",
    borderRadius: "5px",
    width: "100%",
    fontSize: "18px",
    fontFamily: "Roboto",
  },
  full: {
    display: "flex",
    justifyContent: " center",
    alignItems: "center",
    flexDirection: "column",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    justifyContent: " flex-start",
  },
  paper: {
    float: "left",
  },
});

export default function RecipePage() {
  const classes = useStyles();
  const [info, setInfo] = useState({ msg: "recipe not found" });

  useEffect(() => {
    fetch(
      `http://localhost:5000/recipe/${window.location.pathname.split("/")[2]}`
    )
      .then((resp) => resp.json())
      .then((info) => setInfo(info));
  }, []);

  let generateIngredients = () => {
    let els = info.msg.ingredients.map((item, idx) => {
      return (
        <li key={idx}>
          {item.name} ({item.amount}
          {item.unit})
        </li>
      );
    });

    return <ul className="ing">{els}</ul>;
  };

  return (
    <MiniDrawer
      content={
        <div className="content">
          {info.msg === "recipe not found" ? (
            <h1>Recipe not found</h1>
          ) : (
            <div className={classes.full}>
              <h1>
                {info.msg.name} ({info.msg.type})
              </h1>
              <img
                src={info.msg.image}
                alt={info.msg.name}
                style={{
                  height: "300px",
                  borderRadius: "15px",
                  boxShadow: "10px 10px 50px #ccc",
                }}
              />
              <br />
              <br />
              <Paper elevation={3} className={classes.paper}>
                <div>{generateIngredients()}</div>
              </Paper>
              <br />
              <Paper elevation={3}>
                <div className={classes.recipe}>
                  <Typography>{info.msg.content}</Typography>
                </div>
              </Paper>
            </div>
          )}
        </div>
      }
    />
  );
}
