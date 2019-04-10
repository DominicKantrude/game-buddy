import { Route } from 'react-router-dom'
import React, { Component } from 'react';
import SessionList from "./SessionList"
import SessionDetail from "./SessionDetails"
import SessionManager from "../Modules/SessionManager"

import FriendsList from "./FriendsList"

import FriendsManager from "../Modules/FriendsManager"
import ScheduleList from "./ScheduleList"


class ApplicationViews extends Component {

    state = {
        usersSessions: [],
        friends: [],
        preferences: [],
        schedules: [],
        initialLoad: false,
        sortBy: "groupSize"
    }

    //new thing. SO now we need to try to connect sessions. So when we grab a session we are going
    //to want to do a search at fro a session with the next value in time. Once we have that session we need
    //check to see if the users still match. If not all users match the session we had in the last step will be added as a session
    //to our state.  will then keep that session and modify it as needed. For instance if we check the next date see it
    //exists but with only one other user instead of say like two from before. we change thats sessions
    //to a new session time using all added hours. We can remove the users that are not attached anymore and
    //we then repeat the process till we dont have a connected session.






    getLoadInfo = () => {
        const newState = {}

        fetch(`http://localhost:5002/preferences`)
            .then(r => r.json())
            .then(parsedData => {
                newState.preferences = parsedData;
            })
            .then(fetch(`http://localhost:5002/schedules/?userId=${parseInt(sessionStorage.getItem("credentials"))}`)
                .then(r => r.json())
                .then(parsedSchedules => {
                    newState.schedules = parsedSchedules;
                }))
            .then(FriendsManager.getUserFriends()
                .then(parsedFriends => {
                    //add our friends with thier info to our new state
                    newState.friends = parsedFriends
                }))
            .then(() =>
                fetch(`http://localhost:5002/sessionUserRelation/?userId=${parseInt(sessionStorage.getItem("credentials"))}`)
                    .then(r => r.json())
                    .then(sessionUserRelations => {
                        if (sessionUserRelations.length !== 0) {
                            return sessionUserRelations.map(sessionUserRelation => {
                                return `id=${sessionUserRelation.sessionId}&&`
                            }).join("")
                        }
                        //TODO need to handle if its empty
                        else {
                            return ""
                        }
                    }))
            //first we get all sessionID that match the users userID that is saved in session storage. This will allow us to pull up all
            //sessions for that user

            //???????????????can we just do an expand up above??????????????

            //use the sessions IDs to get the actual sessions
            .then(sessionQuery => {
                return fetch(`http://localhost:5002/sessions/?${sessionQuery}`)
            })
            .then(r => r.json())
            .then(usersSessions => {

                //save these sessions to our new state
                newState.usersSessions = usersSessions

                let promises = []
                let fetchArray = []
                for (let index = 0; index < usersSessions.length; index++) {
                    const session = usersSessions[index];

                    //the promise brackets may be wrong right after r.json. This may not include the right resolve paramters. Cant check atm
                    //expand each user that is connected to the sessions we are looking at push that user to an array
                    promises[index] = Promise.resolve(fetch(`http://localhost:5002/sessionUserRelation/?${session.Id}&_expand=user`)
                        .then(r => r.json()))
                        .then(parsedData => {
                            fetchArray.push(parsedData)
                        })
                }
                //todo for somereason our promise chain returns multiple copies. should fix this to give us one so we dont have to target a specific index

                //once we have all the users we make a fetch to find all friends of our current user and expad thier info
                Promise.all(promises)
                    .then(() => {

                        //for each session we have stored in our new state loop. Go through our array of users connected
                        newState.usersSessions.forEach(userSession => {
                            let groupSize = 1;
                            fetchArray[0].forEach(sessionRelation => {
                                //create an array of just user ids to match in our if statement
                                const friendIds = newState.friends.map(friend => {
                                    return friend.user.id
                                })

                                //correct preference to session
                                if (userSession.id === sessionRelation.sessionId && parseInt(sessionStorage.getItem("credentials")) === sessionRelation.userId) {
                                    userSession.preference = newState.preferences[sessionRelation.preferenceId - 1].preference
                                }

                                //if that user is connected to the session and they are actually friends with the user push them to state and add the preference
                                //of  the game theu want to play
                                if (userSession.id === sessionRelation.sessionId && friendIds.includes(sessionRelation.user.id)) {
                                    groupSize++;
                                    userSession.users.push({ user: sessionRelation.user.username, preference: newState.preferences[sessionRelation.preferenceId - 1].preference })
                                }
                            });
                            userSession.groupSize = groupSize;
                        });

                        if (this.state.sortBy === "groupSize") {
                            newState.usersSessions = newState.usersSessions.sort(function (userSessionA, userSessionB) { return userSessionB.groupSize - userSessionA.groupSize });
                        } else {

                            newState.usersSessions = newState.usersSessions.sort(function (userSessionA, userSessionB) { return new Date(userSessionA.timeSlot) - new Date(userSessionB.timeSlot) });
                        }

                        this.combineLikeTimeslots(newState.usersSessions)

                        //push new state which now shows all sessions for that user with all users that are friends that are connected to thier sessions
                        this.setState(newState)
                    })
            })
    }

    combineLikeTimeslots = usersSessions => {
        let futureTimeslots = [];
        usersSessions.forEach(session => {
            //if a session contains the timedate after we add an hour store the new time into a new userSessions array.
            console.log(session.timeSlot)
            futureTimeslots.push(this.addHour(session));

            if (futureTimeslots.includes(session.timeSlot)) {
                console.log("we need to combine possibly")
            }
        })
        console.log(futureTimeslots)
    }





    toggleSorting = sortingType => {
        const newState = {}
        newState.sortBy = sortingType
        this.setState(newState)

    }

    deleteFriend = id => {
        const newState = {}
        //do some fetch shit and delete the friends connection. then reload
        fetch(`http://localhost:5002/friends/${id}`, {
            method: "DELETE"
        })
            .then(() =>
                fetch(`http://localhost:5002/friends?relatingUserId=${parseInt(sessionStorage.getItem("credentials"))}&_expand=user`)
                    .then(r => r.json())
                    .then(parsedFriends => {
                        newState.friends = parsedFriends
                        this.setState(newState)
                    }))
    }

    deleteSession = id => {

        //make a check to see if only one user is attached to the session.
        fetch(`http://localhost:5002/sessionUserRelation?sessionId=${id}`)
            .then(e => e.json())
            .then(parsedShiiz => {

                if (parsedShiiz.length > 1) {
                    var found = parsedShiiz.find(function (sessionRelation) {

                        return sessionRelation.userId === parseInt(sessionStorage.getItem("credentials"));
                    });
                    //if more then one are attached. delete the specific user at that user id from the relation table
                    return fetch(`http://localhost:5002/sessionUserRelation/${found.id}`, {
                        method: "DELETE"
                    })
                } else {
                    var found = parsedShiiz.find(function (sessionRelation) {
                        return sessionRelation.userId === parseInt(sessionStorage.getItem("credentials"));
                    });
                    return fetch(`http://localhost:5002/sessionUserRelation/${found.id}`, {
                        method: "DELETE"
                    }).then(() => {
                        return fetch(`http://localhost:5002/sessions/${id}`, {
                            method: "DELETE"
                        })
                    })
                }
            }).then(() => this.getLoadInfo())

    }


    deleteTiedSessions = (id) => {
        var currentDate = new Date();
        var day = currentDate.getDay()
        let nearestSunday = this.minusDays(currentDate, day)

        //so now all we gotta do is a fetch for the schedule that matches the id we are trying to delete
        fetch(`http://localhost:5002/schedules/${id}`)
            .then(e => e.json())
            .then(schedule => {
                //get the dates the schedule would create
                let scheduleSessionsObject = this.getScheduledSessions(nearestSunday, schedule)
                console.log(schedule)
                scheduleSessionsObject.forEach(sessionDateToDelete => {
                    //get the actual sessions associated with the times the schedule created
                    fetch(`http://localhost:5002/sessions?timeSlot=${sessionDateToDelete.timeSlot}`)
                        .then(e => e.json())
                        .then(actualSessionsToDelete => {
                            this.deleteSession(actualSessionsToDelete[0].id)
                        })
                });
            })
    }


    deleteSchedule = (id) => {
        if (window.confirm("Would you like to delete all created sessions from this schedule?")) {
            this.deleteTiedSessions(id)
        }
        fetch(`http://localhost:5002/schedules/${id}`, {
            method: "DELETE"
        })
            .then(() => this.getLoadInfo())
    }

    addFriend = friendToAdd => {
        const newState = {}
        return fetch("http://localhost:5002/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(friendToAdd)
        }).then(() => {

            fetch(`http://localhost:5002/friends?relatingUserId=${parseInt(sessionStorage.getItem("credentials"))}&_expand=user`)
                .then(r => r.json())
                .then(parsedFriends => {
                    newState.friends = parsedFriends
                    this.setState(newState)
                })
        }).then(() => this.getLoadInfo())
    }

    addSession = (session, preference) => {

        //check the database for a session time that matches what the user input
        return fetch(`http://localhost:5002/sessions?timeSlot=${session.timeSlot}`)
            .then(r => r.json())
            .then(sessionThatMayExist => {
                console.log(preference)
                //if the return from the fetch is not empty that session exists which means all we have to do is make a link to the session
                if (Object.keys(sessionThatMayExist).length !== 0) {
                    let newSessionRelation = {
                        sessionId: sessionThatMayExist[0].id,
                        preferenceId: preference,
                        userId: parseInt(sessionStorage.getItem("credentials"))
                    }

                    fetch(`http://localhost:5002/sessionUserRelation?userId=${parseInt(sessionStorage.getItem("credentials"))}&sessionId=${sessionThatMayExist[0].id}`)
                        .then(r => r.json())
                        .then(sessionRelationThatMayExist => {
                            //check if session already exists
                            if (Object.keys(sessionRelationThatMayExist).length === 0) {
                                return SessionManager.addSessionUserRelation(newSessionRelation)
                            }
                        }).then(() => this.getLoadInfo())
                }
                //if the session doesnt exist create a session and also make a link to that session
                else {
                    return SessionManager.addObject(session)
                        .then((addedsession) => {
                            let newSessionRelation = {
                                sessionId: addedsession.id,
                                preferenceId: preference,
                                userId: parseInt(sessionStorage.getItem("credentials"))
                            }
                            //check if session already exists
                            if (true) {
                                return SessionManager.addSessionUserRelation(newSessionRelation)
                            }
                        })
                }
            })
            .then(() => this.getLoadInfo())
    }

    addSchedule = schedule => {
        const newState = {}
        return fetch("http://localhost:5002/schedules", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(schedule)
        }).then(() => {
            fetch(`http://localhost:5002/schedules/?userId=${parseInt(sessionStorage.getItem("credentials"))}`)
                .then(r => r.json())
                .then(parsedSchedules => {
                    newState.schedules = parsedSchedules;
                    this.setState(newState)
                })
        })
    }

    //todo going to have to figure out how to break this promise chain early if we dont get ny results. currently it just decides to
    //grab all sessions if you cant find any .
    addScheduledSessionsToDatabase() {
        if (this.state.initialLoad === false) {
            fetch(`http://localhost:5002/schedules/?userId=${parseInt(sessionStorage.getItem("credentials"))}`)
                .then(r => r.json())
                .then(parsedSchedules => {
                    this.state.initialLoad = true;

                    var currentDate = new Date();
                    var day = currentDate.getDay()
                    let nearestSunday = this.minusDays(currentDate, day)

                    //loop through all users schedules and add appropriate sessionsÍ
                    parsedSchedules.forEach(schedule => {

                        let scheduleSessionsObject = this.getScheduledSessions(nearestSunday, schedule)

                        scheduleSessionsObject.forEach(newSession => {

                            this.addSession(newSession, schedule.preference)
                        });
                    });
                }).then(() => this.getLoadInfo())
        }
    }

    getScheduledSessions = (nearestSunday, schedule) => {
        //run loop 5 times to add the 5 next sessions from current date
        let firstPassthrough = true;
        let sessionDateToAdd = 0;
        let scheduleSessionsObject = [];
        for (let i = 0; i <= 5; i++) {
            //if its the first pass through just add the day picked to sunday which is our 0
            if (firstPassthrough) {
                firstPassthrough = false;
                sessionDateToAdd = this.addDays(nearestSunday, schedule.dayIncrementor)

            }
            //if its not the first pass add 7 days to give us our next date at that day. ex next friday
            else {
                sessionDateToAdd = this.addDays(sessionDateToAdd, 7)

            }
            let year = sessionDateToAdd.getFullYear();
            let month = sessionDateToAdd.getMonth() + 1;
            let day = sessionDateToAdd.getDate();

            let session =
            {
                timeSlot: `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${schedule.time}`,
                groupSize: "",
                users: [],
            }
            scheduleSessionsObject.push(session)

        }
        return scheduleSessionsObject
    }


    formatTimeSlotToRealDate(timeSlot) {
        let splitTimeBySpace = timeSlot.split(' ')
        let yearMonthDay = splitTimeBySpace[0].split("-")

        var sessionDateConverted = new Date(yearMonthDay[0], yearMonthDay[1], yearMonthDay[2], splitTimeBySpace[1].split(":")[0]);

        return sessionDateConverted
    }

    formatRealDateToTimeSlot(date) {
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let hours = date.getHours();

        let newTimeslot = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${hours < 10 ? `0${hours}:00` : `${hours}:00`}-${hours + 1 < 10 ? `0${hours + 1}:00` : `${hours + 1}:00`}`
        return newTimeslot

    }

    addHour = session => {
        let sessionDateConverted = this.formatTimeSlotToRealDate(session.timeSlot)
        let dateAfterHourAdded = new Date(sessionDateConverted.setHours(sessionDateConverted.getHours() + 1));

        return this.formatRealDateToTimeSlot(dateAfterHourAdded)
    }

    minusDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    componentDidMount() {
        this.getLoadInfo()
        this.addScheduledSessionsToDatabase()

    }

    editSchedule = (editedSchedule, oldSchedule) => {
        const newState = {}
        this.deleteTiedSessions(editedSchedule.id)
        fetch(`http://localhost:5002/schedules/${editedSchedule.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedSchedule)
        }).then(() => {
            fetch(`http://localhost:5002/schedules/?userId=${parseInt(sessionStorage.getItem("credentials"))}`)
                .then(r => r.json())
                .then(parsedSchedules => {
                    newState.schedules = parsedSchedules;
                    this.setState(newState)
                }).then(() => this.getLoadInfo())
        })
    }



    render() {

        return (
            <React.Fragment >
                <Route exact path="/session" render={(props) => {
                    return <SessionList {...props} userSessions={this.state.usersSessions} deleteSession={this.deleteSession}
                        toggleSorting={this.toggleSorting} addSession={this.addSession} preferences={this.state.preferences} getLoadInfo={this.getLoadInfo} />
                }} />
                <Route exact path="/session/:sessionId(\d+)" render={(props) => {
                    return <SessionDetail {...props} deleteMessage={this.deleteMessage} sessions={this.state.usersSessions} />
                }} />

                <Route exact path="/friends" render={props => {
                    // if (this.isAuthenticated()) {
                    return <FriendsList {...props}
                        friends={this.state.friends}
                        deleteFriend={this.deleteFriend}
                        addFriend={this.addFriend}
                    />
                    // } else {
                    //     return <Redirect to="/login" />
                    // }
                }} />

                <Route exact path="/schedules" render={(props) => {
                    return <ScheduleList {...props}
                        editSchedule={this.editSchedule}
                        preferences={this.state.preferences}
                        addSchedule={this.addSchedule}
                        schedules={this.state.schedules}
                        deleteSchedule={this.deleteSchedule}
                    />
                }} />

            </React.Fragment >
        )
    }

















}

export default ApplicationViews
