import React, { Component } from "react"
import "./details.css"
import EditMessageModal from "./EditMessageModal"

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

    updateMessage = editedMessage =>{
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
                <section>
                    {
                        <div key={session.id} class="session">
                            <p>Session Date: {session.timeSlot}</p>
                            <p>Group Size: {session.groupSize}</p>
                            {

                                session.users.map(user => {
                                    return <p>User: {user}
                                    </p>
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
                                            <p>User: Me</p>
                                            <div>
                                                {message.message}
                                            </div>
                                            <EditMessageModal
                                                {...this.props} message={message} updateMessage={this.updateMessage}

                                            />
                                            <a href="#"
                                                onClick={() => this.deleteMessage(message.id)}
                                                className="card-link">Delete</a>

                                        </>)
                                        :
                                        (<>
                                            <p> User:  {message.user.username}</p>
                                            <div>
                                                {message.message}
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
            </React.Fragment >
        )
    }
}