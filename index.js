const axios = require('axios')
require('dotenv').config();
const fs = require('fs');
const { Web3Storage, getFilesFromPath } = require('web3.storage');

const createRequest = (input, callback) => {

    const jobRunID = input['id']
    var tx_hash = ''
    var contract_address = ''

    if ('tx_hash' in input) {
        tx_hash = input['tx_hash']
    }

    if ('contract_address' in input) {
        contract_address = input['contract_address']
    }

    const endpoint = 'statistics'

    const url = `https://shamba-gateway-staging-2ycmet71.ew.gateway.dev/geoapi/v1/${endpoint}`

    const dataset_code = input['data']['dataset_code']
    const selected_band = input['data']['selected_band']
    const geometry = input['data']['geometry']
    const start_date = input['data']['start_date']
    const end_date = input['data']['end_date']
    const image_scale = input['data']['image_scale']
    const agg_x = input['data']['agg_x']

    const data = {
        dataset_code,
        selected_band,
        geometry,
        start_date,
        end_date,
        image_scale,
    }

    axios
        .post(url, data)
        .then(res => {
            if (res.status == 200) {
                var datetime = new Date();

                res.data.jobRunID = jobRunID
                var agg_x_value = res.data['data'][agg_x] * (10 ** 18)
                res.data.result = agg_x_value
                res.data.statusCode = res.status
                res.data.data = {
                    [agg_x]: agg_x_value,
                    "result": agg_x_value
                }

                delete res.data.success
                delete res.data.error
                delete res.data.data_token
                delete res.data.duration


                const web3_json_data = {
                    "request": {
                        "agg_x": agg_x,
                        "dataset_code": dataset_code,
                        "selected_band": selected_band,
                        "geometry": geometry,
                        "start_date": start_date,
                        "end_date": end_date,
                        "image_scale": image_scale
                    },
                    "response": {
                        "datetime": datetime.toISOString(),
                        [agg_x]: agg_x_value,
                        "result": agg_x_value,
                        "contract_address": contract_address,
                        "tx_hash": tx_hash
                    }
                }

                const jsonContent = JSON.stringify(web3_json_data);

                try {

                    fs.writeFile("/tmp/data.json", jsonContent, async function(err) {
                        if (err) {
                            console.log("An error occured while writing JSON Object to File.");
                            console.log(err);
                            var res = {
                                "status": 403,
                                "data": {
                                    "jobRunID": jobRunID,
                                    "status": "errored",
                                    "error": {
                                        "name": "Unable to write data to the json file",
                                    },
                                    "statusCode": 403
                                }

                            }

                            callback(res.status, res.data)


                        } else {
                            console.log("JSON file has been saved.");
                            const token = process.env.TOKEN;

                            console.log(token);

                            const storage = new Web3Storage({ token })

                            const file = await getFilesFromPath("/tmp/data.json");

                            const cid = await storage.put(file)
                            console.log('Content added with CID:', cid)

                            var res = {
                                "status": 200,
                                "data": {
                                    "jobRunID": jobRunID,
                                    "status": "success",
                                    "result": agg_x_value,
                                    "message": `Data successfully uploaded to https://dweb.link/ipfs/${cid}`,
                                    "statusCode": 200
                                }

                            }

                            callback(res.status, res.data)

                        }
                    });
                } catch (e) {
                    var res = {
                        "status": 405,
                        "data": {
                            "jobRunID": jobRunID,
                            "status": "errored",
                            "error": {
                                "name": "Unable to upload data to web3 store",
                            },
                            "statusCode": 405
                        }

                    }

                    callback(res.status, res.data)
                }


            } else {
                res.data = {
                    "jobRunID": [jobRunID],
                    "status": "errored",
                    "error": {
                        "name": "AdapterError",
                    },
                    "statusCode": [res.status]
                }
                callback(res.status, res.data)

            }
            console.log(`statusCode: ${res.status}`)


        })
        .catch(error => {
            console.error(error)
            var res = {
                "status": 400,
                "data": {
                    "jobRunID": jobRunID,
                    "status": "errored",
                    "error": {
                        "name": "AdapterError",
                    },
                    "statusCode": 400
                }

            }

            callback(res.status, res.data)
        })

}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
    req.body["data"] = JSON.parse(req.body["data"]);
    createRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data)
    })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
    createRequest(event, (statusCode, data) => {
        callback(null, data)
    })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
    createRequest(JSON.parse(event.body), (statusCode, data) => {
        callback(null, {
            statusCode: statusCode,
            body: JSON.stringify(data),
            isBase64Encoded: false
        })
    })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest