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
    event RepMessage(address message, uint a, uint b, uint c, uint d);
    event BalanceMessage(address account, uint balance);
    event Message(uint msg);
    event AddedAccount(address account);
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
      uint balance; 
      balance = balances[_account];
      
      bool exists = false;
      
      for(uint i = 0; i < accounts.length; i++) {
        if(accounts[i] == _account) {
          exists = true;
        }
      }
      
      if(exists == false) {
        accounts.push(_account);
        emit AddedAccount(_account);
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
    
    function burn(address _from, uint tokens) public returns (bool success) {
      balances[_from] = safeSub(balances[_from], tokens);
      return true;
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
        addAccount(to);
        emit Transfer(from, to, tokens);
        return true;
    }


    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function distributeSem() public {
      uint256 salary;
      uint256 sem = this.balance;
      uint balance; 
      emit Message(accounts.length);
      for(uint i = 0; i < accounts.length; i++){
        balance = balances[accounts[i]];
        
        emit BalanceMessage(accounts[i], balance);
        if(balance > 0) {
          salary = 
            safePercentageOf(balance, _totalSupply, sem, 2);
          if(salary > 0) {
            salary = salary - 1;
          }
          
          emit RepMessage(accounts[i], balance, _totalSupply, sem, salary);
          /* emit RepMessage(salary); */
          if(salary > 0) {
            accounts[i].transfer(salary);  
          }
          
        }
      }
    }
}
