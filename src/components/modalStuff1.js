import React, { Component } from 'react'
import AddFriendModal from './AddFriend';
// import { Link } from "react-router-dom";
// import "./Task.css"


class FriendsList extends Component {







        return (
            <React.Fragment>
                <section className="friends container" >
                    <h1>Your Friends List</h1>





                    <AddFriendModal
                    {...this.props}
                    />





                    {friends.map(friend =>

                        <div key={friend.id} className="friend container">
                            {friend.username} <br />
                            <a href="#"
                                onClick={() => {
                                    let id = friendShips.find(ship => ship.friend === friend.id && ship.userId === Number(sessionStorage.getItem("credentials")) )
                                    console.log( id.id)
                                    this.props.deleteFriendship(id.id)
                                }
                                }
                                className="card-link">Delete</a>
                        </div>

                    )
                    }
                </section>
            </React.Fragment>
        )
    }
}



export default FriendsList