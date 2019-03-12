import React, { Component } from "react"
import "./details.css"

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
            userId: sessionStorage.getItem("credentials"),
            sessionId: this.props.match.params.sessionId
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
        console.log(this.props.sessions)
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

                            <div key={message.id} className={`message ${(message.user.id == sessionStorage.getItem("credentials")) ? "ownMessage" : "otherUserMessage"}`}>

                                {
                                    (message.user.id == sessionStorage.getItem("credentials")) ?
                                        (<>
                                            <p>User: Me</p>
                                            <div>
                                                {message.message}
                                            </div>
                                            <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => {
                                                this.props.history.push(`/session/${session.id}/edit`);
                                            }}
                                        >
                                            Edit
                                        </button>
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



                        {/* <a href="#"
                                                onClick={() => this.addMessage(message.id)}
                                                className="card-link">Add</a> */}
                    </div>

                </section>
            </React.Fragment >
        )
    }
}