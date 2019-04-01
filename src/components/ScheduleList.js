import React, { Component } from 'react';
import AddScheduleModal from "./AddSceduleModal"
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditScheduleModal from "./EditScheduleModel";

class ScheduleList extends Component {

    render() {
        const dateArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        return (
            <React.Fragment>
                <section class="commonContainer center-background">
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
                                            <div className="flex-row-space">
                                                <p className="width-80percent">Time: {schedule.time}</p>
                                                <div className="flex-row width-20percent ">
                                                    <EditScheduleModal
                                                        {...this.props} schedule={schedule} editSchedule={this.props.editSchedule}
                                                    />
                                                    <IconButton aria-label="Delete" onClick={() => {
                                                        this.props.deleteSchedule(schedule.id)
                                                    }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>

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