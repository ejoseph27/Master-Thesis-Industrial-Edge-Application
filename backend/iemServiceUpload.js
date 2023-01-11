const { execFile, exec } = require("child_process");

const { multipartPost } = require("./http");

isRequired = (payload, field) => {
    if (!payload[field]) { throw new Error(`${field} is required`); }
}

module.exports.uploadApplicationIemCatlog = (url, token, appFilePath) => {
    return new Promise((resolve, reject) =>

        multipartPost(url, token, appFilePath)
            .then(json => resolve(json))
            .catch(err => reject(err)));
}

module.exports.generateAppfile = (payload) => {
    const promise = new Promise((resolve, reject) => {
        ['appName', 'composePath', 'appId'].forEach(field => isRequired(payload, field));
        let { appName, appDescription, appVersion, appRepoTitle, appIconUrl, composePath, appId } = payload;
        appVersion = appVersion ? appVersion : '0.0.1';
        appRepoTitle = appRepoTitle ? appRepoTitle : appId;
        appIconUrl = appIconUrl ? appIconUrl : `${__dirname}/appicon/icon.png`;
        appDescription = appDescription ? appDescription : 'DeployFlowApp'
        const redirectType = 'FromBoxSpecificPort';
        const redirectUrl = '1880';
        const redirectSection = 'nodered';
        const changeLog = 'change logs'
        const restRedirectUrl = '';
        const appSourcePath = `${__dirname}/containerWorkspace/containerCollection/${appId}`;
        //execFile('./script.sh', [`-u ${appName} `, `-n ${appId}`, `-p ${appId}`, `-a ${appId}`, `-c ${appId}`, `-f ${appId}`]

        execFile('./v2script.sh', [`-a ${appName} `, `-n ${appId}`, `-w ${appVersion}`, `-e ${appSourcePath}`, `-p ${appDescription}`, `-y ${composePath}`, `-r ${appRepoTitle}`, `-i ${appIconUrl}`, `-t ${redirectType}`, `-u ${redirectUrl}`, `-s ${redirectSection}`, `-c ${changeLog}`, `-z '${restRedirectUrl}'`], (error, stdout, stderr, exitCode) => {

            if (error) {
                console.log(`error: ${error.message}`);
                reject(error);
                //return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                //reject(stderr);
                //return
            }
            console.log(`stdout: ${stdout}`);
            console.log(`Exit Code: ${exitCode}`);
            resolve(`${appSourcePath}/${appId}_${appVersion}.app`);
        })

        //exec(`iectl publisher sa cae -a '${appName}' -n '${appId}' -w '${appVersion}' -e '${appSourcePath}' -p '${appDescription}' -r '${appRepoTitle}' -i '${appIconUrl}' -y '${composePath}' -t '${redirectType}' -u '${redirectUrl}' -s '${redirectSection} -c '${changeLog}' -z'${restRedirectUrl}'`)
    });
    return promise
}






module.exports.uploadApplicationIem = (userData) => {

    const promise = new Promise((resolve, reject) => {
        let { url, username, password, appId, flowPath } = userData;
        if (flowPath === '') {
            flowPath = './nodeRedSource/nodered_flowdata/defaultFlow/flow.json';
        }
        const composePath = `${__dirname}/docker-compose.prod.yml`;
        execFile('./script.sh', [`-u ${url} `, `-n ${username}`, `-p ${password}`, `-a ${appId}`, `-c ${composePath}`, `-f ${flowPath}`], (error, stdout, stderr, exitCode) => {

            if (error) {
                console.log(`error: ${error.message}`);
                reject(error);
                //return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(stderr);
                //return
            }
            console.log(`stdout: ${stdout}`);
            console.log(`Exit Code: ${exitCode}`);
            resolve({ stdout, exitCode });
        })

    });
    return promise;
}





