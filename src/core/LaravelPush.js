import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '../api'

export const laravelEcho = (namespace) =>
    new Echo({
        broadcaster: 'pusher',
        key: "124277cd340ca9c3a99b",
        namespace: namespace,
        client: new Pusher("124277cd340ca9c3a99b", {
            cluster: "ap1",
            forceTLS: true,
            authorizer: channel => {
                return {
                    authorize: (socketId, callback) => {
                        api.post('/api/broadcasting/auth', {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                            .then(response => {
                                callback(null, response.data)
                            })
                            .catch(error => {
                                callback(error, null)
                            })
                    }
                }
            }
        })
    })
