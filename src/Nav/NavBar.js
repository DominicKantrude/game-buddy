import React, { Component } from "react"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"


class NavBar extends Component {

    render() {
        return (
            <nav className="navbar navbar-light fixed-top light-blue flex-md-nowrap p-0 shadow">
                <ul className="nav nav-pills">
                    <li className="nav-item flex-row flex-center">
                        <Link className="nav-link" to="/session">Sessions</Link>
                        <Link className="nav-link" to="/friends">Friends</Link>
                        <Link className="nav-link" to="/schedules">Scheduler</Link>
                        <a id="title" className="nav-link">Signed in {this.props.activeUser.username}</a>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default NavBar