import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import HomePage from "./HomePage";
import AddNewRelic from "./AddNewRelic";
import MyDiscardedRelics from "./MyDiscardedRelics";

const Header = () => {
  return (
    <div>
      <header>
        <span className="title"><Link to="/">Discarded Relics</Link></span>
        <nav>
          <ul>
            <li><Link to="/add">AddNewRelic</Link></li>
            <li><Link to="/mypage">MyDiscardedRelics</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      {/* BrowserRouter直下に置けるコンポーネントは1つだけ */}
      <div className="App">
        <Header />
        <hr/>
        {/* RouteはBrowserRouter以下ならばどこの階層に置いてもよい */}
        <Route exact path="/" component={HomePage} /> {/*（1）*/}
        <Route path="/add" component={AddNewRelic} />
        <Route path="/mypage" component={MyDiscardedRelics} />
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
