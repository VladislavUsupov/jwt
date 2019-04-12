import React from 'react';
import userAvatar from './../images/user.png';
import './../css/user.css';
import AuthService from "./AuthService";
import {Button} from 'react-bootstrap';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        this.Auth.logout();
        this.props.history.push("/");
    }

    render() {
        let isAdmin = this.Auth.getProfile().admin;
        return (
            <div className="User-Info">
                <h1>Hello, {this.props.location.state.username}</h1>
                <img src={userAvatar} alt="userAvatar" width="100px" height="100px"/>
                <p>Your password: {this.props.location.state.password}</p>
                <p>Your token: {this.Auth.getToken()}</p>
                <h2>You {isAdmin ? "have " : "haven't "} admin privileges</h2>
                <Button onClick={this.onLogout} variant="outline-dark">Log out</Button>
            </div>
        );
    }
}

export default UserInfo;
