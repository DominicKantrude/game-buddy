import { Link } from "react-router-dom";
import React, { Component } from 'react';
import AddSessionModal from "./AddSessionModal"
import "./session.css"
import Button from '@material-ui/core/Button';

class SessionList extends Component {


    state = {
        sortType: "groupSize"
    };

    // Update state whenever an input field is edited
    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
        this.props.toggleSorting(this.state.sortType)
        this.props.getLoadInfo()
    };

    render() {
        return (
            <React.Fragment>

                <div class="backgroundContainer">
                    <section class="commonContainer">
                        <h1>Session List</h1>
                        <div className="flex-row-space-even">
                            <AddSessionModal
                                {...this.props} addSession={this.props.addSession} preferences= {this.props.preferences} updateMessage={this.updateMessage}
                            />
                            <button type="button"
                                className="btn btn-success"
                                onClick={() => {
                                    this.props.history.push("/session/new")
                                }
                                }>
                                Add Session
                            </button>
                            <div>
                                Sort By:
                            <select
                                    defaultValue=""
                                    name="sortType"
                                    id="sortType"
                                    onChange={this.handleFieldChange}
                                >
                                    <option key="sortByGroupSize" id="sortType" value="groupSize">Group Size</option>
                                    <option key="sortByDate" id="sortType" value="byDate">Date</option>
                                </select>
                            </div>
                        </div>
                        {
                            this.props.userSessions.map(session =>

                                <div key={session.id} class="session card">
                                    <h3 className="centered">Session Date: {session.timeSlot}</h3>
                                    <hr></hr>
                                    <div className="flex-row-space-even">
                                        <p>Preference: {session.preference}</p>
                                        <p>Group Size: {session.groupSize}</p>
                                    </div>
                                    {
                                        session.users.map(user => {
                                            return <p>User: {user}
                                            </p>
                                        })
                                    }

                                    <Button variant="contained" color="primary"
                                        className="sessionDeleteButton myButton btn btn-primary"
                                        onClick={() => {
                                            this.props.deleteSession(session.id)
                                        }
                                        }>Delete</Button>

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