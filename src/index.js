
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"
import GameBuddy from "./components/GameBuddy"

//import './index.css'




ReactDOM.render(
    <Router>
        <GameBuddy />
    </Router>
    , document.getElementById('root'))
