import React, { Component } from 'react';

class ScheduleList extends Component {



    render() {
        const dateArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        return (
            <React.Fragment>
                <section class="commonContainer">
                    <h1>Schedules</h1>
                    <div className="animalButton">
                        <button type="button"
                            className="myButton btn btn-success"
                            onClick={() => {
                                this.props.history.push("/schedules/new")
                            }
                            }>
                            Add Schedule
                    </button>
                    </div>
                    {
                        this.props.schedules.map(schedule =>
                            <>
                            <div key={`schedule--${schedule.id}`} class="schedule card">
                                {/* TODO need to rename dayIncrementor to dayInteger */}

                                <p>Day: {dateArray[schedule.dayIncrementor]}</p>
                                <p>Time: {schedule.time}</p>
                                <button type="button"
                             className="sessionDeleteButton myButton btn btn-primary"
                             onClick={() => {
                                 this.props.deleteSchedule(schedule.id)
                             }
                             }>Delete</button>
                            </div>

                            </>
                        )}

                </section>

            </React.Fragment>
        );
    }
}
export default ScheduleList