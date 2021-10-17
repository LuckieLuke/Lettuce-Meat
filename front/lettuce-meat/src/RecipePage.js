import MiniDrawer from "./utils/MiniDrawer";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import EcoIcon from "@material-ui/icons/Eco";

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
      .then((info) => {
        setInfo(info);
      });
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
                src={
                  info.msg.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSdgQeHNtIa3FoyfnxdS9O8P27OX_qC9JGnikmY00WYCDg3JxsWQ04y78E7FOjQWrC0c&usqp=CAU"
                }
                alt={info.msg.name}
                style={{
                  height: "300px",
                  borderRadius: "15px",
                  boxShadow: "10px 10px 50px #ccc",
                }}
              />
              <br />
              {info.msg.for_vegan ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <EcoIcon style={{ display: "inline", color: "#467D0B" }} />
                  <h3
                    style={{
                      color: "#467D0B",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    Vegan friendly!{" "}
                  </h3>
                </div>
              ) : null}
              {!info.msg.for_vegan && info.msg.for_vegetarian ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <EcoIcon style={{ display: "inline", color: "#467D0B" }} />
                  <h3
                    style={{
                      color: "#467D0B",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    Vegetarian friendly!{" "}
                  </h3>
                </div>
              ) : null}
              <br />
              <Paper elevation={3} className={classes.paper}>
                <div>{generateIngredients()}</div>
              </Paper>
              <br />
              <Paper elevation={3}>
                <div className={classes.recipe}>
                  <Typography>
                    {info.msg.content.split("\n").map((line) => (
                      <span style={{ display: "block" }} key={Math.random()}>
                        {line}
                      </span>
                    ))}
                  </Typography>
                  {info.msg.for_vegan}
                </div>
              </Paper>
            </div>
          )}
        </div>
      }
    />
  );
}
