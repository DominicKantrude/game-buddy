import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

let newFriendShip = {}
class AddFriendModal extends React.Component {

    state = {
        modal: false,
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
        //newFriendShip["friend"] = evt.target.value;
    };

    editMessage = evt => {
        evt.preventDefault()

        const editedMessage= {
            id: this.props.match.params.messageId,
            message: this.state.message,
            userId: this.state.breed,
            employeeId: parseInt(this.state.employeeId)
          };

        // newFriendShip = {
        //     userId: Number(sessionStorage.getItem("credentials")),
        //     friend: Number(document.querySelector("#friendId").value),
        // };

        // let previousFriend = true
        // let addYourself = true
        // if (newFriendShip.userId === newFriendShip.friend) {
        //     alert("You can't add yourself!")


        // } else {
        //     addYourself = false
        // }
        // let userIds = this.props.friendships.map(user => user.friend)
        // console.log(userIds)
        // if (userIds.includes(newFriendShip.friend)) {
        //     alert("Already your friend!")
        // } else {
        //     previousFriend = false
        // }

        // if (previousFriend === false && addYourself === false) {
        //     this.props.addFriend(newFriendShip).then(() => this.toggle())
        // }
    };

    render() {
        return (
            <div>
                <Button color="info" onClick={this.toggle}>Edit Message</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        {/* <select
                            defaultValue=""
                            name="friendId"
                            id="friendId"
                            onChange={this.handleFieldChange}

                        >
                            <option value="">Select a new friend</option>
                            {this.props.users.map(e => (
                                <option key={e.id} id="friend" value={e.id}>
                                    {e.username}
                                </option>
                            ))}
                        </select> */}
                        <textarea

                            className="form-control"
                            id="message"
                            placeholder="message"
                            onChange={this.handleFieldChange}
                            cols={40}
                            rows={10} />



                        here will go old message . will be a text area with the value set to old one.

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editMessage}>Edit Message!</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AddFriendModal;