const express = require('express');
const CharacterController = require('../controllers/characterController');

const router = express.Router();
const characterController = new CharacterController();

// GET all characters
router.get('/', characterController.findAllCharacters.bind(characterController));

// GET character by ID
router.get('/:id', characterController.findCharacterById.bind(characterController));

// POST create new character
router.post('/', characterController.addCharacter.bind(characterController));

// PUT update character
router.put('/:id', characterController.updateCharacter.bind(characterController));

// DELETE character
router.delete('/:id', characterController.deleteCharacter.bind(characterController));

module.exports = router;
