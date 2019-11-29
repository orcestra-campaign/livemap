import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'

export class About extends Component {
  render() {
    return (
        <Container>
			<h2>General</h2>
            <p>
				The EUREC<sup>4</sup>A MQTT Dashboard shows information currently transferred via the <a href="https://eurec4a.eu/">EUREC<sup>4</sup>A</a> field campaigns <a href="https://en.wikipedia.org/wiki/MQTT">MQTT</a> broker.
			</p>
			<h2>Data</h2>
				Data presented here is produced by various campaign participants.
                If you want to use the data from the system or provide more data into the system, please send an e-mail to <a href="mailto:tobias.koelling@physik.uni-muenchen.de">tobias.koelling@physik.uni-muenchen.de</a> and ask for details.
			<h2>Code</h2>
				The <a href="https://github.com/eurec4a/mqtt_dashboard">code for the dashboard</a> and the <a href="https://github.com/eurec4a/mqtt_spec/blob/master/mqtt_spec.md">specification for the MQTT messages</a> exchanged over the broker can be found on github.
				Pull requests welcome!
                If you find a problem or have a feature request, please open an issue in the respective repository.
        </Container>
    )
  }
}
