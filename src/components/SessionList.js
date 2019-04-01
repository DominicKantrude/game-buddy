import { Link } from "react-router-dom";
import React, { Component } from 'react';
import AddSessionModal from "./AddSessionModal"
import "./session.css"

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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
                        <div className="flex-row-space">
                            <AddSessionModal
                                {...this.props} addSession={this.props.addSession} preferences={this.props.preferences} updateMessage={this.updateMessage}
                            />
                            <div>
                                Sort By:

                            <select
                                    defaultValue=""
                                    name="sortType"
                                    id="sortType"
                                    onChange={this.handleFieldChange}
                                >
                                    <option key="sortByGroupSize" id="sortType" value="groupSize">Date</option>
                                    <option key="sortByDate" id="sortType" value="byDate">Group Size</option>
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
                                    <div className="flex-row-end">

                                        <Link className="nav-link" to={`/session/${session.id}`}>Details</Link>
                                        <div className="flow-right">
                                            <IconButton aria-label="Delete" onClick={() => {
                                                this.props.deleteSession(session.id)
                                            }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </div>
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