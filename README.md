# Geostas-External-Adapter-Filecoin


To see the list of CIDs (content ids) for IPFS files used in this demo, visit http://165.232.134.108:5555/.

To see the live demo visit:  http://shamba-geostats-filecoin.herokuapp.com/    (note its http  - not https: if the app does not load remove the 's' from the URL on your browser)

1. This external adapter can be deployed and used as the bridge on the Chainlink node. 

2. The toml job spec (geo-consumer-spatial-data-filecoin_jobSpec.toml) can be deployed onto the Chainlink node. In that job spec, you can edit the "YOUR_ORACLE_CONTRACT_ADDRESS" by replacing it with your Oracle contract address and the name of the bridge (shamba-geostats-bridge-filecoin) with your deployed bridge name.

3. Then, the functionality of this external adapter (i.e., to store the request data, response data, contract address that is triggering the job, transaction hash etc onto the web3 IPFS/Filecoin storage) can be tested through the smart contract (geo-consumer-spatial-data-filecoin_smart-contract.sol), by calling the 'requestGeospatialData' function, then the successful response of the external adapter will be having the link of the web3 stored file like 
https://bafybeieqpgkd44lzoddpqfp45ahd5ls7c2abizi4j7puqp4cgezqdqc3cy.ipfs.dweb.link/data.json

