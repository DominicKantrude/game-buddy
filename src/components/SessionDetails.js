import React, { Component } from "react"
import "./details.css"
import EditMessageModal from "./EditMessageModal"

import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';


export default class SessionDetail extends Component {


    state = {
        messages: [],
        message: ""
    }


    // Update state whenever an input field is edited
    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };

    /*
          Local method for validation, creating animal object, and
          invoking the function reference passed from parent component
       */
    constructNewMessage = evt => {
        evt.preventDefault();

        const newMessage = {
            message: this.state.message,
            userId: parseInt(sessionStorage.getItem("credentials")),
            sessionId: parseInt(this.props.match.params.sessionId)
        };

        fetch("http://localhost:5002/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMessage)
        }).then(() => {
            const newState = {}
            fetch(`http://localhost:5002/messages?sessionId=${this.props.match.params.sessionId}&_expand=user`)
                .then(e => e.json())
                .then(parsedMessages => {
                    newState.messages = parsedMessages
                    this.setState(newState)
                })

        })
        const newState = {};

    }

    deleteMessage = id => {
        const newState = {}
        fetch(`http://localhost:5002/messages/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                fetch(`http://localhost:5002/messages?sessionId=${this.props.match.params.sessionId}&_expand=user`)
                    .then(e => e.json())
                    .then(parsedMessages => {
                        newState.messages = parsedMessages
                        this.setState(newState)
                    })
            })
    }

    updateMessage = editedMessage => {
        const newState = {}
        fetch(`http://localhost:5002/messages/${editedMessage.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editedMessage)
        })
            .then(() => {
                fetch(`http://localhost:5002/messages?sessionId=${this.props.match.params.sessionId}&_expand=user`)
                    .then(e => e.json())
                    .then(parsedMessages => {
                        newState.messages = parsedMessages
                        this.setState(newState)
                    })
            })
    }

    componentDidMount() {

        const newState = {}
        const session = this.props.sessions.find(session => session.id === parseInt(this.props.match.params.sessionId)) || {}



        fetch(`http://localhost:5002/messages?sessionId=${session.id}&_expand=user`)
            .then(e => e.json())
            .then(parsedMessages => {
                newState.messages = parsedMessages
                this.setState(newState)
            })
    }

    render() {

        const session = this.props.sessions.find(session => session.id === parseInt(this.props.match.params.sessionId)) || {}

        return (
            <React.Fragment >
                <section class="messageSectionContainer">
                    <h1>Details</h1>
                    <section>
                        {
                            <div key={session.id} className="session">
                                <p>Session Date: {session.timeSlot}</p>
                                <p>Group Size: {session.groupSize}</p>
                                {
                                    session.users.map(user => {
                                        return <div className="flex-row ">
                                        <p className="users"> User: {user.user} </p>
                                        <p className="users">Preference: {user.preference}</p>
                                        </div>
                                    })
                                }
                            </div>
                        }
                    </section>
                    <section className="messagesContainer">
                        <h1>Messages</h1>
                        {
                            this.state.messages.map(message =>

                                <div key={message.id} className={`message ${(message.user.id == parseInt(sessionStorage.getItem("credentials"))) ? "ownMessage" : "otherUserMessage"}`}>
                                    {

                                        (message.user.id == parseInt(sessionStorage.getItem("credentials"))) ?
                                            (<>

                                                <div>

                                                    <p>Me</p>
                                                </div>
                                                <div class="messageContentMe">
                                                    <div className="flex-row">
                                                        <div className="width-80percent">
                                                            {message.message}
                                                        </div>

                                                        <div className="width-20percent flex-row pushBottom">
                                                            <EditMessageModal
                                                                {...this.props} message={message} updateMessage={this.updateMessage}
                                                            />
                                                            <IconButton className="flow-right" aria-label="Delete" onClick={() => this.deleteMessage(message.id)}
                                                                className="card-link">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>

                                            </>)
                                            :
                                            (<>
                                                <div class="flexEnd">
                                                    <div class="messageContentYou">
                                                        {message.message}
                                                    </div>
                                                    <div>
                                                        <p>{message.user.username}</p>
                                                    </div>
                                                </div>
                                            </>)
                                    }
                                </div>
                            )
                        }
                        <div>
                            <form className="form">
                                <div className="users">
                                    <label htmlFor="thing">Message</label>
                                    <textarea

                                        className="form-control"
                                        id="message"
                                        placeholder="message"
                                        onChange={this.handleFieldChange}
                                        cols={40}
                                        rows={10} />
                                </div>
                                <button
                                    type="submit"
                                    onClick={this.constructNewMessage}
                                    className="btn btn-primary"
                                >
                                    Submit
                            </button>


                            </form>
                        </div>
                    </section>
                </section>
            </React.Fragment >
        )
    }
}