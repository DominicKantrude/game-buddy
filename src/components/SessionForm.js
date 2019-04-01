import React, { Component } from "react";

export default class SessionForm extends Component {
    // Set initial state

    state = {
        timeSlot: "",
        groupSize: "",
        sessionDate: "",
        users: [],
        preference: ""

    };

    // Update state whenever an input field is edited
    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };

    constructNewSession = evt => {
        evt.preventDefault();

        const session = {
            timeSlot: this.state.sessionDate + " " + this.state.timeSlot,
            groupSize: this.state.groupSize,
            users: []
        };
        const preference = parseInt(this.state.preference);
        // Create the animal and redirect user to animal list
        this.props.addSession(session, preference)
            .then(() => this.props.history.push("/session"));
    }

    render() {
        return (
            <React.Fragment>
                <form className="animalForm">
                    <div className="form-group">
                        <label htmlFor="timeSlot">Preference</label>
                        <select
                            defaultValue=""
                            name="preference"
                            id="preference"
                            onChange={this.handleFieldChange}
                        >
                            {
                                this.props.preferences.map(preference => {
                                    return <option key={preference.id} id={preference.id} value={preference.id}>{preference.preference}</option>
                                }
                                )
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            required
                            className="form-control"
                            onChange={this.handleFieldChange}
                            id="sessionDate"
                            placeholder="session date"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="timeSlot">Timeslot</label>
                        <select
                            defaultValue=""
                            name="timeSlot"
                            id="timeSlot"
                            onChange={this.handleFieldChange}
                        >

                            <option key="00:00-01:00" id="00:00-01:00" value="00:00-01:00">00:00-01:00</option>
                            <option key="01:00-02:00" id="01:00-02:00" value="01:00-02:00">01:00-02:00</option>
                            <option key="03:00-04:00" id="03:00-04:00" value="03:00-04:00">03:00-04:00</option>
                            <option key="05:00-06:00" id="05:00-06:00" value="05:00-06:00">05:00-06:00</option>
                            <option key="06:00-07:00" id="06:00-07:00" value="06:00-07:00">06:00-07:00</option>
                            <option key="07:00-08:00" id="07:00-08:00" value="07:00-08:00">07:00-08:00</option>
                            <option key="08:00-09:00" id="08:00-09:00" value="08:00-09:00">08:00-09:00</option>
                            <option key="10:00-11:00" id="10:00-11:00" value="10:00-11:00">10:00-11:00</option>
                            <option key="11:00-12:00" id="11:00-12:00" value="11:00-12:00">11:00-12:00</option>
                            <option key="12:00-13:00" id="12:00-13:00" value="12:00-13:00">12:00-13:00</option>
                            <option key="13:00-14:00" id="13:00-14:00" value="13:00-14:00">13:00-14:00</option>
                            <option key="14:00-15:00" id="14:00-15:00" value="14:00-15:00">14:00-15:00</option>
                            <option key="15:00-16:00" id="15:00-16:00" value="15:00-16:00">15:00-16:00</option>
                            <option key="16:00-17:00" id="16:00-17:00" value="16:00-17:00">16:00-17:00</option>
                            <option key="17:00-18:00" id="17:00-18:00" value="17:00-18:00">17:00-18:00</option>
                            <option key="18:00-19:00" id="18:00-19:00" value="18:00-19:00">18:00-19:00</option>
                            <option key="19:00-20:00" id="19:00-20:00" value="19:00-20:00">19:00-20:00</option>
                            <option key="20:00-21:00" id="20:00-21:00" value="20:00-21:00">20:00-21:00</option>
                            <option key="21:00-22:00" id="21:00-22:00" value="21:00-22:00">21:00-22:00</option>
                            <option key="22:00-23:00" id="22:00-23:00" value="22:00-23:00">22:00-23:00</option>
                            <option key="23:00-24:00" id="23:00-24:00" value="23:00-24:00">23:00-24:00</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        onClick={this.constructNewSession}
                        className="btn btn-primary"
                    >
                        Submit
          </button>
                </form>
            </React.Fragment>
        );
    }
}