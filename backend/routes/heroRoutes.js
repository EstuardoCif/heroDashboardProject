const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

// Ruta para obtener los héroes con paginación
router.get('/', heroController.getHeroes);

// Ruta para agregar un héroe
router.post('/', heroController.addHero);

// Ruta para eliminar un héroe
router.delete('/:id', heroController.deleteHero);

// Ruta para actualizar un héroe
router.put('/:id', heroController.updateHero);

// Ruta para obtener un héroe por ID
router.get('/:id', heroController.getHeroById);

module.exports = router;
