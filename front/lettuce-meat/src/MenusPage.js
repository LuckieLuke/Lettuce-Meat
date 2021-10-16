import MiniDrawer from "./utils/MiniDrawer";
import "./App.css";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import MenuPres from "./utils/MenuPres";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  menus: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "3%",
  },
}));

export default function MenusPage(props) {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [menus, setMenus] = useState([]);
  const [counter, setCounter] = useState(1);
  const [visibleMenus, setVisibleMenus] = useState([]);

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
        setCurrentPage(1);
        setVisibleMenus(info.msg.slice(0, 3));
        setCounter(Math.ceil(menus.length / 3));
      });
  }, [menus.length]);

  const resetVisible = (value) => {
    console.log(menus);
    setVisibleMenus(menus.slice(3 * (value - 1), 3 * value));
  };

  return (
    <MiniDrawer
      content={
        <div className="content">
          <h1>All your menus:</h1>
          <Pagination
            count={counter}
            color="primary"
            onChange={(event, value) => {
              setCurrentPage(value);
              resetVisible(value);
            }}
          />
          <div className={classes.menus}>
            {visibleMenus.length ? (
              visibleMenus.map((menu) => (
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
