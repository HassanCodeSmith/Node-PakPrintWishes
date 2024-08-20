const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");

const mongoURI = process.env.DB_Url;

const backupDirectory = path.join(__dirname, "..", "DB_BACKUP");

async function createBackupDirectory() {
  try {
    await fs.mkdir(backupDirectory, { recursive: true });
    console.log("Backup directory created successfully.");
  } catch (error) {
    console.error("Error creating backup directory:", error.message);
  }
}

async function backupData() {
  try {
    const client = await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const collectionNames = [
      "brands",
      "apply_nows",
      "comments",
      "getquotes",
      "catseos",
      "contact_us",
      "favtproducts",
      "imagegalleries",
      "jobs",
      "notifications",
      "orders",
      "parent_categories",
      "partners",
      "paymenthistories",
      "productidcounters",
      "products",
      "reviews",
      "seos",
      "services",
      "sliders",
      "subcateseos",
      "subcategories",
      "vendororders",
      "users",
      "wallets",
    ];

    const fetchDataPromises = collectionNames.map(async (collectionName) => {
      const collection = client.db("PrintWishes").collection(collectionName);
      return collection.find({}).toArray();
    });

    const allData = await Promise.all(fetchDataPromises);

    const dataToBackup = {
      currentDate: new Date().toISOString(),
    };

    collectionNames.forEach((collectionName, index) => {
      dataToBackup[collectionName] = allData[index];
    });

    const fileName = `backup.json`;
    const filePath = path.join(backupDirectory, fileName);

    await fs.writeFile(filePath, JSON.stringify(dataToBackup, null, 2));

    console.log("Backup completed successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    client && client.close();
  }
}

module.exports = { createBackupDirectory, backupData };
