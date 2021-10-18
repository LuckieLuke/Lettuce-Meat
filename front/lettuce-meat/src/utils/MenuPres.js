import RecipeCard from "./RecipeCard";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  shelf: {
    display: "flex",
    margin: "10px",
    flexWrap: "wrap",
  },
});

export default function MenuPres(props) {
  const classes = useStyles();

  const getRecipeCards = () => {
    return props.recipes.map((recipe) => (
      <RecipeCard
        recipe={recipe}
        key={recipe.id}
        handleFav={() => window.location.reload(false)}
      />
    ));
  };

  return (
    <Paper elevation={3} className={classes.shelf}>
      {getRecipeCards()}
    </Paper>
  );
}
