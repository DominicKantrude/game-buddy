import React, { Component } from 'react'







class FriendsList extends Component {
    render() {
        return (
            <section class="commonContainer">
                <h1>Friends</h1>
                <button
                    className="friendAddButton btn btn-primary"
                    onClick={() => {
                        this.props.history.push("/friends/new")
                    }
                    }>Add Friend</button>
                {this.props.friends.map(friend =>
                    <>
                        <div key={`friend--${friend.id}`} class="friend card">
                            User Name: {friend.user.username}
                            <button className="friendButton myButton btn btn-primary" onClick={() => this.props.deleteFriend(friend.id)}>Delete</button>
                        </div>

                    </>
                )}

            </section>
        )
    }
}

export default FriendsList