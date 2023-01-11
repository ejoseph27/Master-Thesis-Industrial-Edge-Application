const fs = require('fs')
const YAML = require('json-to-pretty-yaml');

const pick = (obj, arr) => {
    let deviceDetails = arr.reduce((acc, record) => (record in obj && (acc[record] = obj[record]), acc), {});
    //newArr.push(deviceDetails)
    return deviceDetails;
}
module.exports.pick = pick;

module.exports.extractDataFromFile = (filePath) => {
    if (!filePath) {
        throw new Error('Require file path');
    }
    let rawdata = fs.readFileSync(__dirname + filePath.slice(1));
    return rawdata;

}
module.exports.generatePortNumber = () => {
    const metadata = readMetadata();
    const port = metadata.deployment.portNumber + 1;
    writeMetadata({ ...metadata, deployment: { ...metadata.deployment, portNumber: port } })
    return port;
};

module.exports.generateComposeFile = (containerName, port, appId) => {
    const json = this.getDockerComposeTemplate(containerName, port,appId)
    const path = `${__dirname}/containerWorkspace/containerCollection/${appId}`;
    const fileName = 'docker-compose';
    return generateYamlFile(json, path, fileName);

}
module.exports.generateProdComposeFile = (containerName, port, appId) => {
    const json = this.getDockerProdComposeTemplate(containerName,port, appId)
    const path = `${__dirname}/containerWorkspace/containerCollection/${appId}`;
    const fileName = 'docker-compose.prod';
    return generateYamlFile(json, path, fileName);

}
function generateYamlFile(json, path, fileName) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        //const composePath = `./file-upload/${folder}/${file.name}`;
        const composeJsondata = YAML.stringify(json);
        fs.writeFile(`${path}/${fileName}.yml`, composeJsondata, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(`${path}/${fileName}.yml`);
            }
        });

    });
}



module.exports.getDockerProdComposeTemplate = (containerName, port, appId) => {
    return (
        {
            "version": "2.2",
            "services": {
                "nodered": {
                    "image": appId,
                    "container_name": containerName,
                    "mem_limit": "900m",
                    "restart": "unless-stopped",
                    "environment": {
                        "http_proxy": "",
                        "https_proxy": "",
                        "FLOWS": "flow.json"
                    },
                    "volumes": [
                        "./volumeFolder:/data"
                    ],
                    "logging": {
                        "options": {
                            "max-size": "10m",
                            "max-file": "2"
                        }
                    },
                    "ports": [
                        `${port}:1880`
                    ],
                    "networks": {
                        "proxy-redirect": null
                    }
                }
            },
            "networks": {
                "proxy-redirect": {
                    "external": {
                        "name": "proxy-redirect"
                    },
                    "driver": "bridge"
                }
            }
        }
    )
}

module.exports.getDockerComposeTemplate = (containerName, port, appId) => {

    return ({
        "version": "2.2",
        "services": {
            "nodered": {
                "build": {
                    "context": "../../../",
                    "args": {
                        "https_proxy": null
                    }
                },
                "image": appId,
                "container_name": containerName,
                "mem_limit": "600m",
                "restart": "unless-stopped",
                "environment": {
                    "http_proxy": "",
                    "https_proxy": "",
                    "FLOWS": "flow.json"
                },
                "volumes": [
                    "../../../volumeFolder:/data"
                ],
                "logging": {
                    "options": {
                        "max-size": "10m",
                        "max-file": "2"
                    }
                },
                "ports": [
                    `${port}:1880`
                ],
                "networks": {
                    "proxy-redirect": null
                }
            }
        },
        "networks": {
            "proxy-redirect": {
                "external": {
                    "name": "proxy-redirect"
                },
                "driver": "bridge"
            }
        }
    })

}


function getDefaultMetadata() {
    return ({ deployment: { portNumber: 33089 } })
}

function readMetadata() {
    const path = './containerWorkspace/metadata.json';
    if (!fs.existsSync(path)) {
        return getDefaultMetadata();
    }
    const rawData = fs.readFileSync(path);
    return JSON.parse(rawData);
}

function writeMetadata(metadata) {
    const path = './containerWorkspace';
    const fileName = '/metadata.json';
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    fs.writeFileSync(path + fileName, JSON.stringify(metadata));
}































module.exports.writeDataToFile = (fileData) => {

    const folder = new Date().toISOString();
    var dir = `./file-upload/${folder}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    var writeStream = fs.createWriteStream(`${dir}/flow.json`)
    writeStream.write(`${fileData}`);
    const filePath = `./file-upload/${folder}/flow.json`;
    return filePath;
    //file.mv(filePath);

}


module.exports.extractIpAddressfromIedStatistics = (statistics) => {
    const deviceinfo = JSON.parse(Object.values(statistics))['interface'];

    const deviceIp = [];
    deviceinfo.forEach(record => {
        deviceIp.push(pick(record, ['iPAddress']));
    });
    return deviceIp
}