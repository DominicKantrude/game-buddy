import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AddSessionModal extends React.Component {

    state = {
        modal: false,
        startTime: "",
        groupSize: "",
        sessionDate: "",
        users: [],
        preference: "",
        endTime: ""
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

    constructNewSession = evt => {
        evt.preventDefault();



        //method here to break up times and than just loop through call add session with each new session

        let sessionTimes = this.createSessionTimes(this.state.sessionDate + " " + this.state.startTime, this.state.sessionDate + " " + this.state.endTime)

        sessionTimes.forEach(sessionTime => {

            const session = {
                timeSlot: sessionTime,
                groupSize: this.state.groupSize,
                users: []
            };
            const preference = parseInt(this.state.preference);
            this.props.addSession(session, preference)
        });


        this.setState({ modal: false })

    }

    createSessionTimes = (startTime, endTime) => {

        let matcherTime = startTime;
        let tail = ""
        let sessionTimesToAdd = []

        while (matcherTime != endTime) {

            tail = matcherTime;
            matcherTime = this.addHour(matcherTime);
            //create the correct formatted date
            sessionTimesToAdd.push(tail + "-" + matcherTime.split(" ")[1])
        }
        return sessionTimesToAdd;
    }

    formatTimeSlotToRealDate = (timeSlot) => {

        let splitTimeBySpace = timeSlot.split(' ')
        let yearMonthDay = splitTimeBySpace[0].split("-")

        var sessionDateConverted = new Date(yearMonthDay[0], yearMonthDay[1], yearMonthDay[2], splitTimeBySpace[1].split(":")[0]);

        return sessionDateConverted
    }

    formatRealDateToTimeSlot = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let hours = date.getHours();

        let newTimeslot = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${hours < 10 ? `0${hours}:00` : `${hours}:00`}`
        return newTimeslot
    }

    addHour = timeSlot => {
        let timeSlotConverted = this.formatTimeSlotToRealDate(timeSlot)
        let dateAfterHourAdded = new Date(timeSlotConverted.setHours(timeSlotConverted.getHours() + 1));
        timeSlot = this.formatRealDateToTimeSlot(dateAfterHourAdded)
        return timeSlot
    }


    render() {

        return (
            <div>
                <Button color="info" onClick={this.toggle}>Add Session</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add Session</ModalHeader>
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
                                        return <option key={preference.id} id={preference.id} value={preference.id}>{preference.preference}</option>
                                    }
                                    )
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date: </label>
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
                            <label htmlFor="timeSlot">Timeslot: </label>
                            <select
                                defaultValue=""
                                name="startTime"
                                id="startTime"
                                onChange={this.handleFieldChange}
                            >

                                <option key="00:00" id="00:00" value="00:00">00:00</option>
                                <option key="01:00" id="01:00" value="01:00">01:00</option>
                                <option key="02:00" id="02:00" value="02:00">02:00</option>
                                <option key="03:00" id="03:00" value="03:00">03:00</option>
                                <option key="05:00" id="05:00" value="05:00">05:00</option>
                                <option key="06:00" id="06:00" value="06:00">06:00</option>
                                <option key="07:00" id="07:00" value="07:00">07:00</option>
                                <option key="08:00" id="08:00" value="08:00">08:00</option>
                                <option key="09:00" id="09:00" value="09:00">09:00</option>
                                <option key="10:00" id="10:00" value="10:00">10:00</option>
                                <option key="11:00" id="11:00" value="11:00">11:00</option>
                                <option key="12:00" id="12:00" value="12:00">12:00</option>
                                <option key="13:00" id="13:00" value="13:00">13:00</option>
                                <option key="14:00" id="14:00" value="14:00">14:00</option>
                                <option key="15:00" id="15:00" value="15:00">15:00</option>
                                <option key="16:00" id="16:00" value="16:00">16:00</option>
                                <option key="17:00" id="17:00" value="17:00">17:00</option>
                                <option key="18:00" id="18:00" value="18:00">18:00</option>
                                <option key="19:00" id="19:00" value="19:00">19:00</option>
                                <option key="20:00" id="20:00" value="20:00">20:00</option>
                                <option key="21:00" id="21:00" value="21:00">21:00</option>
                                <option key="22:00" id="22:00" value="22:00">22:00</option>
                                <option key="23:00" id="23:00" value="23:00">23:00</option>
                                <option key="24:00" id="24:00" value="24:00">24:00</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <select
                                defaultValue=""
                                name="endTime"
                                id="endTime"
                                onChange={this.handleFieldChange}
                            >

                                <option key="00:00" id="00:00" value="00:00">00:00</option>
                                <option key="01:00" id="01:00" value="01:00">01:00</option>
                                <option key="02:00" id="02:00" value="02:00">02:00</option>
                                <option key="03:00" id="03:00" value="03:00">03:00</option>
                                <option key="05:00" id="05:00" value="05:00">05:00</option>
                                <option key="06:00" id="06:00" value="06:00">06:00</option>
                                <option key="07:00" id="07:00" value="07:00">07:00</option>
                                <option key="08:00" id="08:00" value="08:00">08:00</option>
                                <option key="09:00" id="09:00" value="09:00">09:00</option>
                                <option key="10:00" id="10:00" value="10:00">10:00</option>
                                <option key="11:00" id="11:00" value="11:00">11:00</option>
                                <option key="12:00" id="12:00" value="12:00">12:00</option>
                                <option key="13:00" id="13:00" value="13:00">13:00</option>
                                <option key="14:00" id="14:00" value="14:00">14:00</option>
                                <option key="15:00" id="15:00" value="15:00">15:00</option>
                                <option key="16:00" id="16:00" value="16:00">16:00</option>
                                <option key="17:00" id="17:00" value="17:00">17:00</option>
                                <option key="18:00" id="18:00" value="18:00">18:00</option>
                                <option key="19:00" id="19:00" value="19:00">19:00</option>
                                <option key="20:00" id="20:00" value="20:00">20:00</option>
                                <option key="21:00" id="21:00" value="21:00">21:00</option>
                                <option key="22:00" id="22:00" value="22:00">22:00</option>
                                <option key="23:00" id="23:00" value="23:00">23:00</option>
                                <option key="24:00" id="24:00" value="24:00">24:00</option>
                            </select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.constructNewSession}>Add Session!</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AddSessionModal;