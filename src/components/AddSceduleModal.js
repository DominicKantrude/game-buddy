import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AddScheduleModal extends React.Component {

    state = {
        modal: false,
        dayIncrementor: "",
        time: "",
        endTime: "",
        preference: "",
        userId: parseInt(sessionStorage.getItem("credentials"))
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleFieldChange = evt => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    };

    constructNewSchedule = evt => {
        evt.preventDefault();

        // this.createSessionTimes(this.state.time, this.state.endTime)

        const schedule = {
            preference: parseInt(this.state.preference),
            dayIncrementor: parseInt(this.state.dayIncrementor),
            time: this.state.time,
            userId: this.state.userId
        };

        this.setState({ modal: false })
        this.props.addSchedule(schedule)

    }

    // createSessionTimes(startTime, endTime) {
    //     //does the starttime plus an hour equal the end time

    //     //create the matcherTime here with one hour added

    //     let sessionTimesToAdd = ne
    //     while (matcherTime != endTime) {



    //     }



    // }

    render() {

        return (
            <div>
                <Button color="info" onClick={this.toggle}>Add Schedule</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add Schedule</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="timeSlot">Preference: </label>
                            <select
                                defaultValue=""
                                name="preference"
                                id="preference"
                                onChange={this.handleFieldChange}
                            >
                                {
                                    this.props.preferences.map(preference => {
                                        return <option key={`preference--${preference.id}`} id={preference.id} value={preference.id}>{preference.preference}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dayPicked">Day: </label>
                            <select
                                defaultValue=""
                                name="dayIncrementor"
                                id="dayIncrementor"
                                onChange={this.handleFieldChange}
                            >
                                <option key="sunday" id="sunday" value="0">Sunday</option>
                                <option key="monday" id="monday" value="1">Monday</option>
                                <option key="tuesday" id="tuesday" value="2">Tuesday</option>
                                <option key="wednesday" id="wednesday" value="3">Wednesday</option>
                                <option key="thursday" id="thursday" value="4">Thursday</option>
                                <option key="friday" id="friday" value="5">Friday</option>
                                <option key="saturday" id="satruday" value="6">Saturday</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="time">Timeslot: </label>
                            <select
                                defaultValue=""
                                name="time"
                                id="time"
                                onChange={this.handleFieldChange}
                            >

                                <option key="scheduleTime--00:00-01:00" id="00:00-01:00" value="00:00-01:00">00:00-01:00</option>
                                <option key="scheduleTime--01:00-02:00" id="01:00-02:00" value="01:00-02:00">01:00-02:00</option>
                                <option key="scheduleTime--02:00-03:00" id="02:00-03:00" value="02:00-03:00">02:00-03:00</option>
                                <option key="scheduleTime--03:00-04:00" id="03:00-04:00" value="03:00-04:00">03:00-04:00</option>
                                <option key="scheduleTime--05:00-06:00" id="05:00-06:00" value="05:00-06:00">05:00-06:00</option>
                                <option key="scheduleTime--06:00-07:00" id="06:00-07:00" value="06:00-07:00">06:00-07:00</option>
                                <option key="scheduleTime--07:00-08:00" id="07:00-08:00" value="07:00-08:00">07:00-08:00</option>
                                <option key="scheduleTime--08:00-09:00" id="08:00-09:00" value="08:00-09:00">08:00-09:00</option>
                                <option key="scheduleTime--09:00-10:00" id="09:00-10:00" value="09:00-10:00">09:00-10:00</option>
                                <option key="scheduleTime--10:00-11:00" id="10:00-11:00" value="10:00-11:00">10:00-11:00</option>
                                <option key="scheduleTime--11:00-12:00" id="11:00-12:00" value="11:00-12:00">11:00-12:00</option>
                                <option key="scheduleTime--12:00-13:00" id="12:00-13:00" value="12:00-13:00">12:00-13:00</option>
                                <option key="scheduleTime--13:00-14:00" id="13:00-14:00" value="13:00-14:00">13:00-14:00</option>
                                <option key="scheduleTime--14:00-15:00" id="14:00-15:00" value="14:00-15:00">14:00-15:00</option>
                                <option key="scheduleTime--15:00-16:00" id="15:00-16:00" value="15:00-16:00">15:00-16:00</option>
                                <option key="scheduleTime--16:00-17:00" id="16:00-17:00" value="16:00-17:00">16:00-17:00</option>
                                <option key="scheduleTime--17:00-18:00" id="17:00-18:00" value="17:00-18:00">17:00-18:00</option>
                                <option key="scheduleTime--18:00-19:00" id="18:00-19:00" value="18:00-19:00">18:00-19:00</option>
                                <option key="scheduleTime--19:00-20:00" id="19:00-20:00" value="19:00-20:00">19:00-20:00</option>
                                <option key="scheduleTime--20:00-21:00" id="20:00-21:00" value="20:00-21:00">20:00-21:00</option>
                                <option key="scheduleTime--21:00-22:00" id="21:00-22:00" value="21:00-22:00">21:00-22:00</option>
                                <option key="scheduleTime--22:00-23:00" id="22:00-23:00" value="22:00-23:00">22:00-23:00</option>
                                <option key="scheduleTime--23:00-24:00" id="23:00-24:00" value="23:00-24:00">23:00-24:00</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <select
                                defaultValue=""
                                name="endTime"
                                id="endTime"
                                onChange={this.handleFieldChange}
                            >

                                <option key="scheduleTime--00:00-01:00" id="00:00-01:00" value="00:00-01:00">00:00-01:00</option>
                                <option key="scheduleTime--01:00-02:00" id="01:00-02:00" value="01:00-02:00">01:00-02:00</option>
                                <option key="scheduleTime--02:00-03:00" id="02:00-03:00" value="02:00-03:00">02:00-03:00</option>
                                <option key="scheduleTime--03:00-04:00" id="03:00-04:00" value="03:00-04:00">03:00-04:00</option>
                                <option key="scheduleTime--05:00-06:00" id="05:00-06:00" value="05:00-06:00">05:00-06:00</option>
                                <option key="scheduleTime--06:00-07:00" id="06:00-07:00" value="06:00-07:00">06:00-07:00</option>
                                <option key="scheduleTime--07:00-08:00" id="07:00-08:00" value="07:00-08:00">07:00-08:00</option>
                                <option key="scheduleTime--08:00-09:00" id="08:00-09:00" value="08:00-09:00">08:00-09:00</option>
                                <option key="scheduleTime--09:00-10:00" id="09:00-10:00" value="09:00-10:00">09:00-10:00</option>
                                <option key="scheduleTime--10:00-11:00" id="10:00-11:00" value="10:00-11:00">10:00-11:00</option>
                                <option key="scheduleTime--11:00-12:00" id="11:00-12:00" value="11:00-12:00">11:00-12:00</option>
                                <option key="scheduleTime--12:00-13:00" id="12:00-13:00" value="12:00-13:00">12:00-13:00</option>
                                <option key="scheduleTime--13:00-14:00" id="13:00-14:00" value="13:00-14:00">13:00-14:00</option>
                                <option key="scheduleTime--14:00-15:00" id="14:00-15:00" value="14:00-15:00">14:00-15:00</option>
                                <option key="scheduleTime--15:00-16:00" id="15:00-16:00" value="15:00-16:00">15:00-16:00</option>
                                <option key="scheduleTime--16:00-17:00" id="16:00-17:00" value="16:00-17:00">16:00-17:00</option>
                                <option key="scheduleTime--17:00-18:00" id="17:00-18:00" value="17:00-18:00">17:00-18:00</option>
                                <option key="scheduleTime--18:00-19:00" id="18:00-19:00" value="18:00-19:00">18:00-19:00</option>
                                <option key="scheduleTime--19:00-20:00" id="19:00-20:00" value="19:00-20:00">19:00-20:00</option>
                                <option key="scheduleTime--20:00-21:00" id="20:00-21:00" value="20:00-21:00">20:00-21:00</option>
                                <option key="scheduleTime--21:00-22:00" id="21:00-22:00" value="21:00-22:00">21:00-22:00</option>
                                <option key="scheduleTime--22:00-23:00" id="22:00-23:00" value="22:00-23:00">22:00-23:00</option>
                                <option key="scheduleTime--23:00-24:00" id="23:00-24:00" value="23:00-24:00">23:00-24:00</option>
                            </select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.constructNewSchedule}>Add Session!</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AddScheduleModal;