# Geostas-External-Adapter-Filecoin

1. This external adapter can be deployed and used as the bridge on the Chainlink node. It's already deployed and serving as POST request on http://165.232.134.108:5555/.

2. The toml job spec (geo-consumer-spatial-data-filecoin_jobSpec.toml) can be deployed onto the Chainlink node. In that job spec, you can edit the "YOUR_ORACLE_CONTRACT_ADDRESS" by replacing it with your Oracle contract address and the name of the bridge (shamba-geostats-bridge-filecoin) with your deployed bridge name.

3. Then, the functionality of this external adapter (i.e., to store the request data, response data, contract address that is triggering the job, transaction hash onto the web3 IPFS/Filecoin storage) can be tested through the smart contract (geo-consumer-spatial-data-filecoin_smart-contract.sol), by calling the requestGeospatialData function, then the successful response of the external adapter will be having the link of the web3 stored file like https://dweb.link/ipfs/cid_of_stored_file.