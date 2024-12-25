const { createUsersTable, dropUsersTable } = require("./users_table");

const { createPaymentsTable, dropPaymentsTable } = require("./payments_table");

const { createReturnsTable, dropReturnsTable } = require("./returns_table");

// Migrationni bajarish funksiyasi
const runMigration = async () => {
  console.log("Running migrations...");
  await createUsersTable();
  await createPaymentsTable();
  await createReturnsTable();
  console.log("Migrations completed.");
};

// Migrationni bekor qilish funksiyasi
const rollbackMigration = async () => {
  console.log("Rolling back migrations...");
  await dropReturnsTable();
  await dropPaymentsTable();
  await dropUsersTable();
  console.log("Rollback completed.");
};

const action = process.argv[2];

if (action === "up") {
  runMigration();
} else if (action === "down") {
  rollbackMigration();
} else {
  console.log('Please specify "up" to migrate or "down" to rollback.');
}
