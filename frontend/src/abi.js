export const Remittance = {
    name: 'Remittance',
    abi: [
        "function encrypt(bytes32 userSecret, address exchangerAddress) public view returns(bytes32 password)",
        "function remit(bytes32 hashValue, uint256 second, uint256 remittance_amount) public returns(bool status)",
        "function exchange(bytes32 userSecret) public returns(bool status)",
        "function withdraw(uint256 amount) public returns(bool status)",
        "function claimBack(bytes32 hashValue) public returns(bool status)"
    ],
    address: {
        1: '',
        42: '0xd9F05ef1E7EEa7ac0941c27574d4eD7cfd376Dd0',
        31337: '',
        1337: ''
    }    
}