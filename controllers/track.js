const Track = require('../models/track');
const current_path = require('../utils/path');

const image_upload = require('../utils/image_download');
const path = require('path');

exports.getPlayTrack = async (req, res, next) => {
    const id = req.query.track_id;
    let responseJson = {
        status: 0,
        result: {}
    };
    if(id){
        await Track.findById(id)
                .then(track => {
                    responseJson.status = 1;
                    responseJson.result['track_id'] = track['_id'];
                    responseJson.result['track_name'] = track['track_name'];
                    responseJson.result['track_location'] = track['track_location'];
                })
                .catch(err => {
                    responseJson.result = 'Error while fetching track details';
                    console.log(err);
                });
    } else {
        responseJson.result = 'Id is missing from query params';
    }
    res.json(responseJson);
}

exports.getTrackDetails = async (req, res, next) => {
    const id = req.query.track_id;
    let responseJson = {
        status: 0,
        result: {}
    };
    if(id){
        await Track.findById(id)
                .then(track => {
                    responseJson.status = 1;
                    responseJson.result['track_id'] = track['_id'];
                    responseJson.result['track_name'] = track['track_name'];
                    responseJson.result['track_image'] = track['track_image'];
                    responseJson.result['track_location'] = track['track_location'];
                    responseJson.result['track_description'] = track['track_description'];
                    responseJson.result['track_tags'] = track['track_tags'];
                    responseJson.result['created_at'] = track['created_at'];
                })
                .catch(err => {
                    responseJson.result = 'Error while fetching track details';
                    console.log(err);
                });
    } else {
        responseJson.result = 'Id is missing from query params';
    }
    res.json(responseJson);
}

exports.getTracks = async (req, res, next) => {
    const tag = req.query.tag;
    let responseJson = {
        status: 0,
        result: []
    };
    let searchKey = null;
    if(tag){
        searchKey = {track_tags: tag}
    }
    await Track.find(searchKey)
            .then(tracks => {
                responseJson.status = 1;
                tracks.forEach(data => {
                    responseJson.result.push({
                        track_id: data['_id'],
                        track_name: data['track_name'],
                        track_image: data['track_image']
                    });
                });
            })
            .catch(err => {
                responseJson.result = 'Error while fetching track details';
                console.log(err);
            });
    res.json(responseJson);
}

exports.postUploadTrack = async (req, res, next) => {
    let responseJson = {
        status: 0,
        result: []
    };
    let fileName = req.body.track_id + '_' + req.body.track_name;
    let payload = {
        _id: req.body.track_id,
        track_name: req.body.track_name,
        track_image: path.resolve(current_path, fileName + '.jpg'),
        track_location: path.resolve(current_path, fileName + '.mp3'),
        track_description: req.body.track_description,
        track_tags: req.body.track_tags,
    }
    const track = new Track(payload);
    try {
        await track.save()
        image_upload(req.body.track_image, fileName)
        responseJson.status = 1
        responseJson.result = 'New Track Added!';
        res.json(responseJson);
    } catch(err) {
        console.log(err);
        responseJson.result = 'Error while uploading a new Track';
        res.json(responseJson);
    };
}

exports.postEditTrack = async (req, res, next) => {
    let responseJson = {
        status: 0,
        result: []
    };
    // changesArray(0/1) = [track_name, track_image, track_description, track_tags];
    let changesArrayMapping = {
        0: 'track_name',
        1: 'track_image',
        2: 'track_description',
        3: 'track_tags'
    }
    let changesArray = req.body.changes_array.split(',');
    Track.findById(req.body.track_id)
    .then(track => {
        changesArray.forEach((state, index) => {
            if(+state === 1) {
                if(index === 1){
                    image_upload(req.body.track_image,
                        track._id + '_' + track.track_name + '.mp3');
                } else {
                    console.log(changesArrayMapping[index]);
                    track[changesArrayMapping[index]] = req.body[changesArrayMapping[index]]
                }
            }
        });
        return track.save().then(result => {
            responseJson.status = 1;
            responseJson.result = 'Track has been updated!';
            res.json(responseJson);
        });
    })
    .catch(err => {
        console.log(err);
        responseJson.result = 'Error while updating Track';
        res.json(responseJson);
    })

}