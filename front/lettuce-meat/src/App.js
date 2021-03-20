import './App.css';
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';

function App() {
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
    <div className="App">
      <h1>{waiting ? <CircularProgress color='secondary' /> : info}</h1>
      <button onClick={getData}>Get sth from fetch</button>
    </div>
  );
}

export default App;
