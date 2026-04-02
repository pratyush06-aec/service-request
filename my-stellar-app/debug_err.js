import { Account, Address, Contract, Networks, rpc, TransactionBuilder, nativeToScVal, scValToNative, xdr } from "@stellar/stellar-sdk";
const CONTRACT_ID = "CCBJ3A4NVK3IAUR2C36F2LKMC7A5QFSAARE6ZY2ZB7TFJDM7FQ4WCWQF";
const DEMO_ADDR = "GDV2ORURN27DXHUYB2S7QVOIN2BI2RIVDK5C76J5DUZOMSJDZ27GDXUF";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

const toSymbol = (value) => xdr.ScVal.scvSymbol(String(value));
const toI128 = (value) => nativeToScVal(BigInt(value || 0), { type: "i128" });
const toU32 = (value) => nativeToScVal(Number(value || 0), { type: "u32" });
const toStr = (value) => nativeToScVal(String(value || ""));
const toAddr = (value) => new Address(value).toScVal();

async function run() {
    const id = `req${Math.floor(Math.random() * 1000000)}`;
    const tx = new TransactionBuilder(new Account(DEMO_ADDR, "0"), { fee: "10000", networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(new Contract(CONTRACT_ID).call("create_request",
            toSymbol(id), toAddr(DEMO_ADDR), toStr("Test title"), toStr("Test description"), toU32(3), toSymbol("bugfix"), toI128(1000)))
        .setTimeout(30).build();

    const sim = await server.simulateTransaction(tx);
    console.log("Error:", sim.error);
    if(sim.events) {
      sim.events.forEach(e => {
        if(e.event().type().name === 'diagnostic') {
           const log = e.event().body().value()?.value();
           if(log) {
             console.log("Diag:", JSON.stringify(log));
           }
        }
      })
    }
}
run();
