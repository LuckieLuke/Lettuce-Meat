import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";

const useStyles = makeStyles({
  root: {
    maxWidth: 260,
    minWidth: 260,
    margin: 10,
    padding: 10,
  },
  media: {
    height: 140,
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RecipeCard(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [recipe, setRecipe] = React.useState({});

  const handleClickOpen = () => {
    fetch(`http://localhost:5000/recipe/${props.recipe.id}`)
      .then((resp) => resp.json())
      .then((info) => setRecipe(info.msg));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea
        onClick={() => {
          window.location = "/recipe/" + props.recipe.id;
        }}
      >
        <CardMedia
          className={classes.media}
          image={
            props.recipe.img ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSdgQeHNtIa3FoyfnxdS9O8P27OX_qC9JGnikmY00WYCDg3JxsWQ04y78E7FOjQWrC0c&usqp=CAU"
          }
          title={props.recipe.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.recipe.name.length > 15
              ? props.recipe.name.substring(0, 15) + "..."
              : props.recipe.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Kcal: {Number(props.recipe.kcal).toFixed(0)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Added: {props.recipe.added.slice(0, 10)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actions}>
        <IconButton
          aria-label="add to favorites"
          onClick={(e) => {
            fetch("http://localhost:5000/favorite", {
              body: JSON.stringify({
                username: window.sessionStorage.getItem("login"),
                recipe_id: props.recipe.id,
              }),
              method: "POST",
              headers: {
                Authorization: "Basic YWRtMW46U2VjdXJlUGFzcw==",
                "Content-Type": "application/json",
              },
            }).then((resp) => props.handleFav());
          }}
        >
          {props.recipe.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton aria-label="learn more" onClick={handleClickOpen}>
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {recipe.name} ({recipe.kcal ? parseInt(recipe.kcal) : null} kcal per
          portion)
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {recipe.content
              ? recipe.content.split("\n").map((line) => (
                  <span style={{ display: "block" }} key={Math.random()}>
                    {line}
                  </span>
                ))
              : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
