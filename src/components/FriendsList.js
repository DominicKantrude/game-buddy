import React, { Component } from 'react'







class FriendsList extends Component {
    render() {
        return (
            <section >
                <h1>Friends</h1>
                <button
                    className="friendAddButton btn btn-primary"
                    onClick={() => {
                        this.props.history.push("/friends/new")
                    }
                    }>Add Friend</button>
                {this.props.friends.map(friend =>
                    <>
                        <div key={friend.id} class="friend">
                            User Name: {friend.user.username}
                        </div>
                        <button className="friendButton btn btn-primary" onClick={() => this.props.deleteFriend(friend.id)}>Delete</button>
                    </>
                )}

            </section>
        )
    }
}

export default FriendsList