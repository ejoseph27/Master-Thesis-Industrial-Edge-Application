
const fs = require('fs');
module.exports.fileUploads = (file) => {
    if (!file) {
        throw new Error('Require file to upload');
    }
    const folder = new Date().toISOString();
    var dir = `./file-upload/${folder}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = `./file-upload/${folder}/${file.name}`;
    file.mv(filePath);
    return (filePath)
}
