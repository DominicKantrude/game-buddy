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
                    <section class="commonContainer center-background">
                        <h1>Session List</h1>
                        <div className="flex-row-space">
                            <AddSessionModal
                                {...this.props} addSession={this.props.addSession} preferences={this.props.preferences} updateMessage={this.updateMessage}
                            />
                            <div className="top-pad">
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
                                    <div className="flex-row-space-even padding-bot15">
                                        <h4>Preference: {session.preference}</h4>
                                        <h4>Group Size: {session.groupSize}</h4>
                                    </div>
                                    {
                                        session.users.map(user => {

                                            return <div className="flex-row ">
                                            <p className="users"> User: {user.user} </p>
                                            <p className="users">Preference: {user.preference}</p>
                                            </div>
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