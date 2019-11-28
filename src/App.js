import React, { Component } from 'react';
import './App.css';
import { renderToStaticMarkup } from "react-dom/server";

import NumberFormat from 'react-number-format';

import { connect } from 'react-redux';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import * as moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faStopwatch,
//    faRuler,
    faPlane,
    faShip,
    faHome,
    faLifeRing,
    faQuestion,
    faSatelliteDish
} from '@fortawesome/free-solid-svg-icons'

const platform_icons = {
    "plane": faPlane,
    "ship": faShip,
    "station": faHome,
    "buoy": faLifeRing,
    "ground radar": faSatelliteDish,
};


export class TimeDiff extends Component {
    constructor(props) {
        super(props);
        this.state = {diff: this.computeDiff()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    computeDiff() {
        if (this.props.time) {
            return moment(this.props.time).fromNow();
        } else {
            return 'never';
        }
    }

    tick() {
        this.setState({diff: this.computeDiff()});
    }

    render() {
        return this.state.diff;
    }
}

const platform_types_to_icon = platform_types => {
    var icon = undefined;
    for ( const platform_type of platform_types || [] ) {
        icon = platform_icons[platform_type];
        if ( icon !== undefined ) {
            break;
        }
    }
    if ( icon === undefined ) {
        icon = faQuestion;
    }
    return icon;
};

class PlatformInfo extends Component {
  render() {
      const name = this.props.meta.long_name || this.props.id;
      const url = this.props.meta.url;
      var title;
      if (url) {
          title = ( <a href={ url } target="_blank" rel="noopener noreferrer">{ name }</a> );
      } else {
          title = name;
      }
      const icon = <FontAwesomeIcon icon={platform_types_to_icon(this.props.meta.platform_types)} />;
      return (
          <div className="platform_info">
            <header className="platform_header">{ icon } { title }</header>
            <div className="platform_description">
                <div> lat: <NumberFormat value={ this.props.location.lat } suffix="°" displayType="text" decimalScale="7" /> </div>
                <div> lon: <NumberFormat value={ this.props.location.lon } suffix="°" displayType="text" decimalScale="7" /> </div>
                <div><FontAwesomeIcon icon={faStopwatch} /> <TimeDiff time={ this.props.location.time } /></div>
                <div>{ this.props.meta.misc || "" }</div>
            </div>
          </div>
      )
  }
}

//class PlatformList extends Component {
//  render() {
//    return this.props.platform.map(platform => {
//        return <PlatformInfo key={platform.id} {...platform}/>;
//    });
//  }
//}

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

const LiveAssetMarkers= connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetMarkers)

function App() {
  return (
    <div className="App">
      <Map className="Map" center={[0, 0]} zoom={2}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <LiveAssetMarkers/>
      </Map>
    </div>
  );
}

export default App;
