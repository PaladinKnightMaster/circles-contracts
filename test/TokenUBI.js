const truffleContract = require('truffle-contract');

const { BigNumber, ZERO_ADDRESS, decimals } = require('./helpers/constants');
const { bn, convertToBaseUnit } = require('./helpers/math');
const { assertRevert } = require('./helpers/assertRevert');

const Hub = artifacts.require('Hub');
const Token = artifacts.require('Token');

require('chai')
  .use(require('chai-bn')(BigNumber))
  .should();

contract('UBI', ([_, owner, recipient, anotherAccount, systemOwner]) => { // eslint-disable-line no-unused-vars
  let hub = null;
  let token = null;

  const issuance = bn(1736111111111111);
  const symbol = 'CRC';
  const tokenName = 'MyCoin';
  const initialPayout = convertToBaseUnit(100);

  beforeEach(async () => {
    hub = await Hub.new(systemOwner, issuance, symbol, initialPayout);
    const signup = await hub.signup(tokenName, { from: owner });
    token = await Token.at(signup.logs[1].args.token);
  });

  describe('power', () => {
    it('returns the result of base^exponent', async () => {
      (await token.pow(2, 4)).should.be.bignumber.equal(bn(16));
    });

    it('returns the result of base^exponent for a very high number', async () => {
      (await token.pow(15833, 12)).should.be.bignumber.equal(bn('248175291811094805747824732449565240388888669248161'));
    });

    it('returns the result of base^exponent for base=1', async () => {
      (await token.pow(1, 12)).should.be.bignumber.equal(bn('1'));
    });

    it('returns the result of base^exponent for base=0', async () => {
      (await token.pow(0, 12)).should.be.bignumber.equal(bn('0'));
    });

    it('returns the result of base^exponent for exponent=1', async () => {
      (await token.pow(12, 1)).should.be.bignumber.equal(bn('12'));
    });

    it('returns the result of base^exponent for base=0 exponent=1', async () => {
      (await token.pow(0, 1)).should.be.bignumber.equal(bn('0'));
    });

    it('returns the result of base^exponent for exponent=0', async () => {
      (await token.pow(12, 0)).should.be.bignumber.equal(bn('1'));
    });

    it('should throw on overflow', async () => {
      await assertRevert(token.pow(12, 583333333))
    });
  });

});
