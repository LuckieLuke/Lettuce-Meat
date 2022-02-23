import MiniDrawer from "./utils/MiniDrawer";
import RecipeCard from "./utils/RecipeCard";
import { adjustCardNum } from "./utils/services";
import { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

import "./App.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function HomePage(props) {
  const classes = useStyles();
  const [info, setInfo] = useState(["Coś ciekawego"]);
  const [waiting, setWaiting] = useState(false);
  const [allPagesCounter, setAllPagesCounter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfRecipes, setNumOfRecipes] = useState(3);
  const [type, setType] = useState("all");

  useEffect(() => {
    setWaiting(true);
    fetch("http://localhost:5000", {
      headers: { "x-user": window.sessionStorage.getItem("login") },
    })
      .then((resp) => resp.json())
      .then((response) => {
        setWaiting(false);
        setInfo(response.msg);

        const [recs, counter] = adjustCardNum(response.msg.length);
        setNumOfRecipes(recs);
        setAllPagesCounter(counter);
      })
      .catch((error) => {
        setInfo("PROBLEM");
      });
  }, []);

  window.addEventListener("resize", () => {
    const [recs, counter] = adjustCardNum(info.length);
    setNumOfRecipes(recs);
    setAllPagesCounter(counter);
    mapRecipes();
  });

  let mapRecipes = () => {
    if (info[0] === "Coś ciekawego") return info[0];

    const recipes = info
      .sort((a, b) => b.id - a.id)
      .slice(numOfRecipes * (currentPage - 1), numOfRecipes * currentPage)
      .map((recipe) => {
        return (
          <RecipeCard
            recipe={recipe}
            key={recipe.id}
            handleFav={handleFavState}
          />
        );
      });

    return recipes;
  };

  let handleFavState = () => {
    reload_cards(type);
  };

  let handleChangeType = (e) => {
    setType(e.target.value);
    setWaiting(true);
    reload_cards(e.target.value);
  };

  let reload_cards = (type) => {
    if (type !== "all") {
      fetch(`http://localhost:5000/recipes/${type}`, {
        headers: { "x-user": window.sessionStorage.getItem("login") },
      })
        .then((resp) => resp.json())
        .then((response) => {
          setWaiting(false);
          setInfo(response.msg);

          const [recs, counter] = adjustCardNum(response.msg.length);
          setNumOfRecipes(recs);
          setAllPagesCounter(counter);
        })
        .catch((error) => {
          setInfo("PROBLEM");
        });
    } else {
      fetch("http://localhost:5000", {
        headers: { "x-user": window.sessionStorage.getItem("login") },
      })
        .then((resp) => resp.json())
        .then((response) => {
          setWaiting(false);
          setInfo(response.msg);

          const [recs, counter] = adjustCardNum(response.msg.length);
          setNumOfRecipes(recs);
          setAllPagesCounter(counter);
        })
        .catch((error) => {
          setInfo("PROBLEM");
        });
    }
  };

  return (
    <MiniDrawer
      content={
        <div className="content">
          <h1>Our new findings:</h1>
          <Pagination
            count={allPagesCounter}
            color="primary"
            onChange={(event, value) => {
              setCurrentPage(value);
              mapRecipes();
            }}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Meal type</InputLabel>
            <Select
              labelId="type"
              id="type-select"
              value={type}
              onChange={handleChangeType}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"breakfast"}>Breakfast</MenuItem>
              <MenuItem value={"snack"}>Snack</MenuItem>
              <MenuItem value={"lunch"}>Lunch</MenuItem>
              <MenuItem value={"dinner"}>Dinner</MenuItem>
              <MenuItem value={"supper"}>Supper</MenuItem>
            </Select>
          </FormControl>
          <div className="recipes">
            {waiting ? <CircularProgress color="secondary" /> : mapRecipes()}
          </div>
        </div>
      }
    />
  );
}
