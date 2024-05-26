const mongoose = require('mongoose');

// Function to fetch all teachers from the database
async function getteacher() {
    try {
        // Connect to the MongoDB database using the connection string from your .env file
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Fetch all teachers from the database
        const teacher = await teacher.find();

        // Return the list of teachers
        return teacher;
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching teachers:', error);
        throw error;
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

module.exports = { getteacher };
