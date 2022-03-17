interface MPR:
    def requestRnds(sender: address): nonpayable


pixels: HashMap[address, HashMap[uint8, uint256]]

mpr: MPR


@external
def __init__():
  pass

@external
@nonpayable
def setMpr(_mpr: address):
  self.mpr = MPR(_mpr)

@external
@nonpayable
def conjurePixels():
  self.mpr.requestRnds(msg.sender)

@internal 
def mintPixels(sender: address, rnds: uint256[10]):
  for i in range(10):
    pxIdx: uint8 = convert(rnds[i], uint8)
    v: uint256 = self.pixels[sender][pxIdx]
    self.pixels[sender][pxIdx] = v + 1

@external 
def resolveRnds(sender: address, rnds: uint256[10]):
  self.mintPixels(sender, rnds)