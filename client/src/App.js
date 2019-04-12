import React, {Component} from 'react';
import logo from './images/jwt.png';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import Login from './components/Login'

class App extends Component {
    render() {
        return (
            <div className="App">
                <img src={logo} className="App-logo" alt="logo"/>
                <Login/>
            </div>
        );
    }
}

export default App;
