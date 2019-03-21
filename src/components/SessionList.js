import { Link } from "react-router-dom";
import React, { Component } from 'react';
import "./session.css"

class SessionList extends Component {

    render() {
        return (
            <React.Fragment>

                <div class="backgroundContainer">
                    <section class="commonContainer">
                        <h1>Session List</h1>
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
                        {
                            this.props.userSessions.map(session =>

                                <div key={session.id} class="session card">
                                    <p>Session Date: {session.timeSlot}</p>
                                    <p>Preference: {session.preference}</p>
                                    <p>Group Size: {session.groupSize}</p>


                                    {
                                        session.users.map(user => {
                                            return <p>User: {user}
                                            </p>
                                        })
                                    }

                                    <button type="button"
                                        className="sessionDeleteButton myButton btn btn-primary"
                                        onClick={() => {
                                            this.props.deleteSession(session.id)
                                        }
                                        }>Delete</button>

                                    <Link className="nav-link" to={`/session/${session.id}`}>Details</Link>
                                </div>
                            )
                        }
                    </section>
                </div>
            </React.Fragment>
        );
    }
}
export default SessionList