//Source: https://levelup.gitconnected.com/rate-limiting-a0783293026a

function getDelay(attempts) {
  return 1000 * Math.pow(2, attempts);
}

function take(oldToken, now) {
  if (!oldToken) {
    return { attempts: 0, timestamp: now };
  }
  return {
    attempts: oldToken.attempts + 1,
    timestamp: Math.max(oldToken.timestamp + getDelay(oldToken.attempts),now) };
}

export default async function takeToken(key) {
  const now = Date.now();
  const oldToken = await tokenDB.getToken(key);
  const newToken = take(oldToken, now);
  await tokenDB.replaceToken(key, newToken, oldToken);   // avoid concurrent token usage
  if (newToken.timestamp - now > 0) {
    await new Promise(r => setTimeout(r, newToken.timestamp - now));
  }
}

module.exports.takeToken = takeToken;

/*
import { inspect, deleteToken } from "./tokenDB";
import takeToken from "./tokenHub";


<button
        type="button"
        id="login"
        disabled={false}
        onClick={async () => {
          document.getElementById('login').default=true;
          try {
            try {
              await takeToken(document.getElementById('username').value);
            } catch (ex) {
            }
          } finally {
            document.getElementById('login').default=false;
          }
        }}
> Take Token </button>

*/