const PaymentPool = artifacts.require('./PaymentPool.sol');
const Token = artifacts.require('./Token.sol');

contract('PaymentPool', function(accounts) {
  let paymentPool;
  let token;
  let miner = accounts[1];
  let payees = [
    accounts[1],
    accounts[2],
    accounts[3],
    accounts[4],
    accounts[5],
    accounts[6],
    accounts[7],
    accounts[8],
    accounts[9]
  ];

  let amounts = [
    10,
    12,
    2,
    1,
    32,
    10,
    9,
    9,
    2
  ];

  describe("ledger", function() {
    beforeEach(async function() {
      token = await Token.new();
      paymentPool = await PaymentPool.new(token.address);
    });

    xit("can iterate thru payees", async function() {
      let txn = await paymentPool.submitAnalytics(payees, amounts, {
        gas: 100000
      });

      let payeeIndex = await paymentPool.payeeIndex();

      console.log(JSON.stringify(txn, null, 2));
      console.log("PAYEE LOGS:", txn.logs.length);
      console.log("PAYEE INDEX:", payeeIndex.toNumber());

      txn = await paymentPool.submitAnalytics(payees, amounts, {
        gas: 100000
      });

      payeeIndex = await paymentPool.payeeIndex();

      console.log(JSON.stringify(txn, null, 2));
      console.log("PAYEE LOGS:", txn.logs.length);
      console.log("PAYEE INDEX:", payeeIndex.toNumber());
    });

    it("can allow a miner to post stake with the payment pool", async function() {
      await token.mint(miner, 100);

      await token.approve(paymentPool.address, 10, { from: miner });

      let txn = await paymentPool.postMiningStake(10, { from: miner });
      assert.equal(txn.logs.length, 1, "the number of events is correct");

      let event = txn.logs[0];
      assert.equal(event.event, "MiningStake", "the event type is correct");
      assert.equal(event.args.miner, miner, "the miner is correct");
      assert.equal(event.args.amount.toNumber(), 10, "the amount staked is correct");

      let stake = await paymentPool.miningStake(miner);

      assert.equal(stake.toNumber(), 10, "the mining stake is correct");
    });

    it("can store the analytics solution", async function() {
      await paymentPool.startNewEpoch();

      let proof = web3.toHex("my proof is pudding");
      let txn = await paymentPool.submitAnalytics(payees, amounts, proof, { from: accounts[1] });

      console.log(JSON.stringify(txn, null, 2));

      txn = await paymentPool.getSettlementQueueJob(0);

      console.log("ANALYTICS SOLUTION", JSON.stringify(txn, null, 2));
    });
  });

});

