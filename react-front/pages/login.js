import Head from 'next/head'
import Image from 'next/image'
import FirebaseApp from '../FirebaseApp';

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

export default function Home() {

  const doLogin = () => {
    const auth = getAuth();
    auth.languageCode = 'ja';

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
          'login_hint': 'user@example.com'
        });

        signInWithPopup(auth, provider)
          .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const idToken = credential.idToken;
            const user = result.user;

            alert('ログインok!');
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      }
    );
  }

  const checkLogin = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      alert('ログイン中');
      console.log(auth.currentUser.getIdToken(true)); // TODO: Token確認用のため削除
    } else {
      alert('ログインしていません');
    }
  }

  const doLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      alert('ログアウトしました');
    }).catch((error) => {
      alert('ログアウトできませんでした');
    });
  }

  return (
    <div>
      <h1>Googleログイン</h1>
      <p>
        <button onClick={doLogin}>googleでログインする</button>
      </p>
      <p>
        <button onClick={checkLogin}>ログインを確認する</button>
      </p>
      <p>
        <button onClick={doLogout}>ログアウトする</button>
      </p>
    </div>
  )
}