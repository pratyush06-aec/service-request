import { isAllowed, requestAccess, signTransaction } from "@stellar/freighter-api";
import { Account, Address, Contract, Networks, rpc, TransactionBuilder, nativeToScVal, scValToNative, xdr } from "@stellar/stellar-sdk";

export const CONTRACT_ID = "CCBJ3A4NVK3IAUR2C36F2LKMC7A5QFSAARE6ZY2ZB7TFJDM7FQ4WCWQF";
export const DEMO_ADDR = "GDV2ORURN27DXHUYB2S7QVOIN2BI2RIVDK5C76J5DUZOMSJDZ27GDXUF";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const server = new rpc.Server(RPC_URL);

const toSymbol = (value) => xdr.ScVal.scvSymbol(String(value));
const toI128 = (value) => nativeToScVal(BigInt(value || 0), { type: "i128" });
const toU32 = (value) => nativeToScVal(Number(value || 0), { type: "u32" });
const toStr = (value) => nativeToScVal(String(value || ""));
const toAddr = (value) => new Address(value).toScVal();

const requireConfig = () => {
    if (!CONTRACT_ID) throw new Error("Set CONTRACT_ID in lib.js/stellar.js");
    if (!DEMO_ADDR) throw new Error("Set DEMO_ADDR in lib.js/stellar.js");
};

export const checkConnection = async () => {
    try {
        const allowed = await isAllowed();
        if (!allowed) return null;
        const result = await requestAccess();
        if (!result) return null;
        const address = (result && typeof result === "object" && result.address) ? result.address : result;
        if (!address || typeof address !== "string") return null;
        return { publicKey: address };
    } catch {
        return null;
    }
};

const waitForTx = async (hash, attempts = 0) => {
    const tx = await server.getTransaction(hash);
    if (tx.status === "SUCCESS") return tx;
    if (tx.status === "FAILED") throw new Error("Transaction failed");
    if (attempts > 30) throw new Error("Timed out waiting for transaction confirmation");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return waitForTx(hash, attempts + 1);
};

const invokeWrite = async (method, args = []) => {
    if (!CONTRACT_ID) throw new Error("Set CONTRACT_ID in lib.js/stellar.js");

    const user = await checkConnection();
    if (!user) throw new Error("Freighter wallet is not connected");

    const account = await server.getAccount(user.publicKey);
    let tx = new TransactionBuilder(account, {
        fee: "10000",
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(new Contract(CONTRACT_ID).call(method, ...args))
        .setTimeout(30)
        .build();

    try {
        tx = await server.prepareTransaction(tx);
    } catch (e) {
        let msg = e?.message || String(e);
        if (msg.includes("Error(Contract, #6)")) {
            throw new Error("❌ Validation Error: A Request with this ID already exists. Please use a different Request ID.");
        }
        if (msg.includes("Error(Contract, #")) {
            const match = msg.match(/Error\(Contract, #(\d+)\)/);
            throw new Error(`❌ Contract Validation Failed: Custom Error Code #${match ? match[1] : 'Unknown'}.`);
        }
        throw e;
    }

    const signed = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    if (!signed || signed.error) throw new Error(signed?.error || "Transaction signing failed");

    const signedTxXdr = typeof signed === "string" ? signed : signed.signedTxXdr;
    const sent = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE));

    if (sent.status === "ERROR") {
        throw new Error(sent.errorResultXdr || "Transaction rejected by network");
    }

    return waitForTx(sent.hash);
};

const invokeRead = async (method, args = []) => {
    requireConfig();

    const tx = new TransactionBuilder(new Account(DEMO_ADDR, "0"), {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
    })
        .addOperation(new Contract(CONTRACT_ID).call(method, ...args))
        .setTimeout(0)
        .build();

    const sim = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationSuccess(sim)) {
        return scValToNative(sim.result.retval);
    }

    let msg = sim.error || `Read simulation failed: ${method}`;
    if (msg.includes("Error(Contract, #4)")) {
        throw new Error("❌ Validation Error: Request ID not found in the Smart Contract.");
    }
    if (msg.includes("Error(Contract, #")) {
        const match = msg.match(/Error\(Contract, #(\d+)\)/);
        throw new Error(`❌ Contract Validation Failed: Custom Error Code #${match ? match[1] : 'Unknown'}.`);
    }
    throw new Error(msg);
};

export const createRequest = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.requester) throw new Error("requester address is required");

    return invokeWrite("create_request", [
        toSymbol(payload.id),
        toAddr(payload.requester),
        toStr(payload.title),
        toStr(payload.description),
        toU32(payload.priority),
        toSymbol(payload.category || "general"),
        toI128(payload.budget),
    ]);
};

export const acceptRequest = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.provider) throw new Error("provider address is required");

    return invokeWrite("accept_request", [
        toSymbol(payload.id),
        toAddr(payload.provider),
    ]);
};

export const submitWork = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.provider) throw new Error("provider address is required");

    return invokeWrite("submit_work", [
        toSymbol(payload.id),
        toAddr(payload.provider),
        toStr(payload.workNotes),
    ]);
};

export const approveWork = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.requester) throw new Error("requester address is required");

    return invokeWrite("approve_work", [
        toSymbol(payload.id),
        toAddr(payload.requester),
    ]);
};

export const rejectWork = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    if (!payload?.requester) throw new Error("requester address is required");

    return invokeWrite("reject_work", [
        toSymbol(payload.id),
        toAddr(payload.requester),
        toStr(payload.reason),
    ]);
};

export const getRequest = async (id) => {
    if (!id) throw new Error("id is required");
    return invokeRead("get_request", [toSymbol(id)]);
};

export const listRequests = async () => {
    return invokeRead("list_requests", []);
};