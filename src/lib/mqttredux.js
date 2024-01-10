import mqtt from 'mqtt';

function topicToMatcher(topic) {
    return new RegExp(topic.replace(/\//g, "\\/").replace(/\+/g, '[^/]+').replace(/#/, '.+'));
}

function makeTopicMatchers(obj) {
    return obj.map(e => {
        return {
            type: e.action,
            topic: e.topic,
            matcher: topicToMatcher(e.topic),
            decoder: e.decoder ? e.decoder : x => x
        }
    })
}

class MQTTRedux {
    constructor(config) {
        this.config = config;
        this.mqtt = mqtt.connect(config.url, config.opt);
        this.topicActions = [];
    }

    connect(actions, store) {
        let topics = actions.map(e => e.topic);
        this.topicActions = makeTopicMatchers(actions);
        this.mqtt.on('connect', () => {
            store.dispatch({
                type: 'MQTT_CONNECT',
                message: 'Connected to MQTT broker',
            });

            topics.forEach(topic => {
                this.mqtt.subscribe(topic, { qos: 0 });
            });
        });

        this.mqtt.on('disconnect', () => {
            store.dispatch({
                type: 'MQTT_DISCONNECT',
                message: 'Disconnected from MQTT broker',
            });
        });

        this.mqtt.on('message', (topic, payload) => {
            this.topicActions.forEach(action => {
                if(topic.match(action.matcher)) {
                    store.dispatch({
                        type: action.type,
                        payload: action.decoder(payload.toString()),
                        topic: topic,
                    });
                }
            });
        });

        this.mqtt.on('error', err => {
            store.dispatch({
                type: 'MQTT_ERROR',
                error: err,
            });
        });
    }

    subscribe(actionMap) {
        const actionNames = Object.keys(actionMap);
        actionNames.forEach(action => {
            this.mqtt.subscribe(actionMap[action], { qos: 0});
            this.topicActionMap[actionMap[action]] = action;
        });
    }

    unsubscribe(action) {
        if (Array.isArray(action)) {
            action.forEach(this.unsubscribe);
        } else {
            this.topicActions.forEach( ta => {
                if(ta.type === action) {
                    this.mqtt.unsubscribe(ta.topic);
                }
            });
            this.topicActions = this.topicActions.filter( ta => ta.type !== action );
        }
    }

    createMiddleware() {
         const mqttClient = this.mqtt;

        return store => next => action => {
            if (action.mqtt) {
                const mqtt = action.mqtt;
                let payload;

                if (mqtt.topic && typeof mqtt.payload !== 'function') {
                    payload = typeof mqtt.payload === 'string'
                        ? mqtt.payload
                        : JSON.stringify(mqtt.payload);


                } else if (mqtt.topic && typeof mqtt.payload === 'function') {
                    payload = mqtt.payload.call(null, store.getState());
                }

                mqttClient.publish(mqtt.topic, payload, { qos: 0 });

                const modifiedAction = {
                    ...action,
                    mqtt: {
                        payload,
                        topic: mqtt.topic,
                    },
                };

                return next(modifiedAction);
            }

            return next(action);
        };
    }
}

export function createClient(config) {
    return new MQTTRedux(config);
}
