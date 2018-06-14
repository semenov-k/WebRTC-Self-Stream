(function () {
    const answerOptions = {
        offerToReceiveVideo: true
    };

    const videoElement = document.querySelector('video#receiver');

    const peerConnection = new RTCPeerConnection();

    const stream = new MediaStream();

    peerConnection.ontrack = function (event) {
        stream.addTrack(event.track);
    };

    videoElement.srcObject = stream;

    Server.subscribe(events.sender_ice, function (iceCadidate) {
        peerConnection.addIceCandidate(iceCadidate);
    });

    peerConnection.onicecandidate = function (iceCandidate) {
        Server.publish(events.receiver_ice, iceCandidate.candidate);
    };

    Server.subscribe(events.offer, function (offer) {
        peerConnection.setRemoteDescription(offer);
        peerConnection.createAnswer(answerOptions)
            .then(function (answer) {
                peerConnection.setLocalDescription(answer);
                Server.publish(events.answer, answer);
            })
            .catch(function (err){
                console.error(err);
            })
    });

})();