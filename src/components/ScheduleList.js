import React, { Component } from 'react';
import AddScheduleModal from "./AddSceduleModal"
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


class ScheduleList extends Component {

    render() {
        const dateArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        return (
            <React.Fragment>
                <section class="commonContainer">
                    <h1>Schedules</h1>

                    <AddScheduleModal
                        {...this.props} addSchedule={this.props.addSchedule} preferences={this.props.preferences}
                    />
                    <div className="flex-wrap-stretch ">
                        {
                            this.props.schedules.map(schedule =>
                                <>
                                    <div className="flex-wrap-child-50  center">
                                        <div key={`schedule--${schedule.id}`} class="schedule smallCard">
                                            {/* TODO need to rename dayIncrementor to dayInteger */}

                                            <p>Day: {dateArray[schedule.dayIncrementor]}</p>
                                            {console.log(this.props.preferences)}
                                            <p>Preference: {this.props.preferences[schedule.preference - 1].preference}</p>
                                            <div className="flex-row-space-between">
                                                <p>Time: {schedule.time}</p>

                                                <IconButton aria-label="Delete" onClick={() => {
                                                    this.props.deleteSchedule(schedule.id)
                                                }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                            </div>

                                        </div>
                                    </div>

                                </>

                            )}
                    </div>

                </section>

            </React.Fragment>
        );
    }
}
export default ScheduleList