// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdXCampaign {
    uint public campaignCounter = 1;

    struct Campaign {
        string title;
        string description;
        uint goalAmount;
        uint currentAmount;
        uint startTime;
        uint endTime;
        address creator;
        bool exists;
    }

    mapping(uint => Campaign) public campaigns;

    event CampaignCreated(
        uint indexed campaignId,
        string title,
        string description,
        uint goalAmount,
        uint startTime,
        uint endTime,
        address indexed creator
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goalAmount,
        uint _startTime,
        uint _endTime
    ) external {
        require(_goalAmount > 0, "Goal must be > 0");
        require(_startTime < _endTime, "startTime < endTime required");

        uint campaignId = campaignCounter;

        campaigns[campaignId] = Campaign({
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            currentAmount: 0,
            startTime: _startTime,
            endTime: _endTime,
            creator: msg.sender,
            exists: true
        });

        emit CampaignCreated(
            campaignId,
            _title,
            _description,
            _goalAmount,
            _startTime,
            _endTime,
            msg.sender
        );

        campaignCounter++;
    }
}
