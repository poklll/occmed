const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__basedir, '/token.json');
const CREDENTIALS_PATH = path.join(__basedir, '/credentials.json');

const push = (file) => {
    return new Promise(resolve => {
        fs.readFile(CREDENTIALS_PATH, async (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            var id = await authorize(JSON.parse(content), uploadFile, file);
            resolve(id);
        });
    });  
}

const del = (id) => {
    return new Promise(resolve => {
        fs.readFile(CREDENTIALS_PATH, async (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            authorize(JSON.parse(content), deleteFile, id).then(()=>{
                resolve();
            }
            );
        });
    });  
}



function authorize(credentials, callback, file) {
    return new Promise(resolve => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        fs.readFile(TOKEN_PATH, async (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            var id = await callback(oAuth2Client, file);
            resolve(id);
        });
    })
}


function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
        });
    });
}


function uploadFile(auth, uploadedFile) {
    return new Promise(resolve => {
        const drive = google.drive({ version: 'v3', auth });
        const { filename,mimetype } = uploadedFile;
        const filepath = __basedir + `/uploads/${filename}`;
        var fileMetadata = {
            'name': filename,
            'parents': ["1toAFLcOml13h1pznkDlWwdQWvaykb6ay"],
        };
        var media = {
            mimeType: mimetype,
            body: fs.createReadStream(filepath)
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink'
        }, function (err, file) {
            if (err) {
                console.error(err);
            } else {
                fs.unlinkSync(filepath);
                shareFile(drive, file.data.id)
                resolve(file.data.id);
            }
        });
    });
}


function shareFile(drive, id) {
    drive.permissions.create({
        resource: {
            'type': 'anyone',
            'role': 'reader',
        },
        fileId: id,
        fields: 'id',
    }, function (err, res) {
        if (err) {
            console.error(err);
        } else {
            console.log('share file success');
        }
    });
}

function deleteFile(auth, id) {
    return new Promise(resolve => {
        const drive = google.drive({ version: 'v3', auth });
        drive.files.delete(
           { 
             fileId : id
           }, 
           function (err, res) {
            if (err) {
                console.error(err);
            } else {
               resolve();
            }
        });
    });
}

module.exports = {
    push: push,
    del: del
};