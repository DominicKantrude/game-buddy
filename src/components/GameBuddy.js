import React, { Component } from 'react';
import IsAuth from "./Auth/IsAuth"

class GameBuddy extends Component {

     // a function that return true if the session Storage object contains the key credentials and false if it does not.
  isAuthenticated = () => sessionStorage.getItem("credentials") !== null

  setAuth = () => {
    this.setState({ authTrigger: this.isAuthenticated() })
  }

  state = {
    authTrigger: this.isAuthenticated()
  }

        render() {
            return (
                <React.Fragment>
                    <IsAuth isAuthenticated={this.isAuthenticated} setAuth={this.setAuth} />

                </React.Fragment>
            )
        }
}
export default GameBuddy