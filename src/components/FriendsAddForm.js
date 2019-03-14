import React, { Component } from "react";

export default class SessionForm extends Component {
    // Set initial state

    state = {
        usernameToFind: ""
    };

    // Update state whenever an input field is edited
    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };

    constructNewFriend = evt => {
        evt.preventDefault();

        const friendsUsernameArray = this.props.friends.map(friend =>
            friend.user.username
        )


        if (friendsUsernameArray.includes(this.state.usernameToFind)) {
            window.alert("You are already friends with this user")
        } else {
            fetch(`http://localhost:5002/users?username=${this.state.usernameToFind}`)
                .then(r => r.json())
                .then(parsedstuff => {

                    const newFriendConnection = {
                        relatingUserId: parseInt(sessionStorage.getItem("credentials")),
                        userId: parsedstuff[0].id
                    }
                    this.props.addFriend(newFriendConnection)
                        .then(() => this.props.history.push("/friends"));
                })
        }
    }

    render() {
        return (
            <React.Fragment>
                <form className="friendForm">
                    <div className="form-group">
                        <label htmlFor="username">Enter a friend's username:</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            onChange={this.handleFieldChange}
                            id="usernameToFind"
                            placeholder="UsernameToFind"
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={this.constructNewFriend}
                        className="friendSaveAddButton"
                    >
                        Add Friend
          </button>
                </form>
            </React.Fragment>
        );
    }
}