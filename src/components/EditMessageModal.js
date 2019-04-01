import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';


class EditMessageModal extends React.Component {

    state = {
        modal: false,
        id: this.props.message.id,
        userId: this.props.message.userId,
        message: this.props.message.message,
        sessionId: this.props.message.sessionId
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

        const editedMessage = {
            id: this.state.id,
            message: this.state.message,
            userId: this.state.userId,
            sessionId: this.state.sessionId
        };

        this.setState({ modal: false })
        this.props.updateMessage(editedMessage)
    };


    render() {

        return (
            <div>
                <Fab color="info" size="small" onClick={this.toggle} aria-label="Edit">
                    <Icon>edit_icon</Icon>
                </Fab>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Edit Message</ModalHeader>
                    <ModalBody>
                        <textarea

                            className="form-control"
                            id="message"
                            placeholder={this.state.message}
                            onChange={this.handleFieldChange}
                            cols={40}
                            rows={10} />
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

export default EditMessageModal;