const Hero = require('../models/heroModel');
const mongoose = require('mongoose');

// Definir modelos de género, editorial y alineación
const Gender = mongoose.model('Gender', new mongoose.Schema({
    gender_id: Number,
    name: String
}, { collection: 'gender' }));

const Publisher = mongoose.model('Publisher', new mongoose.Schema({
    publisher_id: Number,
    publisher_name: String
}, { collection: 'publisher' }));

const Alignment = mongoose.model('Alignment', new mongoose.Schema({
    alignment_id: Number,
    name: String
}, { collection: 'alignment' }));

// Función para obtener todos los héroes con campos poblados
const getHeroes = async (req, res) => {
    try {
        const { race, publisher_name, gender_name, alignment_name, hero_id, page = 1, limit = 25 } = req.query;
        const skip = (page - 1) * limit;

        const query = {};

        // Filtro por hero_id
        if (hero_id) {
            query.hero_id = parseInt(hero_id); // Asegúrate de que hero_id sea un número
        }

        // Filtro por raza
        if (race) {
            query.race = { $regex: new RegExp(race, "i") };
        }

        // Filtro por nombre del editor
        if (publisher_name) {
            const publishers = await Publisher.find().lean();
            const publisherMap = publishers.reduce((map, publisher) => {
                if (publisher.publisher_name.toLowerCase().includes(publisher_name.toLowerCase())) {
                    map[publisher.publisher_name.toLowerCase()] = publisher.publisher_id;
                }
                return map;
            }, {});

            const publisher_ids = Object.values(publisherMap);
            if (publisher_ids.length > 0) {
                query.publisher_id = { $in: publisher_ids };
            } else {
                return res.json({ heroes: [], totalPages: 0 });
            }
        }

        // Filtro por nombre del género
        if (gender_name) {
            const genders = await Gender.find().lean();
            const genderMap = genders.reduce((map, gender) => {
                if (gender.name.toLowerCase() === gender_name.toLowerCase()) {
                    map[gender.name.toLowerCase()] = gender.gender_id;
                }
                return map;
            }, {});

            const gender_ids = Object.values(genderMap);
            if (gender_ids.length > 0) {
                query.gender_id = { $in: gender_ids };
            } else {
                return res.json({ heroes: [], totalPages: 0 });
            }
        }

        // Filtro por nombre del alignment
        if (alignment_name) {
            const alignments = await Alignment.find().lean();
            const alignmentMap = alignments.reduce((map, alignment) => {
                if (alignment.name.toLowerCase() === alignment_name.toLowerCase()) {
                    map[alignment.name.toLowerCase()] = alignment.alignment_id;
                }
                return map;
            }, {});

            const alignment_ids = Object.values(alignmentMap);
            if (alignment_ids.length > 0) {
                query.alignment_id = { $in: alignment_ids };
            } else {
                return res.json({ heroes: [], totalPages: 0 });
            }
        }

        const heroes = await Hero.find(query).skip(parseInt(skip)).limit(parseInt(limit)).lean();
        const totalHeroes = await Hero.countDocuments(query);

        // Obtener publishers, genders y alignments para hacer el mapeo
        const publishers = await Publisher.find().lean();
        const genders = await Gender.find().lean();
        const alignments = await Alignment.find().lean();

        const publisherMap = publishers.reduce((map, publisher) => {
            map[publisher.publisher_id] = publisher.publisher_name;
            return map;
        }, {});

        const genderMap = genders.reduce((map, gender) => {
            map[gender.gender_id] = gender.name;
            return map;
        }, {});

        const alignmentMap = alignments.reduce((map, alignment) => {
            map[alignment.alignment_id] = alignment.name;
            return map;
        }, {});

        // Agregar nombres a los héroes
        const heroesWithNames = heroes.map(hero => ({
            ...hero,
            publisher_name: publisherMap[hero.publisher_id] || 'Unknown',
            gender_name: genderMap[hero.gender_id] || 'Unknown',
            alignment_name: alignmentMap[hero.alignment_id] || 'Unknown'
        }));

        res.json({
            heroes: heroesWithNames,
            totalPages: Math.ceil(totalHeroes / limit)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Función para agregar un nuevo héroe
const addHero = async (req, res) => {
    try {
        const { hero_id, name, eye_color, hair_color, skin_color, height, weight, race, publisher_id, gender_id, alignment_id } = req.body;

        // Validaciones de los campos
        if (!hero_id || !name || !height || !weight || !publisher_id || !gender_id || !alignment_id) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Validar que el hero_id no exista ya en la colección
        const existingHero = await Hero.findOne({ hero_id });
        if (existingHero) {
            return res.status(400).json({ message: 'Hero ID already exists, please choose a different ID' });
        }

        // Validaciones adicionales, alignment, gender, publisher
        if (alignment_id < 1 || alignment_id > 3) {
            return res.status(400).json({ message: 'Alignment ID must be between 1 and 3' });
        }

        if (gender_id < 1 || gender_id > 2) {
            return res.status(400).json({ message: 'Gender ID must be between 1 and 2' });
        }

        if (publisher_id < 1 || publisher_id > 25) {
            return res.status(400).json({ message: 'Publisher ID must be between 1 and 25' });
        }

        // Crear el nuevo héroe si no hay duplicado en el hero_id
        const newHero = new Hero({
            hero_id,
            name,
            eye_color,
            hair_color,
            skin_color,
            height,
            weight,
            race,
            publisher_id,
            gender_id,
            alignment_id
        });

        const savedHero = await newHero.save();
        res.status(201).json(savedHero);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Función para eliminar un héroe
const deleteHero = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Hero.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        res.status(200).json({ message: 'Hero deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Función para actualizar un héroe existente
const updateHero = async (req, res) => {
    try {
        const { id } = req.params;
        const { /*hero_id,*/ name, eye_color, hair_color, skin_color, height, weight, race, publisher_id, gender_id, alignment_id } = req.body;

        // Validaciones de los campos
        if (/*!hero_id ||*/ !name || !height || !weight || !publisher_id || !gender_id || !alignment_id) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        if (alignment_id < 1 || alignment_id > 3) {
            return res.status(400).json({ message: 'Alignment ID must be between 1 and 3' });
        }

        if (gender_id < 1 || gender_id > 2) {
            return res.status(400).json({ message: 'Gender ID must be between 1 and 2' });
        }

        const updatedHero = await Hero.findByIdAndUpdate(id, {
           // hero_id,
            name,
            eye_color,
            hair_color,
            skin_color,
            height,
            weight,
            race,
            publisher_id,
            gender_id,
            alignment_id
        }, { new: true });

        if (!updatedHero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        res.json(updatedHero);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Función para obtener un héroe por ID
const getHeroById = async (req, res) => {
    try {
        const { id } = req.params;
        const hero = await Hero.findById(id);

        if (!hero) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        res.json(hero);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getHeroes, addHero, deleteHero, updateHero, getHeroById };