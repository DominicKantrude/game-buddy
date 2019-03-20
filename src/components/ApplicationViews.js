import { Route } from 'react-router-dom'
import React, { Component } from 'react';
import SessionList from "./SessionList"
import SessionDetail from "./SessionDetails"
import SessionManager from "../Modules/SessionManager"
import SessionForm from "./SessionForm"
import FriendsList from "./FriendsList"
import FriendsAddForm from "./FriendsAddForm"
import FriendsManager from "../Modules/FriendsManager"
import ScheduleList from "./ScheduleList"


// need to update some of the methods to reload info the same way. Really probably should refactor the code because that why its messing
//up when i change it in one place. Also coming back from friends to sessions doesnt seem to be affecting state properly.
//once these are taken care of i can decide what stretch goal to pursue. Eiterh API which will prob look the coolest or the scheduler


//http://localhost:3003/users?_embed=animals
//so what this does is get all animals with users conneceted?

class ApplicationViews extends Component {

    state = {
        usersSessions: [],
        friends: [],
        preferences: [],
        schedules: [],
        initialLoad: false
    }

    getLoadInfo() {
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
                                    userSession.users.push(sessionRelation.user.username + " Preference: " + newState.preferences[sessionRelation.preferenceId - 1].preference)
                                }
                            });
                            userSession.groupSize = groupSize;
                        });
                        //push new state which now shows all sessions for that user with all users that are friends that are connected to thier sessions
                        this.setState(newState)
                    })
            })
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
            })
            .then(() => this.getSessionAndFriends())
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
        })
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
                    return SessionManager.addSessionUserRelation(newSessionRelation)
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
                            return SessionManager.addSessionUserRelation(newSessionRelation)
                        })
                }
            })
            .then(() => this.getLoadInfo())
    }

    //todo going to have to figure out how to break this promise chain early if we dont get ny results. currently it just decides to
    //grab all sessions if you cant find any .
    addScheduledSession() {
        if (this.state.initialLoad === false) {
            fetch(`http://localhost:5002/schedules/?userId=${parseInt(sessionStorage.getItem("credentials"))}`)
                .then(r => r.json())
                .then(parsedSchedules => {
                    this.state.initialLoad = true;
                    console.log("i ran")
                    var currentDate = new Date();
                    var day = currentDate.getDay()
                    console.log({ currentDate })
                    console.log({ day })
                    let nearestSunday = this.minusDays(currentDate, day)
                    //we need to pull all schedules for the usersid

                    parsedSchedules.forEach(schedule => {
                        let firstPassthrough = true;
                        let sessionDateToAdd = 0;

                        if (firstPassthrough) {
                            firstPassthrough = false;
                            //add schedule day amount
                            sessionDateToAdd = this.addDays(nearestSunday, schedule.dayIncrementor)
                            console.log(sessionDateToAdd)
                        } else {
                            sessionDateToAdd += 7
                        }
                        let year = sessionDateToAdd.getFullYear();
                        let month = sessionDateToAdd.getMonth();
                        let day = sessionDateToAdd.getDate();
                        let session =
                        {
                            timeSlot: `${year}/${month}/${day}  ${schedule.time}`,
                            groupSize: "",
                            users: [],
                        }
                        console.log(session)
                        this.addSession(session, 1)
                    });

                    //console.log(this.addDays(currentDate, //this will be from our scheduler))

                    //0 is sunday
                    //we subtract the day number from our month to set us to the nearest sunday.




                })

            //we then grab the last day of the month so we
            //now when to increment the next month. we then add the day converted to number to our startSunday and check if that passes
            //the threshhold. if i does subrtact the threshold increment the month and add the day as a reminder. add the time as well.
            //loop through this 4 times add these to an array. For each in the array send that argument to our add session with it formated
            //properly to be added to the database.
        }
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
        this.addScheduledSession()

    }
    //*******this is fetch stuffs */

    // var obj = {
    //     method: 'GET',
    //     headers: {
    //         "mode": "no-cors",
    //     //"Authorization": "hv0QW60mrc5hKMms3TfDWoFnZeZgiF5vk6unKbgWdrA",
    //     "Authorization": "1512813b-81f0-472d-a026-273ee5baded1",
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',

    //     }
    // }
    // // fetch('https://www.apexlegendsapi.com/api/v1/player?platform={pc}&name={LordVngy}', obj)
    // // .then(r => r.json())
    // // .then(stores => console.log(stores))

    // fetch('https://public-api.tracker.gg/apex/v1/standard/profile/{5}/{LordVngy}', obj)
    // .then(r => r.json())
    // .then(stores => console.log(stores))




    render() {
        console.log(this.state)
        return (
            <React.Fragment >
                <Route exact path="/session" render={(props) => {
                    return <SessionList {...props} userSessions={this.state.usersSessions} deleteSession={this.deleteSession} />
                }} />
                <Route exact path="/session/:sessionId(\d+)" render={(props) => {
                    return <SessionDetail {...props} deleteMessage={this.deleteMessage} sessions={this.state.usersSessions} />
                }} />
                <Route exact path="/session/new" render={(props) => {
                    return <SessionForm {...props}
                        preferences={this.state.preferences}
                        addSession={this.addSession}
                        usersSessions={this.state.usersSessios} />
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
                <Route exact path="/friends/new" render={(props) => {
                    return <FriendsAddForm {...props}
                        friends={this.state.friends}
                        addFriend={this.addFriend} />
                }} />
                <Route exact path="/schedules" render={(props) => {
                    return <ScheduleList {...props}
                        schedules={this.state.schedules}
                    />
                }} />

            </React.Fragment >
        )
    }

















}

export default ApplicationViews
