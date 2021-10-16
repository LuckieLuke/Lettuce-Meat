import MiniDrawer from "./utils/MiniDrawer";
import "./App.css";
import React, { useState } from "react";
import TransferList from "./utils/TransferList";
import InputTable from "./utils/InputTable";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function AddRecipePage(props) {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState({});
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [portions, setPortions] = useState(1);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  let handleClick = (selected) => {
    console.log(selected);
    setItems(selected);
  };

  let handleSubmit = (ings) => {
    console.log(ings);
    setIngredients(ings);
  };

  let saveRecipe = () => {
    let url = "http://localhost:5000/recipe";
    let ingredients = window.sessionStorage.getItem("ingredients") || "";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        ingredients,
        content,
        image,
        type,
        name,
        portions,
      }),
      headers: {
        Authorization: "Basic YWRtMW46U2VjdXJlUGFzcw==",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((info) => {
        if (info.msg === "recipe created") {
          window.location = "/";
        }
      });
  };

  return (
    <MiniDrawer
      content={
        <div className="content">
          <TextField
            id="name"
            label="Name of the meal"
            style={{ margin: 8 }}
            placeholder="Sandwich"
            fullWidth
            multiline
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <br />
          <TransferList handleClick={handleClick} />
          <br />
          <br />
          {Object.keys(items).length ? (
            <InputTable rows={items} handleSubmit={handleSubmit} />
          ) : null}
          <br />
          <br />
          {Object.keys(ingredients).length ? (
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel id="type">Meal type</InputLabel>
                <Select
                  labelId="type"
                  id="type-select"
                  value={type}
                  onChange={handleChange}
                >
                  <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                  <MenuItem value={"snack"}>Snack</MenuItem>
                  <MenuItem value={"lunch"}>Lunch</MenuItem>
                  <MenuItem value={"dinner"}>Dinner</MenuItem>
                  <MenuItem value={"supper"}>Supper</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="portions"
                label="Portions"
                style={{ margin: 8 }}
                placeholder="1"
                multiline
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={portions}
                onChange={(e) => {
                  setPortions(e.target.value);
                }}
              />
              <TextField
                id="recipe-content"
                label="Write recipe here"
                style={{ margin: 8 }}
                placeholder="Recipe"
                fullWidth
                multiline
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              <br />
              <TextField
                id="image-url"
                label="Image URL"
                style={{ margin: 8 }}
                placeholder="www.google.com"
                fullWidth
                multiline
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
              <br />
              <Button variant="contained" color="primary" onClick={saveRecipe}>
                Save recipe
              </Button>
            </div>
          ) : null}
        </div>
      }
    />
  );
}
