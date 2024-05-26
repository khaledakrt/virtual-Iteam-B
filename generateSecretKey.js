const crypto = require('crypto');

// Générer une clé secrète aléatoire de 32 octets
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Appeler la fonction pour générer une clé secrète
const secretKey = generateSecretKey();

console.log("Clé secrète générée :", secretKey);
