const path = require('path');
const fs = require('fs');
const exp = require('express');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');
const { login, getProjectList } = require("./iemService");
const { uploadApplicationIem, uploadApplicationIemCatlog, generateAppfile } = require("./iemServiceUpload");
const { getDeviceList, obtainFlow, uploadFlowIed, obtainStatistics } = require("./iedService")
const { fileUploads } = require("./uploadFiles")
const { extractDataFromFile, extractIpAddressfromIedStatistics, pick, writeDataToFile, generateComposeFile,generateProdComposeFile,generatePortNumber } = require("./utilService")


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


// Creating instance of express
const app = exp();
app.use(exp.json());

var distDir = __dirname + "/angular/dist/iem-ui/";
app.use(exp.static(distDir));

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.get('/', function (req, res) {
  const pathToHtmlFile = path.resolve(distDir, 'index.html');
  const contentFromHtmlFile = fs.readFileSync(pathToHtmlFile, 'utf-8');
  res.send(contentFromHtmlFile);
});

//post login api function
app.post('/api/login', function (req, res) {
  const { url, username, password } = req.body; // keys value pair of req.body is assigned to object {}
  login(url, username, password)
    .then(data => {
      res.send(data)
    })
    .catch(err => { res.status(500).send(err); })
});



app.post('/api/v1/deploy/cloud', async (req, res) => {
  try {
    const { url, authorization } = req.headers;
    //let appfilepath = '/home/elvis/Desktop/iectltest/export_folder/rv323mbiqwklskxpmJ83kJV0usY5PyVE_0.0.7.app'

    
    const appId = (crypto.randomUUID()+'').replaceAll('-','');

    const port = await generatePortNumber();
    const appName = `Nodered_${port}`;
    await generateComposeFile(appName, port, appId)
    const composePath = await generateProdComposeFile(appName, port, appId)
    
    const appFilePath = await generateAppfile({ ...req.body, composePath, appName, appId });
    console.log('APPFILE',appFilePath);
    const data = await uploadApplicationIemCatlog(url, authorization, appFilePath)
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }

})



// Listening to server at port 3000

app.listen(3000, function () {
  console.log("server is running on port 3000");

})

















































// get projectList from IEM 

app.get('/api/projects', function (req, res) {
  const { url, authorization } = req.headers;
  getProjectList(url, authorization).then(data => { res.send(data['developer-applications']); }).catch(err => { //must use res.send or set the header authorization key of the res object to the acc_token

    res.status(500).send(err);                                                                                                      //.then sends response data (token) to the angular app/postman
  });

});

//api call to list edge devices onboarded to IEM

app.get('/api/devices/list', function (req, res) {
  
  const { url, authorization } = req.headers;

  //const url = 'https://192.168.6.177:9443';                               //will have to change it
  getDeviceList(url, authorization).then(data => {
 

    // The response array of Object from the IED is filtered using pick() to get only certain params and send as response to the frontend
    let deviceData = []
    data.forEach(record => {
      deviceData.push(pick(record, ['deviceId', 'deviceName', 'deviceStatus']));
    });

    res.send(deviceData);
  }).catch(err => { //must use res.send or set the header authorization key of the res object to the acc_token
    res.status(500).send(err);                                                                                                      //.then sends response data (token) to the angular app/postman
  });
});





//api request to get flow data from IED
app.post('/api/ied/reterive/flow', async function (req, res) {
  const { url, authorization } = req.headers;
  const { username, password, appId, deviceId } = req.body;
  const statistics = await obtainStatistics(url, deviceId, authorization);
  const ipAddress = extractIpAddressfromIedStatistics(statistics)
  let flowDataIed = '';
  // for (const ip of ipAddress) {
  try {
    flowDataIed = await obtainFlow(ipAddress[0].iPAddress);
    flowFilePath = writeDataToFile(flowDataIed);
    Object.assign(req.body, { flowPath: `${flowFilePath}` });
  }
  catch (err) {
    return
  }
  await uploadApplicationIem(req.body).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send(err);
  })


});

app.post('/api/upload', (req, res) => {

  try {

    const filePath = fileUploads(req.files.files);
    res.send({
      status: true,
      filePath: filePath
    });
  } catch (err) {
    res.send({
      status: false,
      message: 'No file uploaded',
      err: err.message
    })
  }
});

app.post('/api/deploy/cloud', (req, res) => {

  uploadApplicationIem(req.body).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send(err);
  })
})
//api request to post flow to IED
app.post('/api/deploy/device', async function (req, res) {
  try {
    //pass IEM URL
    const { url, assets, flowPath } = req.body;
    const { authorization } = req.headers;
    const rawData = extractDataFromFile(flowPath);
    assets.forEach(async assetId => {
      const statistics = await obtainStatistics(url, assetId, authorization)
      const ipAddress = extractIpAddressfromIedStatistics(statistics);
      for (const ip of ipAddress) {
        try {
          
          await uploadFlowIed(ip.iPAddress, rawData);
          console.log('Sucessfull update to asset', assetId);
          continue
        }
        catch (err) {
        }
      }
    });
    res.send({});
  } catch (err) { //must use res.send or set the header authorization key of the res object to the acc_token
    res.status(500).send(err);
    return                                                                                                  //.then sends response data (token) to the angular app/postman
  }
})

app.get('/node/http/test', function (req, res) {
  data = "Success";

  console.log("Http req hit");
  res.send(data);
});









//TODO: create task to delete file upload every one hour
//console.log(setInterval(() => console.log('Hello'), 2000));
