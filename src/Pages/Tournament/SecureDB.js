import { set, update, push } from 'firebase/database';


export async function secureSet(dbRef, value) {
  const password = prompt("Enter password for write access:");
  if (password === "4340") {
    await set(dbRef, value);
  } else {
    alert("Invalid password, update skipped.");
  }
}

export async function secureUpdate(dbRef, value) {
  const password = prompt("Enter password for write access:");
  if (password === "4340") {
    await update(dbRef, value);
  } else {
    alert("Invalid password, update skipped.");
  }
}

export async function securePush(dbRef, value) {
  const password = prompt("Enter password for write access:");
  if (password === "4340") {
    await push(dbRef, value);
  } else {
    alert("Invalid password, update skipped.");
  }
}
