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

const useStyles = makeStyles({
  root: {
    maxWidth: 275,
    minWidth: 275,
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

export default function RecipeCard(props) {
  const classes = useStyles();

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
            Kcal: {Number(props.recipe.kcal).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Added: {props.recipe.added.slice(0, 10)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actions}>
        <IconButton
          aria-label="add to favorites"
          onClick={() => {
            fetch("http://localhost:5000/favorite", {
              body: JSON.stringify({
                username: window.localStorage.getItem("login"),
                recipe_id: props.recipe.id,
              }),
              method: "POST",
              headers: {
                Authorization: "Basic YWRtMW46U2VjdXJlUGFzcw==",
                "Content-Type": "application/json",
              },
            }).then((resp) => window.location.reload(false));
          }}
        >
          {props.recipe.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton
          aria-label="learn more"
          onClick={() => {
            window.location = "/recipe/" + props.recipe.id;
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
