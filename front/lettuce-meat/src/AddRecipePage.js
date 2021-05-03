import MiniDrawer from './utils/MiniDrawer'
import './App.css'
import React from 'react'
import TransferList from './utils/TransferList'

export default function AddRecipePage(props) {

    return (
        <MiniDrawer
            content={
                <div className='content'>
                    <TransferList />
                </div>
            }
        />
    )
}