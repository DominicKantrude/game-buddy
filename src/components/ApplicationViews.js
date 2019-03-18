import { Route } from 'react-router-dom'
import React, { Component } from 'react';
import SessionList from "./SessionList"
import SessionDetail from "./SessionDetails"
import SessionManager from "../Modules/SessionManager"
import SessionForm from "./SessionForm"
import FriendsList from "./FriendsList"
import FriendsAddForm from "./FriendsAddForm"
import FriendsManager from "../Modules/FriendsManager"



// need to update some of the methods to reload info the same way. Really probably should refactor the code because that why its messing
//up when i change it in one place. Also coming back from friends to sessions doesnt seem to be affecting state properly.
//once these are taken care of i can decide what stretch goal to pursue. Eiterh API which will prob look the coolest or the scheduler


//http://localhost:3003/users?_embed=animals
//so what this does is get all animals with users conneceted?





class ApplicationViews extends Component {

    state = {
        usersSessions: [],
        friends: []
    }

    getSessionAndFriends() {
        const newState = {}


        FriendsManager.getUserFriends()
            .then(parsedFriends => {
                //add our friends with thier info to our new state
                newState.friends = parsedFriends
            })
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
                            fetchArray[0].forEach(sessionRelation => {
                                //create an array of just user ids to match in our if statement
                                const friendIds = newState.friends.map(friend => {
                                    return friend.user.id
                                })

                                //if that user is connected to the session and they are actually friends with the user push them to state
                                if (userSession.id === sessionRelation.sessionId && friendIds.includes(sessionRelation.user.id)) {
                                    userSession.users.push(sessionRelation.user.username)
                                }
                            });
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






    addSession = session => {

        //check the database for a session time that matches what the user input
        return fetch(`http://localhost:5002/sessions?timeSlot=${session.timeSlot}`)
            .then(r => r.json())
            .then(sessionThatMayExist => {

                //if the return from the fetch is not empty that session exists which means all we have to do is make a link to the session
                if (Object.keys(sessionThatMayExist).length !== 0) {
                    let newSessionRelation = {
                        sessionId: sessionThatMayExist[0].id,

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

                                userId: parseInt(sessionStorage.getItem("credentials"))
                            }
                            return SessionManager.addSessionUserRelation(newSessionRelation)
                        })
                }
            })
            .then(() => this.getSessionAndFriends())
    }

    //todo going to have to figure out how to break this promise chain early if we dont get ny results. currently it just decides to
    //grab all sessions if you cant find any .






    componentDidMount() {
        this.getSessionAndFriends()
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

            </React.Fragment >
        )
    }

















}

export default ApplicationViews
