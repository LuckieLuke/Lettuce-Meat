import MiniDrawer from './utils/MiniDrawer'
import './App.css'

export default function LoginPage(props) {
    return (
        <MiniDrawer
            content={
                <div className="content">
                    <h3>login</h3>
                    <h3>hasło</h3>
                </div>
            }
        />
    )
}