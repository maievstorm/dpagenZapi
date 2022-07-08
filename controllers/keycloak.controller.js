const axios = require('axios').default;

async function getInfo(req,res){
    axios({
        method:'get',
        url:'https://streamdpa.apps.xplat.fis.com.vn/connectors'
    })
    .then(data=>{
        return res.status(200).json({
            data:data.data
        })
    })
}

async function getAllUser(req, res) {
    let server = 'https://sso-fis-mbf-dplat.apps.xplat.fis.com.vn'
    let realm = 'dpa'
    const params = new URLSearchParams({
        grant_type: 'password',

        client_id: 'admin-cli',

        username: 'hung',
        password: '123456a@'

    });
    axios({
        method: 'post',
        url: `${server}/auth/realms/${realm}/protocol/openid-connect/token`,
        // data: {
        //     'client_id': 'admin-cli',
        //     'grant_type': 'password',
        //     'username': 'hung',
        //     'password': '123456a@'
        // },
        data: params.toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }
    })
        .then(data => {
            return res.status(200).json({
                data: data.data
            })
        })
        .catch(error => {
            console.log(error)
            return res.status(200).json({
                message: error
            })
        })
}


module.exports = {
    getAllUser,
    getInfo
}