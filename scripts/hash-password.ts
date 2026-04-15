import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: pnpm hash-password <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nPassword hash (copy this to ADMIN_PASSWORD_HASH):\n");
console.log(hash);
console.log();
