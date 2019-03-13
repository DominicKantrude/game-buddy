import { Link } from "react-router-dom";
import React, { Component } from 'react';
import "./session.css"

class SessionList extends Component {

    render() {
        return (
            <React.Fragment>

                <div className="animalButton">
                    <button type="button"
                        className="btn btn-success"
                        onClick={() => {
                            this.props.history.push("/session/new")
                        }
                        }>
                        Add Session
                    </button>
                </div>

                <article>
                    <h1>Session List</h1>
                    {
                        this.props.userSessions.map(session =>

                            <div key={session.id} class="session">
                                <p>Session Date: {session.timeSlot}</p>
                                <p>Group Size: {session.groupSize}</p>

                                {
                                    session.users.map(user => {
                                        return <p>User: {user}
                                </p>
                                })
                            }
                                <a href="#"
                                    onClick={() => this.props.deleteSession(session.id)}
                                    className="card-link">Delete</a>
                                <Link className="nav-link" to={`/session/${session.id}`}>Details</Link>
                            </div>
                        )
                    }
                </article>
            </React.Fragment>
        );
    }
}
export default SessionList