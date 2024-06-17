import QRcode from "react-qr-code";
import "./App.css";

const treasure =
  "https://t.me/qrBeastBot/start?startapp=treasure-tZUli2qh3ASLsAqdIysc";

function App() {
  return (
    <>
      <a
        onClick={() => {
          setTimeout(() => {
            window.Telegram.WebApp.close();
          }, 500);
        }}
        href={treasure}
      >
        <QRcode value={treasure} />
      </a>
      <span>Click or scan the qr code to get the reward</span>
    </>
  );
}

export default App;
