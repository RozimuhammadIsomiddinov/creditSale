const { createUsersTable, dropUsersTable } = require("./users_table");
const { createPaymentsTable, dropPaymentsTable } = require("./payments_table");
const { createZoneTable, dropZoneTable } = require("./zone_table");
const { createCollectorTable, dropCollectorTable } = require("./collector");
const { createAdminTable, dropAdminTable } = require("./admin");
const {
  createWorkPlaceTable,
  dropWorkPlaceTable,
} = require("./workplace_table");

const runMigration = async () => {
  console.log("Running migrations...");
  await createWorkPlaceTable();
  await createZoneTable();
  await createAdminTable();
  await createCollectorTable();
  await createUsersTable();
  await createPaymentsTable();

  console.log("Migrations completed.");
};

const rollbackMigration = async () => {
  console.log("Rolling back migrations...");
  await dropAdminTable();
  await dropCollectorTable();
  await dropPaymentsTable();
  await dropUsersTable();
  await dropZoneTable();
  await dropWorkPlaceTable();

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
