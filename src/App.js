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

import { PlatformInfo, PlatformTable, PlatformDetails, platform_types_to_icon } from './components/platform';
import { About } from './components/about';

import { AssetIcon } from './lib/asset_icons';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
//import Button from 'react-bootstrap/Button';

const normalize_platform = (id, data) => {
    return {meta: {},
            location: {},
            ...data,
            id: id};
};

const platforms_to_list = platforms => {
    return Object.keys(platforms).map((id, index) => normalize_platform(id, platforms[id]))
};

const mapStateToProps = state => {
    return state;
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
          html: renderToStaticMarkup(<AssetIcon asset_types={ platform.meta.platform_types } />),
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
          <Navbar bg="light" expand="sm">
            <Navbar.Brand as={NavLink} to="/">
              <img
                src={ logo }
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="EUREC4A logo"
              />{' '}
              EUREC<sup>4</sup>A
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar.Brand>MQTT Dashboard</Navbar.Brand>
              <Nav className="mr-auto" as="ul">
                <Nav.Link as={NavLink} exact to="/">Map</Nav.Link>
                <Nav.Link as={NavLink} exact to="/table">Table</Nav.Link>
                <Nav.Link as={NavLink} exact to="/about">About</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route exact path="/">
              <Map className="Map" center={[0, 0]} zoom={2}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                <AssetMarkers platform={platforms_to_list(this.props.platform)} />
              </Map>
            </Route>
            <Route exact path="/table">
              <PlatformTable platform={platforms_to_list(this.props.platform)} />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            <Route path="/platform/:id/details" render={(r) =>
                <PlatformDetails platform={
                    {id: r.match.params.id, ...this.props.platform[r.match.params.id]}
                } />
            } />
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
