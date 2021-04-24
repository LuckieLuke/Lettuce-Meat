import MiniDrawer from './utils/MiniDrawer'
import { useState } from 'react';
import {
    CircularProgress
} from '@material-ui/core';

export default function HomePage(props) {
    const [info, setInfo] = useState('Coś ciekawego')
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

    return (
        < MiniDrawer
            content={
                < div className="content" >
                    <h1>{waiting ? <CircularProgress color='secondary' /> : info}</h1>
                    <button onClick={getData}>Get sth from fetch</button>
                </div >
            }
        />
    )
}