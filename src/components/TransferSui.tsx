import { useEffect, useState } from "react";
import { useConnectWallet, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Decimal from "decimal.js";

const TESTNET_XYZ_TX = "https://suiscan.xyz/testnet/tx";
const TESTNET_CHAIN = "sui:testnet";

export default function TransferSui() {
  const connectAccount = useConnectWallet();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction, data: resData } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const [balance, setBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDryRun = async (): Promise<Decimal | undefined> => {
    try {
      if (!connectAccount || !currentAccount) {
        throw new Error("請先連接錢包！");
      }

      if (currentAccount?.chains[0] !== TESTNET_CHAIN) {
        throw new Error("目前只支援TESTNET，請切換環境！");
      }

      if (!recipient || !amount) {
        throw new Error("請輸入地址與金額");
      }

      const tx = new Transaction();

      const amountInMist = new Decimal(amount).times(1000000000);
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist.toString())]);
      tx.transferObjects([coin], tx.pure.address(recipient));
      tx.setSender(currentAccount.address);

      const dryRunResult = await client.dryRunTransactionBlock({
        transactionBlock: await tx.build({ client }),
      });
      const gasUsed = dryRunResult.effects.gasUsed;
      const totalGas = new Decimal(gasUsed.computationCost || 0)
        .plus(gasUsed.storageCost || 0)
        .minus(gasUsed.storageRebate || 0)
        .plus(gasUsed.nonRefundableStorageFee || 0);

      return new Decimal(totalGas.toString()).div(1e9);
    } catch (err) {
      console.error(err);
      alert("交易失敗：" + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    try {
      if (!connectAccount || !currentAccount) {
        throw new Error("請先連接錢包！");
      }

      if (currentAccount?.chains[0] !== TESTNET_CHAIN) {
        throw new Error("目前只支援TESTNET，請切換環境！");
      }

      if (!recipient || !amount) {
        throw new Error("請輸入地址與金額");
      }

      setLoading(true);
      const tx = new Transaction();
      const amountInMist = new Decimal(amount).times(1000000000);
      const coins = await client.getCoins({ owner: currentAccount.address, coinType: "0x2::sui::SUI" });
      if (coins.data.length === 0) throw new Error("No SUI coin found");

      const estimateGasSui = await handleDryRun();
      if (!estimateGasSui) {
        throw new Error("Can't calculate gas");
      }
      const recommendGasSui = estimateGasSui.times(2);

      if (!balance) throw new Error("Not connected");

      const balanceSUI = new Decimal(balance);
      const sendAmount = new Decimal(amount);
      if (balanceSUI.lt(recommendGasSui.plus(sendAmount))) throw new Error(`No SUI coin enough, recommend ${recommendGasSui.plus(sendAmount).toFixed(9)}`);

      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist.toString())]);
      tx.transferObjects([coin], tx.pure.address(recipient));

      await signAndExecuteTransaction({
        transaction: tx,
      });
    } catch (err) {
      console.error(err);
      alert("交易失敗：" + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resData) {
      setTxDigest(resData.digest);
    }
  }, [resData]);

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount) {
        setBalance(null);
        return;
      }
      try {
        const res = await client.getBalance({ owner: currentAccount.address });
        setBalance(new Decimal(res.totalBalance).div(1e9).toFixed(9));
      } catch (err) {
        console.error("取得餘額失敗", err);
        setBalance("Error");
      }
    }
    fetchBalance();
  }, [currentAccount, client]);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>UserStory 4 發送 SUI (Testnet)</h3>
      <div>
        <label>目標地址：</label>
        <input style={{ width: "100%", marginBottom: 8, padding: 6 }} type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="例如 0xabc..." />
      </div>
      <div>
        <label>金額（SUI）：</label>
        <input style={{ width: "100%", marginBottom: 8, padding: 6 }} type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1" />
      </div>
      <div>
        <p style={{ color: "#2196F3" }}>
          餘額（SUI）：<b>{balance}</b>
        </p>
      </div>
      <button disabled={loading} onClick={handleTransfer}>
        {loading ? "交易中..." : "發送交易"}
      </button>

      {txDigest && (
        <div style={{ marginTop: 16 }}>
          ✅ 交易成功！
          <br />
          TX Digest: {txDigest}
          <br />
          <a href={`${TESTNET_XYZ_TX}/${txDigest}`} target="_blank" rel="noopener noreferrer">
            查看區塊鏈記錄
          </a>
        </div>
      )}
    </div>
  );
}
