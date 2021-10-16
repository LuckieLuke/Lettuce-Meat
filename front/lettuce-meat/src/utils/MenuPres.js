import RecipeCard from "./RecipeCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    shelf: {
        display: "flex",
        width: "90%",
        border: "1px solid black",
        borderRadius: "2px",
        margin: "10px 0",
        flexWrap: "wrap"
    }
});

export default function MenuPres(props) {
    const classes = useStyles();

    const getRecipeCards = () => {
        return props.recipes.map(recipe => (<RecipeCard recipe={recipe} key={recipe.id} />))
    }

    return (
        <div className={classes.shelf}>
            {getRecipeCards()}
        </div>
    )
}