interface MPX:
    def resolveRnds(sender: address, rnds: uint256[10]): nonpayable


mpx: MPX


@external
def __init__():
  pass

@external
@nonpayable
def setMpx(_mpx: address):
  self.mpx = MPX(_mpx)

@external
def requestRnd(sender: address):
  # TODO use chainlink https://docs.chain.link/docs/get-a-random-number/ | https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBase.sol
  rns: uint256 = convert(keccak256(concat(convert(block.timestamp, bytes32), convert(block.difficulty, bytes32), convert(msg.sender, bytes32))), uint256)
  expandedRns: uint256[10] = empty(uint256[10])
  for i in range(10):
   expandedRns[i] = convert(keccak256(concat(convert(rns, bytes32), convert(i, bytes32))), uint256) % 220

  self.mpx.resolveRnds(sender, expandedRns)
  
