
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom"
import GameBuddy from "./components/GameBuddy"
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import 'typeface-roboto';





ReactDOM.render(

    <Router>
        <GameBuddy />
    </Router>
    , document.getElementById('root'))
