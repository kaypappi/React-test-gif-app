import React from "react";
import logo from "./logo.svg";
import Home from "./components/Home";
import Info from './components/Info'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/info' component={Info}/>
          
        </Switch>
        
      </div>
    </Router>
  );
}

export default App;
