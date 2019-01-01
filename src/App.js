import React, { Component } from 'react';
import './App.css';
import StreetView from './components/StreetView'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <StreetView />
      </div>
    );
  }
}
