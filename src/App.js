import React, { Component } from 'react';
import './App.css';
import { renderToStaticMarkup } from "react-dom/server";


import { connect } from 'react-redux';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { PlatformInfo, platform_types_to_icon } from './components/platform';


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
