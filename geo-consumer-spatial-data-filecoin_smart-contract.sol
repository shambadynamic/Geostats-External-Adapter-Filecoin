// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract GeospatialConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    uint256 public constant ORACLE_PAYMENT = 0.1 * 10**19; // 1 LINK
    int256 public currentData;
    //declaring Shamba oracle address and jobid
    address private oracle;
    bytes32 private jobId;
   
    
    //this is where we initialize state variables
    constructor() ConfirmedOwner(msg.sender) {
        setPublicChainlinkToken();
        //here we initialize the oracle address and jobids
        oracle = YOUR_ORACLE_CONTRACT_ADDRESS;
        jobId = "YOUR_CHAINLINK_NODE_JOB-ID";
        
    }


    //here we build the data request
    function requestGeospatialData() public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillGeospatialData.selector
        );
        
        req.add("data", "{\"agg_x\": \"agg_max\", \"dataset_code\":\"COPERNICUS/S2_SR\", \"selected_band\":\"NDVI\", \"image_scale\":250.0, \"start_date\":\"2021-09-01\", \"end_date\":\"2021-09-10\", \"geometry\":{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[19.51171875,4.214943141390651],[18.28125,-4.740675384778361],[26.894531249999996,-4.565473550710278],[27.24609375,1.2303741774326145],[19.51171875,4.214943141390651]]]}}]}}");
       
        return sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);
    }

    //This is the callback function
    //currentData is the variable that holds the data from the oracle
    function fulfillGeospatialData(bytes32 _requestId, int256 _data) public recordChainlinkFulfillment(_requestId)
    {
        currentData = _data;
    }


}
