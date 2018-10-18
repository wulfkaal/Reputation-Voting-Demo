pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./REP.sol";

contract SemadaCore is SafeMath {

  uint256 public proposalIndex;
  uint256 public tokenNumberIndex;

  mapping(uint256 => address) erc20SymbolAddresses;

  struct Vote {
    address from;
    uint256 rep;
    bool vote;
  }

  struct Pool { 
    address from;  
    uint256 tokenNumberIndex;
    string name; 
    uint256 timeout;  
    string evidence;  
    Vote[] votes;
  }

  mapping(uint256 => Pool) validationPool;
  
  event NewProposalCreated(uint256 proposalIndex, uint256 timeout);
  event NewDaoCreated(uint256 tokenNumberIndex);
  event SemadaInfo(string message);
  event SemDistributed(address to, uint256 value);
  event ProposalStatus(string status, uint256 yesRepStaked, uint256 noRepStaked);

  function getTokenAddress(uint256 _tokenNumberIndex) 
  public view returns (address tokenAddress){
    
    return erc20SymbolAddresses[_tokenNumberIndex];
  }

  //(address, uint256, string, uint256, string, uint, uint256, uint256)
  function getProposalVotes(uint256 _proposalIndex) view 
  public returns (uint, uint256, uint256) {
    
    Pool memory pool = validationPool[_proposalIndex];
    
    uint status = 1;
    uint256 totalRep = 0;
    uint256 totalYesRep = 0;
    Vote[] memory votes = pool.votes;
    
    for(uint i = 0; i < votes.length; i++){
      totalRep = safeAdd(totalRep, votes[i].rep);
      if(votes[i].vote){
        totalYesRep = safeAdd(totalYesRep, votes[i].rep);
      }
    }
    
    // TODO: handle timeout case
    
    if(now >= pool.timeout){
      if(totalYesRep >= safeDiv(totalRep, 2)){
        status = 2;
      } else {
        status = 3;
      }
    } else {
      status = 1;
    } 
    
    return (
      status,
      totalYesRep,
      totalRep - totalYesRep
      );
  }
  
  function getVote(uint256 _proposalIndex, uint256 _voteIndex) view
  public returns (address, uint256, bool) {
    return (validationPool[_proposalIndex].votes[_voteIndex].from,
      validationPool[_proposalIndex].votes[_voteIndex].rep,
      validationPool[_proposalIndex].votes[_voteIndex].vote);
  }

  function joinDao(uint256 _tokenNumberIndex) 
  public payable {

    proposalIndex = safeAdd(proposalIndex, 1);
      
    REP rep = REP(erc20SymbolAddresses[_tokenNumberIndex]);
    rep.mintToken.value(msg.value)();
    emit SemadaInfo(bytes32ToString(uintToBytes(msg.value)));
    emit SemadaInfo(bytes32ToString(uintToBytes(rep.totalSupply())));
    
    newProposalInternal(
      proposalIndex,
      _tokenNumberIndex, 
      "Join DAO",
      "Join DAO",
      msg.sender, 
      msg.value);
  }
  
  function bytes32ToString (bytes32 data) internal pure returns (string) {
    bytes memory bytesString = new bytes(32);
    for (uint j=0; j<32; j++) {
      byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
      if (char != 0) {
          bytesString[j] = char;
      }
    }
    return string(bytesString);
  }

  function uintToBytes(uint v) pure returns (bytes32 ret) {
    if (v == 0) {
        ret = '0';
    }
    else {
        while (v > 0) {
            ret = bytes32(uint(ret) / (2 ** 8));
            ret |= bytes32(((v % 10) + 48) * 2 ** (8 * 31));
            v /= 10;
        }
    }
    return ret;
  }

 
  function createDao(string _tokenName) 
  public payable {
    
    tokenNumberIndex = safeAdd(tokenNumberIndex, 1);
    
    string memory _tokenSymbol = 
      bytes32ToString(uintToBytes(tokenNumberIndex));
      
    address _tokenAddress = 
      (new REP).value(msg.value)(_tokenSymbol, _tokenName);
      
    erc20SymbolAddresses[tokenNumberIndex] = _tokenAddress;
    
    proposalIndex = safeAdd(proposalIndex, 1);
    
    emit NewDaoCreated(tokenNumberIndex);
        
    newProposalInternal(
      proposalIndex,
      tokenNumberIndex, 
      _tokenName, 
      _tokenName,
      msg.sender,
      msg.value);    
  }
  
  function newProposal(
    uint256 _tokenNumberIndex,
    string _proposalName,
    string _proposalEvidence
    ) public payable {
      
    proposalIndex = safeAdd(proposalIndex, 1);

    REP rep = REP(erc20SymbolAddresses[_tokenNumberIndex]);
    rep.mintToken.value(msg.value)();
    
    newProposalInternal(
      proposalIndex,
      _tokenNumberIndex,
      _proposalName,
      _proposalEvidence,
      msg.sender,
      msg.value);
  }
  
  function newProposalInternal(
    uint256 _proposalIndex,
    uint256 _tokenNumberIndex, 
    string _proposalName, 
    string _proposalEvidence,
    address _from,
    uint256 _value) internal {
    
    //setting timeout to 180 seconds from now
    uint256 _timeout = now + 15;
    emit NewProposalCreated(_proposalIndex, _timeout);

    Pool storage pool = validationPool[_proposalIndex];
    pool.from = _from;
    pool.tokenNumberIndex = _tokenNumberIndex;
    pool.name = _proposalName;
    pool.timeout = _timeout;
    pool.evidence = _proposalEvidence;

    voteInternal(_proposalIndex, _from, (_value / 2), true);
    //TODO: should false vote be 0 account?
    voteInternal(_proposalIndex, _from, (_value / 2), false);
  }
  
  function vote(
    uint256 _proposalIndex,
    bool _vote,
    uint256 _rep
    ) public {
    REP rep = REP(erc20SymbolAddresses[validationPool[_proposalIndex].tokenNumberIndex]);
    rep.transferFrom(msg.sender, this, _rep);
    
    voteInternal(
      _proposalIndex,
      msg.sender,
      _rep,
      _vote
    );
      
  }
  
  function voteInternal(
    uint256 _proposalIndex, 
    address _from,
    uint256 _value,
    bool _vote
    ) internal {
    
    Pool storage pool = validationPool[_proposalIndex];
      
    Vote memory newVote = Vote({from:_from, rep:_value, vote:_vote});
    
    pool.votes.push(newVote);
  }
  

  function distributeRep(uint256 _proposalIndex,
    uint256 _totalRepStaked, 
    uint256 _yesRepStaked, 
    uint256 _noRepStaked) public {
      
    Pool memory pool = validationPool[_proposalIndex];
    address tokenAddress;
    tokenAddress = erc20SymbolAddresses[pool.tokenNumberIndex];
    Vote[] memory votes = pool.votes;
    
    REP rep = REP(tokenAddress);
  
    for(uint j = 0; j < votes.length; j++){
      uint256 betAmtWon;
      if(_yesRepStaked >= _noRepStaked && votes[j].vote){
      
        betAmtWon = 
          safePercentageOf(votes[j].rep, _yesRepStaked, _totalRepStaked, 2);
          
        rep.transferFrom(this, votes[j].from, betAmtWon);
      } else if (_noRepStaked < _yesRepStaked && !votes[j].vote){
        
        betAmtWon = 
          safePercentageOf(votes[j].rep, 
            _noRepStaked, _totalRepStaked, 2);
          
        rep.transferFrom(this, votes[j].from, betAmtWon);
      }
    }
      
  }
}