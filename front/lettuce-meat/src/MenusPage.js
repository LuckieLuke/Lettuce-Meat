import MiniDrawer from "./utils/MiniDrawer";
import "./App.css";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuPres from "./utils/MenuPres";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  menus: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    marginTop: "3%",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
}));

export default function MenusPage(props) {
  const classes = useStyles();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/menu", {
      method: "GET",
      headers: {
        "x-user": window.sessionStorage.getItem("login"),
      },
    })
      .then((resp) => resp.json())
      .then((info) => {
        setMenus(info.msg);
      });
  }, [menus.length]);

  const shuffle = () => {
    let currentIndex = menus.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [menus[currentIndex], menus[randomIndex]] = [
        menus[randomIndex],
        menus[currentIndex],
      ];
    }
    return menus;
  };

  return (
    <MiniDrawer
      content={
        <div className="content">
          <h1>All your menus:</h1>
          <div className={classes.menus}>
            {menus.length ? (
              shuffle(menus).map((menu) => (
                <MenuPres recipes={menu} key={Math.random()} />
              ))
            ) : (
              <CircularProgress color="secondary" />
            )}
          </div>
        </div>
      }
    />
  );
}
