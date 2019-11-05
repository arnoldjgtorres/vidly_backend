const bcrypt = require("bcrypt");
//salt is a random string added before or after
//password so resulting hash will be different for
//common passwords users will choose to use

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("1245", salt);
  console.log(salt);
  console.log(hashed);
}

run();
