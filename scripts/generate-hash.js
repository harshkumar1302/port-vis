import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
    console.log("Usage: node generate-hash.js <your_password>");
    process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        process.exit(1);
    }
    console.log("\n--- BCRYPT HASH GENERATED ---");
    console.log(hash);
    console.log("-----------------------------\n");
    console.log("Use this value for your OWNER_PASS_HASH environment variable.");
});
