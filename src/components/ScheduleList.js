import React, { Component } from 'react';

class ScheduleList extends Component {

    render() {
        return (
            <React.Fragment>
                <h1>Schedules</h1>
                {
                    this.props.schedules.map(schedule =>
                        <div key={schedule.id} class="schedule">
                            <p>Day: {schedule.day}</p>
                            <p>Time: {schedule.time}</p>
                        </div>
                    )}

            </React.Fragment>
        );
    }
}
export default ScheduleList