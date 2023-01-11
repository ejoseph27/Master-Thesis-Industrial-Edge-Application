const fs = require('fs');
const FormData = require('form-data');

function post(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)                                  // body data type must match "Content-Type" header

  })

}
module.exports.post = post;



function multipartPost(url, token, appFile) {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(appFile);
    const formData = new FormData();
    formData.append('file to import', readStream)
    formData.submit({ protocol: 'https:', host: url, port: '9443', path: '/portal/api/v1/application-import-jobs', headers: { Authorization: token } }, async (err, res) => {
      //console.log('Err', err);
      //console.log('Res', res);
      //console.log('DATA', data);
      if (err) {
        reject(err);
        return
      }
      let response = '';
      for await (const chunk of res) {
        response = chunk.toString();
      }
      if (res.statusCode == 200 || res.statusCode == 202) {
        resolve(response)
      }
      else {
        reject(response)
      }
    })
  })

  // return fetch(url,{

  //   method : "POST",
  //   headers:{
  //     'Content-Type':'multipart/form-data',
  //     'Authorization': token
  //   },
  //   body: formData
  // })

}
module.exports.multipartPost = multipartPost;







































function get(url, acc_token) {

  // write a method to send access token to the url.
  return fetch(url, {

    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': acc_token
    }

  })

}
module.exports.get = get;

function getDevices(url, acc_token) {

  return fetch(url, {

    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': acc_token
    }

  })

}
module.exports.getDevices = getDevices;

//GET request to retreive the flow from IED 
function getDeviceFlow(url) {
  // console.log('GET func', url);
  return fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }

  })

}
module.exports.getDeviceFlow = getDeviceFlow;


// POST request to update a flow to the IED

function postDeviceFlow(url, flowData) {
  //console.log('POST Device',url);
  return fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: flowData                                  // body data type must match "Content-Type" header

  })

}
module.exports.postDeviceFlow = postDeviceFlow;

//GET request to fetch IED statistics

function getDeviceStatistics(url, token) {
  // console.log('GET func', url);

  // console.log('Token',token)
  return fetch(url, {

    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }

  })

}
module.exports.getDeviceStatistics = getDeviceStatistics;
