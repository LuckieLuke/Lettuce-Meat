import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles({
    root: {
        maxWidth: 275,
        minWidth: 275,
        margin: 10,
        padding: 10
    },
    media: {
        height: 140,
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-around'
    }
});

export default function RecipeCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea
                onClick={() => { window.location = '/recipies?q=' + props.user.id }}
            >
                <CardMedia
                    className={classes.media}
                    image={props.user.img || "https://www.dashef.com/wp-content/uploads/2016/11/Depositphotos_71652087_original-min.jpg"}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.user.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.user.email}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className={classes.actions}>
                <IconButton
                    aria-label="add to favorites"
                    onClick={() => { window.location = '/recipies?q=' + props.user.id }}
                >
                    <FavoriteIcon />
                </IconButton>
                <IconButton
                    aria-label="learn more"
                    onClick={() => { window.location = '/recipies?q=' + props.user.id }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
