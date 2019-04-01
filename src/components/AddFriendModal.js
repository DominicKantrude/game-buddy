import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AddFriendModal extends React.Component {

    state = {
        modal: false,
        usernameToFind: ""
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    handleFieldChange = evt => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
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
                    this.setState({ modal: false })
                    this.props.addFriend(newFriendConnection)
                })
        }
    }

    render() {

        return (
            <div>
                <Button color="info" onClick={this.toggle}>Add Friend</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add Schedule</ModalHeader>
                    <ModalBody>
                    <div className="form-group">
                        <label htmlFor="username">Enter a friend's username: </label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            onChange={this.handleFieldChange}
                            id="usernameToFind"
                            placeholder="UsernameToFind"
                        />
                    </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.constructNewFriend}>Add a friend!</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AddFriendModal;