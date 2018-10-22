pragma solidity ^0.4.24;

contract SafeMath {
    
  
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) 
    public pure returns (uint c) {
        require(b > 0);
        
        c = a / b;
    }
    
    function safePercentageOf(uint a, uint b, uint c, uint precision)
    public returns (uint q) {
      require(c > 0);
      
      //example: (4*(10^2)/8)*(14*(10^2))/(10^4) = 7;

      uint p1 = a*(10**precision)/b;
      
      uint p2 = c*(10**precision);
      
      uint p3 = 10**(precision*2);
      
      q = p1 * p2 / p3;
      
    }
}