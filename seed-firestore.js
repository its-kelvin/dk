/**
 * Aura Networks - Firestore Seeding Script
 * Usage: node seed-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');

// Replace with your Firebase Service Account JSON file path
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedProducts() {
  const data = JSON.parse(fs.readFileSync('../products.json', 'utf8'));
  const collectionRef = db.collection('products');

  for (const product of data) {
    try {
      await collectionRef.doc(product.id).set({
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Seeded: ${product.name}`);
    } catch (error) {
      console.error(`Error seeding ${product.name}:`, error.message);
    }
  }
}

seedProducts().then(() => {
  console.log('Seeding complete!');
  process.exit();
});
