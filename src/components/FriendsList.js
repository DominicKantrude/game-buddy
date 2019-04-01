import React, { Component } from 'react'
import AddFriendModal from "./AddFriendModal"
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class FriendsList extends Component {
    render() {
        return (

            <section class="commonContainer center-background">
                <h1>Friends</h1>
                <AddFriendModal
                    {...this.props} addFriend={this.props.addFriend}
                />
                <div className="flex-wrap-stretch ">
                    {this.props.friends.map(friend =>
                        <>
                            <div className="flex-wrap-child-50  center">
                                <div key={`friend--${friend.id}`} class="friend smallCard ">
                                    <div className="flex-row-space-between">

                                        User Name: {friend.user.username}
                                        <IconButton aria-label="Delete" onClick={() => this.props.deleteFriend(friend.id)
                                        }
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                    </div>
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </section>
        )
    }
}

export default FriendsList