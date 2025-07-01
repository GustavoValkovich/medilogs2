// Character controller for medilogs2 project
// Adapted from TypeScript version to JavaScript

class Character {
    constructor(name, characterClass, level, hp, mana, attack, items = []) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = level;
        this.hp = hp;
        this.mana = mana;
        this.attack = attack;
        this.items = items;
        this.id = Date.now().toString(); // Simple ID generation
    }
}

// Simple in-memory repository (you can replace this with database integration)
class CharacterRepository {
    constructor() {
        this.characters = [];
    }

    async findAll() {
        return this.characters;
    }

    async findOne(id) {
        return this.characters.find(character => character.id === id);
    }

    async add(character) {
        this.characters.push(character);
        return character;
    }

    async update(id, updatedData) {
        const index = this.characters.findIndex(character => character.id === id);
        if (index !== -1) {
            this.characters[index] = { ...this.characters[index], ...updatedData };
            return this.characters[index];
        }
        return null;
    }

    async delete(id) {
        const index = this.characters.findIndex(character => character.id === id);
        if (index !== -1) {
            return this.characters.splice(index, 1)[0];
        }
        return null;
    }
}

const characterRepository = new CharacterRepository();

class CharacterController {

    async findAllCharacters(req, res) {
        try {
            const characters = await characterRepository.findAll();
            res.json({ data: characters });
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Error retrieving characters',
                errorCode: 'INTERNAL_SERVER_ERROR'
            });
        }
    }

    async findCharacterById(req, res) {
        try {
            const characterId = req.params.id;
            const character = await characterRepository.findOne(characterId);
            if (!character) {
                res.status(404).json({
                    errorMessage: 'Character not found',
                    errorCode: 'CHARACTER_NOT_FOUND'
                });
                return;
            }
            res.json({ data: character });
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Error retrieving character',
                errorCode: 'INTERNAL_SERVER_ERROR'
            });
        }
    }

    async addCharacter(req, res) {
        try {
            const input = req.body;
            
            // Basic validation
            if (!input.name || !input.characterClass || !input.level) {
                res.status(400).json({
                    errorMessage: 'Name, character class, and level are required',
                    errorCode: 'VALIDATION_ERROR'
                });
                return;
            }

            const newCharacter = new Character(
                input.name,
                input.characterClass,
                input.level,
                input.hp || 100,
                input.mana || 50,
                input.attack || 10,
                input.items || []
            );

            await characterRepository.add(newCharacter);

            res.status(201).json({ data: newCharacter });
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Error creating character',
                errorCode: 'INTERNAL_SERVER_ERROR'
            });
        }
    }

    async updateCharacter(req, res) {
        try {
            const characterId = req.params.id;
            const input = req.body;

            const updatedCharacter = await characterRepository.update(characterId, input);
            if (!updatedCharacter) {
                res.status(404).json({
                    errorMessage: 'Character not found',
                    errorCode: 'CHARACTER_NOT_FOUND'
                });
                return;
            }

            res.json({ data: updatedCharacter });
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Error updating character',
                errorCode: 'INTERNAL_SERVER_ERROR'
            });
        }
    }

    async deleteCharacter(req, res) {
        try {
            const characterId = req.params.id;
            const deletedCharacter = await characterRepository.delete(characterId);
            
            if (!deletedCharacter) {
                res.status(404).json({
                    errorMessage: 'Character not found',
                    errorCode: 'CHARACTER_NOT_FOUND'
                });
                return;
            }

            res.json({ 
                message: 'Character deleted successfully',
                data: deletedCharacter 
            });
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Error deleting character',
                errorCode: 'INTERNAL_SERVER_ERROR'
            });
        }
    }
}

module.exports = CharacterController;
