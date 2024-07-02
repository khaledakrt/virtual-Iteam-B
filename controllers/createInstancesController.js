const CreateInstance = require('../models/createInstances'); // Adjust the path if necessary
const Student = require('../models/Students'); // Adjust the path if necessary

exports.createInstances = async (req, res) => {
    const { id_specialite, id_group, id_niveau, id_instance } = req.body;

    if (!id_specialite || !id_group || !id_niveau || !id_instance) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const students = await Student.find({
            role: id_specialite,
            vms: id_group,
            classe: id_niveau
        });

        if (students.length === 0) {
            return res.status(404).json({ error: 'No matching students found' });
        }

        const instancesToCreate = [];

        for (const student of students) {
            const existingInstance = await CreateInstance.findOne({
                Id_student: student._id.toString(),
                id_specialite,
                id_group,
                id_niveau,
                id_instance
            });

            if (!existingInstance) {
                instancesToCreate.push({
                    Id_student: student._id.toString(),
                    id_specialite,
                    id_group,
                    id_niveau,
                    id_instance
                });
            }
        }

        if (instancesToCreate.length > 0) {
            const createdInstances = await CreateInstance.insertMany(instancesToCreate);
            return res.status(201).json({ message: 'Instances created successfully', createdInstances });
        } else {
            return res.status(200).json({ message: 'No new instances were created as all instances already exist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
