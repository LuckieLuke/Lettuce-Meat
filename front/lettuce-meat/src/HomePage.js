import MiniDrawer from './utils/MiniDrawer'
import RecipeCard from './utils/RecipeCard'
import { useState } from 'react';
import {
    CircularProgress
} from '@material-ui/core';
import './App.css';

export default function HomePage(props) {
    const [info, setInfo] = useState(['Coś ciekawego'])
    const [waiting, setWaiting] = useState(false)

    let getData = () => {
        setWaiting(true)
        fetch('http://localhost:5000')
            .then(resp => resp.json())
            .then(response => {
                setWaiting(false)
                setInfo(response.msg)
            })
            .catch(error => {
                setInfo('PROBLEM')
            })
    }

    let mapUsers = () => {
        if (info[0] === 'Coś ciekawego')
            return info[0]

        const users = info.map((user) => {
            return <RecipeCard user={user} key={user.id} />
        })

        return users
    }

    return (
        < MiniDrawer
            content={
                < div className="content" >
                    <h1>Our most fresh findings:</h1>
                    <div className="recipies">
                        {waiting ? <CircularProgress color='secondary' /> : mapUsers()}
                    </div>
                    <br />
                    <button onClick={getData}>Get sth from fetch</button>
                </div >
            }
        />
    )
}