import React, { Component } from "react"
import "./details.css"

export default class SessionDetail extends Component {

    state = {
        messages: []
    }

    //addMessage = message =>{}

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
        /*
            Using the route parameter, find the animal that the
            user clicked on by looking at the `this.props.animals`
            collection that was passed down from ApplicationViews
        */
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

                            <div key={message.id} className={`message ${(message.user.id == sessionStorage.getItem("credentials")) ? "ownMessage" : "otherUserMessage"}`}>

                                {
                                    (message.user.id == sessionStorage.getItem("credentials")) ?
                                        (<>
                                            <p>User: Me</p>
                                            <div>
                                                {message.message}
                                            </div>
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
                    {/* <a href="#"
                                                onClick={() => this.addMessage(message.id)}
                                                className="card-link">Add</a> */}
                    </div>

                </section>
            </React.Fragment >
        )
    }
}