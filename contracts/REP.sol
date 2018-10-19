pragma solidity ^0.4.24;

import "./SafeMath.sol";

contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract REP is ERC20Interface, SafeMath {
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;

    address[] accounts;
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    constructor (string _tokenSymbol, string _name) public payable{
        symbol = _tokenSymbol;
        name = _name;
        decimals = 18;
        _totalSupply = msg.value;
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function addAccount(address _account) 
    internal {
      if(balances[_account] == 0) {
        accounts.push(_account);
      }
    }

    function totalSupply() public constant returns (uint) {
        return _totalSupply  - balances[address(0)];
    }

    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }

    function mintToken() public payable {
        balances[msg.sender] = safeAdd(balances[msg.sender], msg.value);
        _totalSupply = safeAdd(_totalSupply, msg.value);
        emit Transfer(address(0), msg.sender, msg.value);
    }

    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }


    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function distributeSem() public {
      uint256 salary;
      uint256 sem = address(this).balance;
      
      for(uint i = 0; i < accounts.length; i++){
        if(balances[accounts[i]] > 0) {
          salary = 
            safePercentageOf(balances[accounts[i]], _totalSupply, sem, 2);
            
          transferFrom(this, accounts[i], salary);
        }
      }
    }
}
