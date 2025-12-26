// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StudentRegistry {
    struct Record {
        string recordId;
        uint256 timestamp;
    }

    mapping(string => Record[]) private studentRecords;

    event RecordAdded(
        string indexed studentId,
        string recordId,
        uint256 timestamp
    );

    function addRecord(
        string memory studentId,
        string memory recordId
    ) public {
        studentRecords[studentId].push(
            Record(recordId, block.timestamp)
        );

        emit RecordAdded(studentId, recordId, block.timestamp);
    }

    function getRecords(
        string memory studentId
    ) public view returns (Record[] memory) {
        return studentRecords[studentId];
    }
}
