import React, { useState } from "react";
import "./styles.css";

function czy_pierwsza(n) {
  if (n < 2) return false;

  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function nwd(a, b) {
  while (a !== b)
    if (a > b) a -= b;
    else b -= a;
  return a;
}

function modPower(x, y, p) {
  let res = 1;
  x = x % p;
  if (x === 0) return 0;
  while (y > 0) {
    if (y & 1) res = (res * x) % p;
    y = y >> 1;
    x = (x * x) % p;
  }
  return res;
}

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

export default function App() {
  let [pInfo, setPInfo] = useState("");
  let [qInfo, setQInfo] = useState("");

  let [priv, setPriv] = useState([0, 0]);
  let [pub, setPub] = useState([0, 0]);
  let [enc, setEnc] = useState("");
  let [dec, setDec] = useState("");

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPInfo("");
          setQInfo("");
          let formData = new FormData(e.target);
          let d = [];
          for (let data of formData) {
            d.push(data[1]);
          }
          if (!d[0].match(/^[1-9][0-9]*$/))
            return setPInfo("N musi być liczbą!");
          if (!d[1].match(/^[1-9][0-9]*$/))
            return setQInfo("G musi być liczbą!");

          let p = Number(d[0]),
            q = Number(d[1]);

          if (!czy_pierwsza(p)) {
            for (let i = p; ; i++) {
              if (czy_pierwsza(i)) {
                p = i;
                setPInfo("p = " + i);
                break;
              }
            }
          }
          if (!czy_pierwsza(q)) {
            for (let i = q; ; i++) {
              if (czy_pierwsza(i)) {
                q = i;
                setQInfo("q = " + i);
                break;
              }
            }
          }
          let n = p * q,
            phi = (p - 1) * (q - 1),
            ee,
            dd;

          while (true) {
            ee = randomInt(2, phi);
            if (!czy_pierwsza(ee)) continue;
            if (nwd(ee, phi) === 1) break;
          }

          for (let i = 2; i < phi; i++) {
            dd = i;
            if ((ee * dd - 1) % phi === 0) break;
          }

          setPub([ee, n]);
          setPriv([dd, n]);
        }}
      >
        <h1>Algorytm RSA</h1>
        <input type="text" name="p" placeholder="p" />
        <div className="info">{pInfo}</div>
        <input type="text" name="q" placeholder="q" />
        <div className="info">{qInfo}</div>
        <button>Oblicz klucze</button>
      </form>
      <div className="results">
        <p>Klucz publiczny: {"e = " + pub[0] + ", n = " + pub[1]}</p>
        <p>Klucz prywatny: {"d = " + priv[0] + ", n = " + priv[1]}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(e.target);
          let d = [];
          for (let data of formData) {
            d.push(data[1]);
          }
          let ee = Number(d[0]),
            n = Number(d[1]),
            msg = d[2];

          let newMsg = "";
          for (let letter of msg) {
            let intLetter = letter.charCodeAt(0);
            newMsg += "/" + modPower(intLetter, ee, n);
          }
          setEnc(newMsg);
        }}
      >
        <input type="text" name="msg" placeholder="e" />
        <input type="text" name="msg" placeholder="n" />
        <input type="text" name="msg" placeholder="Wiadomość" />
        <button>Zaszyfruj</button>
      </form>
      <div className="results">
        <p>Wiadomość zaszyfrowana:</p>
        <p>{enc}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(e.target);
          let d = [];
          for (let data of formData) {
            d.push(data[1]);
          }
          let dd = Number(d[0]),
            n = Number(d[1]),
            msg = d[2];

          let decodedMsg = "";
          for (let letter of msg.split("/")) {
            if (letter === "") continue;
            decodedMsg += String.fromCharCode(modPower(letter, dd, n));
          }
          setDec(decodedMsg);
        }}
      >
        <input type="text" name="msg" placeholder="d" />
        <input type="text" name="msg" placeholder="n" />
        <input type="text" name="msg" placeholder="Wiadomość" />
        <button>Deszyfruj</button>
      </form>
      <div className="results">
        <div>Wiadomość zdeszyfrowana:</div>
        <div>{dec}</div>
      </div>
    </div>
  );
}
