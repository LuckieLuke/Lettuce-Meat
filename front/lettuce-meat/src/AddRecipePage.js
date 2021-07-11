import MiniDrawer from "./utils/MiniDrawer";
import "./App.css";
import React, { useState } from "react";
import TransferList from "./utils/TransferList";
import InputTable from "./utils/InputTable";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function AddRecipePage(props) {
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState({});

  let handleClick = (selected) => {
    console.log(selected);
    setItems(selected);
  };

  let handleSubmit = (ings) => {
    console.log(ings);
    setIngredients(ings);
  };

  return (
    <MiniDrawer
      content={
        <div className="content">
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
              />
              <br />
              <Button variant="contained" color="primary">
                Save recipe
              </Button>
            </div>
          ) : null}
        </div>
      }
    />
  );
}
