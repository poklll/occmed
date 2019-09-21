const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__basedir, '/token.json');
const CREDENTIALS_PATH = path.join(__basedir, '/credentials.json');
const push = (file) => {
    return new Promise(resolve => {
        fs.readFile(CREDENTIALS_PATH, async (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            var id = await authorize(JSON.parse(content), upload, file);
            resolve(id);
        });
    });  // Load client secrets from a local file.
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, file) {
    return new Promise(resolve => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, async (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            var id = await callback(oAuth2Client, file);
            resolve(id);
        });
    })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
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
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            //callback(oAuth2Client);
        });
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function upload(auth, uploadedFile) {
    return new Promise(resolve => {
        const drive = google.drive({ version: 'v3', auth });
        const { filename, mimetype } = uploadedFile;
        var fileMetadata = {
            'name': filename,
            'parents': ["1BE6w71IfjGGNl04Q1kRtb1EjoyrAT_jm"],
        };
        var media = {
            mimeType: mimetype,
            body: fs.createReadStream(__basedir + `/uploads/${filename}`)
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id,webViewLink'
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
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
            // Handle error...
            console.error(err);
        } else {
            // console.log(`https://drive.google.com/file/d/${id}/view?usp=sharing`);
        }
    });
}
module.exports = {
    push: push
};