import { Route } from 'react-router-dom'
import React, { Component } from 'react';
import SessionList from "./SessionList"
import SessionDetail from "./SessionDetails"
import SessionManager from "../Modules/SessionManager"
import SessionForm from "./SessionForm"

class ApplicationViews extends Component {

    state = {
        usersSessions: []
    }

    deleteSession = id => {
        const newState = {}
        //make a check to see if only one user is attached to the session.
        fetch(`http://localhost:5002/sessionUserRelation?sessionId=${id}`)
            .then(e => e.json())
            .then(parsedShiiz => {

                if (parsedShiiz.length > 1) {
                    var found = parsedShiiz.find(function (sessionRelation) {
                        //will need to add actual user Id here
                        return sessionRelation.userId === sessionStorage.getItem("credentials");
                    });
                    //if more then one are attached. delete the specific user at that user id from the relation table
                    return fetch(`http://localhost:5002/sessionUserRelation/${found.id}`, {
                        method: "DELETE"
                    })
                } else {
                    var found = parsedShiiz.find(function (sessionRelation) {
                        //will need to add actual user Id here
                        return sessionRelation.userId === sessionStorage.getItem("credentials");
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
            .then(() => fetch(`http://localhost:5002/sessionUserRelation/?userId=${sessionStorage.getItem("credentials")}`)
                .then(r => r.json())
                .then(sessionUserRelations => {
                    return sessionUserRelations.map(sessionUserRelation => {
                        return `id=${sessionUserRelation.sessionId}&&`
                    }).join("")
                })
                .then(sessionQuery => fetch(`http://localhost:5002/sessions/?${sessionQuery}`))
                .then(r => r.json())
                .then(usersSessions => {
                    newState.usersSessions = usersSessions
                    console.log(newState)
                    let promises = []
                    let fetchArray = []
                    for (let index = 0; index < usersSessions.length; index++) {

                        const session = usersSessions[index];
                        promises[index] = Promise.resolve(fetch(`http://localhost:5002/sessionUserRelation/?${session.Id}&_expand=user`)
                            .then(r => r.json()))
                            .then(parsedData => {
                                fetchArray.push(parsedData)
                            })
                    }
                    //todo for somereason our promise chain returns multiple copies. should fix this to give us one so we dont have to target a specific index
                    Promise.all(promises)
                        .then(() => {

                            newState.usersSessions.forEach(userSession => {
                                fetchArray[0].forEach(sessionRelation => {
                                    if (userSession.id === sessionRelation.sessionId) {
                                        userSession.users.push(sessionRelation.user.username)
                                    }
                                });
                            });
                            this.setState(newState)
                        })
                })
            ).then(() => { return "" })
    }

    addSession = session => {
        const newState = {}
        return fetch(`http://localhost:5002/sessions?timeSlot=${session.timeSlot}`)
            .then(r => r.json())
            .then(sessionThatMayExist => {


                //at this point if the session mathces a date time is already exists. this means
                //we dont want to post the actual session to the database as it is a repeat.
                //we do however want link that user to the session that is a repeat in our userrealtionship
                //---if this session does not exist.we want to make a post to the database as well
                //as create a link in the user relations

                if (Object.keys(sessionThatMayExist).length !== 0) {

                    let newSessionRelation = {
                        sessionId: sessionThatMayExist[0].id,

                        userId: sessionStorage.getItem("credentials")
                    }
                    return fetch("http://localhost:5002/sessionUserRelation", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newSessionRelation)
                    })
                }
                else {

                    return SessionManager.addObject(session)
                        .then((addedsession) => {
                            let newSessionRelation = {
                                sessionId: addedsession.id,

                                userId: sessionStorage.getItem("credentials")
                            }

                            return fetch("http://localhost:5002/sessionUserRelation", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(newSessionRelation)
                            })
                        })
                }
            })
            .then(() => fetch(`http://localhost:5002/sessionUserRelation/?userId=${sessionStorage.getItem("credentials")}`)
                .then(r => r.json())
                .then(sessionUserRelations => {
                    return sessionUserRelations.map(sessionUserRelation => {
                        return `id=${sessionUserRelation.sessionId}&&`
                    }).join("")
                })
                .then(sessionQuery => fetch(`http://localhost:5002/sessions/?${sessionQuery}`))
                .then(r => r.json())
                .then(usersSessions => {
                    newState.usersSessions = usersSessions
                    console.log(newState)
                    let promises = []
                    let fetchArray = []
                    for (let index = 0; index < usersSessions.length; index++) {

                        const session = usersSessions[index];
                        promises[index] = Promise.resolve(fetch(`http://localhost:5002/sessionUserRelation/?${session.Id}&_expand=user`)
                            .then(r => r.json()))
                            .then(parsedData => {
                                fetchArray.push(parsedData)
                            })
                    }
                    //todo for somereason our promise chain returns multiple copies. should fix this to give us one so we dont have to target a specific index
                    Promise.all(promises)
                        .then(() => {
                            newState.usersSessions.forEach(userSession => {
                                fetchArray[0].forEach(sessionRelation => {
                                    if (userSession.id === sessionRelation.sessionId) {
                                        userSession.users.push(sessionRelation.user.username)
                                    }
                                });
                            });
                            this.setState(newState)
                        })
                })
            ).then(() => { return "" })
    }

//todo going to have to figure out how to break this promise chain early if we dont get ny results. currently it just decides to
//grab all sessions if you cant find any .




    componentDidMount() {
        const newState = {}

        fetch(`http://localhost:5002/sessionUserRelation/?userId=${sessionStorage.getItem("credentials")}`)
            .then(r => r.json())
            .then(sessionUserRelations => {
                 if(sessionUserRelations.length !== 0){
                return sessionUserRelations.map(sessionUserRelation => {
                    return `id=${sessionUserRelation.sessionId}&&`
                }).join("")}
                else{
                    return ""
                }
            })
            .then(sessionQuery => {
                return fetch(`http://localhost:5002/sessions/?${sessionQuery}`)
            })
            .then(r => r.json())
            .then(usersSessions => {
                console.log(usersSessions)
                newState.usersSessions = usersSessions

                let promises = []
                let fetchArray = []
                for (let index = 0; index < usersSessions.length; index++) {
                    const session = usersSessions[index];
                    promises[index] = Promise.resolve(fetch(`http://localhost:5002/sessionUserRelation/?${session.Id}&_expand=user`)
                        .then(r => r.json()))
                        .then(parsedData => {
                            fetchArray.push(parsedData)
                        })
                }
                //todo for somereason our promise chain returns multiple copies. should fix this to give us one so we dont have to target a specific index
                Promise.all(promises)
                    .then(() => {

                        newState.usersSessions.forEach(userSession => {
                            fetchArray[0].forEach(sessionRelation => {
                                if (userSession.id === sessionRelation.sessionId) {
                                    userSession.users.push(sessionRelation.user.username)
                                }
                            });
                        });

                        this.setState(newState)
                    })
            })




        //now to ge the related users per session






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


    }

    render() {
        console.log(this.props.activeUser)
        return (

            <React.Fragment >
                <Route exact path="/session" render={(props) => {
                    return <SessionList {...props} userSessions={this.state.usersSessions} users={this.state.users} deleteSession={this.deleteSession} />
                }} />
                <Route path="/session/:sessionId(\d+)" render={(props) => {
                    return <SessionDetail {...props} sessions={this.state.usersSessions} users={this.state.users} />
                }} />
                <Route path="/session/new" render={(props) => {
                    return <SessionForm {...props}
                        addSession={this.addSession}
                        usersSessions={this.state.usersSessios} />
                }} />

            </React.Fragment >
        )
    }

















}

export default ApplicationViews
