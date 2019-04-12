import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import AuthService from './AuthService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.Auth = new AuthService();
    }

    handleUserChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.Auth.login(this.state.username, this.state.password)
            .then(res => {
                this.Auth.verify().then(res => {
                    this.props.history.push({
                        pathname: "/info",
                        state: {
                            username: this.state.username,
                            password: this.state.password
                        }
                    });
                })
                    .catch(err => {
                        alert(err);
                    })
            })
            .catch(err => {
                alert(err);
            });
    }

    render() {
        return (
            <div className="App-form">
                <Container>
                    <Row>
                        <Col md={{span: 6, offset: 3}}>
                            <Form>
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="username" placeholder="Enter Username"
                                                  value={this.state.username} onChange={this.handleUserChange}/>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={this.state.password}
                                                  onChange={this.handlePasswordChange}/>
                                </Form.Group>
                                <Button variant="primary" onClick={this.handleSubmit}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withRouter(Login);
