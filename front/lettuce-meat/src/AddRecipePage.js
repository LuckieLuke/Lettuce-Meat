import MiniDrawer from './utils/MiniDrawer'
import './App.css'
import React, { useState } from 'react'
import TransferList from './utils/TransferList'
import InputTable from './utils/InputTable'

export default function AddRecipePage(props) {
    const [items, setItems] = useState([])
    const [ingredients, setIngredients] = useState({})

    let handleClick = (selected) => {
        console.log(selected)
        setItems(selected)
    }

    let handleSubmit = (ings) => {
        console.log(ings)
        setIngredients(ings)
    }

    return (
        <MiniDrawer
            content={
                <div className='content'>
                    <TransferList handleClick={handleClick} />
                    <br />
                    <br />
                    {items ?
                        <InputTable rows={items} handleSubmit={handleSubmit} />
                        : null}
                    <br />
                    <br />
                    {Object.keys(ingredients).length ?
                        <h1>redi</h1>
                        : null}
                </div>
            }
        />
    )
}