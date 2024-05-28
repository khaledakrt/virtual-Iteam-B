const axios = require('axios');

async function getOpenStackData(authToken) {
    try {
        const api_url = 'http://192.168.122.100:8774/v2.1/servers';

        // Envoi de la requête GET à l'API OpenStack avec le token d'authentification
        const response = await axios.get(api_url, { headers: { 'X-Auth-Token': authToken } });

        // Récupération des données de la réponse
        const data = response.data;

        
        // Retourner les données récupérées si nécessaire
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis l\'API OpenStack :', error);
        throw error;
    }
}

module.exports = { getOpenStackData };
