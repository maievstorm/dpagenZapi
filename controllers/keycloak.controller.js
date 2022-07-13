const axios = require('axios').default;


async function getAdminToken() {
    let response
    try {
        let server = 'https://sso-fis-mbf-dplat.apps.xplat.fis.com.vn'
        let realm = 'dpa'
        const params = new URLSearchParams({
            grant_type: process.env.KEYCLOAK_GRANT_TYPE,

            client_id: process.env.KEYCLOAK_CLIENT_ID,

            username: process.env.KEYCLOAK_USERNAME,
            password: process.env.KEYCLOAK_PASSWORD

        });
        response = await axios({
            method: 'post',
            url: `${server}/auth/realms/${realm}/protocol/openid-connect/token`,
            data: params.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        })

    } catch (error) {
        console.log(error);
    }
    return response
}

async function getInfo(req, res) {
    axios({
        method: 'get',
        url: 'https://streamdpa.apps.xplat.fis.com.vn/connectors'
    })
        .then(data => {
            return res.status(200).json({
                data: data.data
            })
        })
        .catch(err => console.log(err))
}

async function addUser(req, res) {
    let username = req.body.username
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let password = req.body.password
    let policy = req.body.policy


    let request_data = JSON.stringify({
        "createdTimestamp": Date.now(),
        "username": username,
        "enabled": true,
        "totp": false,
        "emailVerified": true,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "disableableCredentialTypes": [],
        "requiredActions": [],
        "notBefore": 0,
        "access": {
            "manageGroupMembership": true,
            "view": true,
            "mapRoles": true,
            "impersonate": true,
            "manage": true
        },
        "credentials": [{
            "type": "password",
            "value": password,
            "temporary": false
        }],
        "attributes":[{
            "policy":policy
        }],
        "realmRoles": ["user"]
    });
    getAdminToken()
        .then(access_token => {
            let admin_token = access_token.data.access_token
            let server = 'https://sso-fis-mbf-dplat.apps.xplat.fis.com.vn'
            let realm = 'dpa'
            let router = `${server}/auth/admin/realms/${realm}/users`
            console.log(router)
            axios({
                method: 'post',
                url: `${server}/auth/admin/realms/${realm}/users`,
                headers: {
                    'Authorization': 'Bearer ' + admin_token,
                    'Content-Type': 'application/json'
                },
                data: request_data
            })
                .then(done => {
                    return res.status(200).json({
                        message: 'add user successfully!'
                    })
                })
                .catch(err => {
                    return res.status(200).json({
                        message: err
                    })
                })

        })
        .catch(error => {
            console.log(error)
            return res.status(200).json({
                message: 'Error get token'
            })
        })
}

async function changePassword(req, res) {

}
module.exports = {
    getInfo,
    addUser,
    changePassword
}