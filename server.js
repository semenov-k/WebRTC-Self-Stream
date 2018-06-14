const events = {
    offer: 1,
    answer: 2,
    sender_ice: 3,
    receiver_ice: 4
};


function _server(){
    this.event_subscribers = {};
    const self = this;

    this.subscribe = function (event, callback){
        if (self.event_subscribers[event] === undefined){
            self.event_subscribers[event] = [callback]
        } else {
            self.event_subscribers[event].push(callback)
        }
    };

    this.publish = function (event, data) {
        if (self.event_subscribers[event] !== undefined){
            self.event_subscribers[event].forEach(function (callback) {
                callback(data);
            })
        }
    }

}

const Server = new _server();