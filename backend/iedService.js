const { getDevices, getDeviceFlow, postDeviceFlow, getDeviceStatistics} = require("./http");
const apiPath = `/portal/api/v1`;

module.exports.getDeviceList = (url, token) => {
    return new Promise((resolve, reject) =>
        getDevices(`${url}/${apiPath}/devices`, token)
            .then(async (resp) => {
                if (resp.status === 200) {
                    //console.log("sucess");

                    return resp.json();                                                 // convert the response to a json
                } else {
                    // console.log("fail");
                    throw await resp.json()
                }
            })
            .then(json => resolve(json.data))
            .catch(err => reject(err.errors)));
}


//Function to get current flow data running on an edge device

module.exports.obtainFlow = (iedUrl) => {
    return new Promise((resolve, reject) =>
        getDeviceFlow(`http://${iedUrl}:33080/flows`)
            .then(async (resp) => {
                if (resp.status === 200) {
                    console.log('sucess');
                    return resp.text();                                                 // the response is fetched as text hence resp.text()
                } else {
                    console.log('fail');
                    throw await resp.text()
                }
            })
            .then(json => resolve(json))
            .catch(err => reject(err.errors)));
}

//Function to update new flow data on an edge device

module.exports.uploadFlowIed =(url,flowData) => {
    console.log('ied URl',url);

    return new Promise((resolve, reject) =>
        postDeviceFlow(`http://${url}:33080/flows`, flowData)
            .then (async (resp) => { if (resp.status === 200 || resp.status === 204) {
                console.log("sucess");
                return resp;                                                 // convert the response to a json
                } else {
                    console.log("fail");
                reject( await resp);
                }    
            })
            .then(json => resolve(json))
            .catch(err => reject(err)));
}


//Device Statistics for a specified device

module.exports.obtainStatistics = (url,deviceId,authorization) => {
    return new Promise((resolve, reject) =>
        getDeviceStatistics(`${url}${apiPath}/devices/${deviceId}/statistics`,authorization)
            .then(async (resp) => {
                if (resp.status === 200) {
                    console.log("sucess");
                    //console.log("STAT",resp);
                    return resp.json();                                                 // the response is fetched as text hence resp.text()
                } else {
                    console.log("fail");

                    reject (await resp.text())
                }
            })
            .then(json => resolve(json.data))
            .catch(err => reject(err)));
}

