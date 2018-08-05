import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomePage extends Component {
  render() {
    return (
      <div className="HomePage">
        <h1>RECORD YOUR DISCARDED RELICS ON BLOCKCHAIN</h1>
        You can record information of the relics you discarded as ERC-721 token on Ethereum blockchain.
        <p />
        <Link to="/add">Add New Relic</Link>
      </div>
    );
  }
}

export default HomePage;
