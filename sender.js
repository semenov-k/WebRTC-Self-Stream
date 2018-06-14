(function (){
    const mediaConstraints = {
        video: true
    };

    const peerConnection = new RTCPeerConnection();

    Server.subscribe(events.answer, function (answer) {
        peerConnection.setRemoteDescription(answer);
    });

    Server.subscribe(events.receiver_ice, function (iceCandidate) {
        peerConnection.addIceCandidate(iceCandidate);
    });

    const videoElement = document.querySelector('video#sender');

    peerConnection.onicecandidate = function (iceCandidate){
        Server.publish(events.sender_ice, iceCandidate.candidate);
    };
    window.navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(function (stream) {
            videoElement.srcObject = stream;
            stream.getTracks().forEach(function (mediaTrack) {
                peerConnection.addTrack(mediaTrack, stream);
            });
            peerConnection.createOffer()
                .then(function (offer) {
                    Server.publish(events.offer, offer);
                    peerConnection.setLocalDescription(offer);
                })
                .catch(function (err) {
                    console.error(err)
                })
        })
        .catch(function (err) {
            console.error(err);
        });
})();