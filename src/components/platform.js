import React, { Component } from 'react';

import NumberFormat from 'react-number-format';
import * as moment from 'moment';

import Table from 'react-bootstrap/Table';

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

export const platform_icons = {
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

export const platform_types_to_icon = platform_types => {
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

export class PlatformInfo extends Component {
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

export class PlatformList extends Component {
  render() {
    return this.props.platform.map(platform => {
        return <PlatformInfo key={platform.id} {...platform}/>;
    });
  }
}

export class PlatformTable extends Component {
  render() {
    return (
        <Table responsive hover>
            <thead>
                <tr>
                    <th></th>
                    <th>platform_id</th>
                    <th>planet_id</th>
                    <th>long_name</th>
                    <th>lat</th>
                    <th>lon</th>
                    <th>last heared</th>
                    <th>misc</th>
                </tr>
            </thead>
            <tbody>
            {
                [...this.props.platform]
                    .sort((p1, p2) => p1.id.toLowerCase().localeCompare(p2.id.toLowerCase()))
                    .map(platform =>
                    <tr>
                        <td><FontAwesomeIcon icon={ platform_types_to_icon(platform.meta.platform_types) } /></td>
                        <td>{
                            (() => {
                          if (platform.meta.url) {
                            return <a href={ platform.meta.url } target="_blank" rel="noopener noreferrer">{ platform.id }</a>
                          } else {
                            return platform.id
                          }})()
                        }</td>
                        <td>{ platform.meta.planet_id || "-" }</td>
                        <td>{ platform.meta.long_name || "-" }</td>
                        <td><NumberFormat value={ platform.location.lat } suffix="°" displayType="text" decimalScale="7" /></td>
                        <td><NumberFormat value={ platform.location.lon } suffix="°" displayType="text" decimalScale="7" /></td>
                        <td><TimeDiff time={ platform.location.time } /></td>
                        <td>{ platform.meta.misc || "" }</td>
                    </tr>
                )
            }
            </tbody>
        </Table>
        )
  }
}
