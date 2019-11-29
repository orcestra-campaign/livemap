import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import { renderToStaticMarkup } from "react-dom/server";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link,
  NavLink
} from "react-router-dom";
//import { withRouter } from "react-router";

import { connect } from 'react-redux';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { PlatformInfo, PlatformTable, platform_types_to_icon } from './components/platform';
import { About } from './components/about';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
//import Button from 'react-bootstrap/Button';

const mapStateToProps = state => {
    return {
        platform: Object.keys(state.platform).map((id, index) => {
            return {meta: {},
                    location: {},
                    ...state.platform[id],
                    id: id};
        })
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

//const LivePlatformList = connect(
//    mapStateToProps,
//    mapDispatchToProps
//)(PlatformList)

class AssetMarkers extends Component {
  render() {
    return this.props.platform.filter(platform => platform.location.lat !== undefined  && platform.location.lon !== undefined)
                              .map(platform => {
        const icon = <FontAwesomeIcon className="icon"
                                      icon={platform_types_to_icon(platform.meta.platform_types)}
                                      size="2x" />;
        const customMarkerIcon = L.divIcon({
          html: renderToStaticMarkup(icon),
          className: "icon"
        });
        return (
            <Marker key={platform.id}
                    position={[platform.location.lat, platform.location.lon]}
                    icon={customMarkerIcon} >
                <Popup>
                    <PlatformInfo {...platform}/>
                </Popup>
            </Marker>
        );
    });
  }
}

class App_ extends Component {
  render() {
    return (
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Navbar bg="light">
            <Navbar.Brand as={NavLink} to="/">
              <img
                src={ logo }
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="EUREC4A logo"
              />{' '}
              EUREC<sup>4</sup>A MQTT Dashboard
            </Navbar.Brand>
            <Nav className="mr-auto" as="ul">
              <Nav.Link as={NavLink} exact to="/">Map</Nav.Link>
              <Nav.Link as={NavLink} exact to="/table">Table</Nav.Link>
              <Nav.Link as={NavLink} exact to="/about">About</Nav.Link>
            </Nav>
          </Navbar>
          <Switch>
            <Route exact path="/">
              <Map className="Map" center={[0, 0]} zoom={2}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                <AssetMarkers {...this.props} />
              </Map>
            </Route>
            <Route exact path="/table">
              <PlatformTable {...this.props} />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App_)


export default App;
