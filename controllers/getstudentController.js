const mongoose = require('mongoose');

// Function to fetch all students from the database
async function getStudent() {
    try {
        // Connect to the MongoDB database using the connection string from your .env file
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Fetch all students from the database
        const students = await Student.find();

        // Return the list of students
        return students;
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching students:', error);
        throw error;
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

module.exports = { getStudent };
