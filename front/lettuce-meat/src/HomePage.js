import MiniDrawer from './utils/MiniDrawer'
import RecipeCard from './utils/RecipeCard'
import { adjustCardNum } from './utils/services'
import { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import './App.css';

export default function HomePage(props) {
    const [info, setInfo] = useState(['Coś ciekawego'])
    const [waiting, setWaiting] = useState(false)
    const [allPagesCounter, setAllPagesCounter] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [numOfRecipes, setNumOfRecipes] = useState(3)

    useEffect(() => {
        setWaiting(true)
        fetch('http://localhost:5000')
            .then(resp => resp.json())
            .then(response => {
                setWaiting(false)
                setInfo(response.msg)

                const [recs, counter] = adjustCardNum(response.msg.length)
                setNumOfRecipes(recs)
                setAllPagesCounter(counter)

            })
            .catch(error => {
                setInfo('PROBLEM')
            })
    }, [])

    window.addEventListener('resize', () => {
        const [recs, counter] = adjustCardNum(info.length)
        setNumOfRecipes(recs)
        setAllPagesCounter(counter)
        mapRecipes()
    })

    let mapRecipes = () => {
        if (info[0] === 'Coś ciekawego')
            return info[0]

        const recipes = info.slice(numOfRecipes * (currentPage - 1), numOfRecipes * currentPage).map((recipe) => {
            return <RecipeCard recipe={recipe} key={recipe.id} />
        })

        return recipes
    }

    return (
        < MiniDrawer
            content={
                < div className="content" >
                    <h1>Our new findings:</h1>
                    <Pagination
                        count={allPagesCounter}
                        color="primary"
                        onChange={(event, value) => {
                            setCurrentPage(value)
                            mapRecipes()
                        }}
                    />
                    <div className="recipes">
                        {waiting ? <CircularProgress color='secondary' /> : mapRecipes()}
                    </div>
                </div >
            }
        />
    )
}