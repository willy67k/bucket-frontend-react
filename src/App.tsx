import "./App.css";
import CheckAddress from "./components/CheckAddress";
import ObjectViewer from "./components/ObjectViewer";
import WalletConnect from "./components/WalletConnect";
import TransferSui from "./components/TransferSui";

function App() {
  return (
    <div>
      <WalletConnect />
      <CheckAddress />
      <ObjectViewer />
      <TransferSui />
    </div>
  );
}

export default App;
