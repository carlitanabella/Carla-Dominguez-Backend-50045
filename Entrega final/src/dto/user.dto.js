// src/dto/user.dto.js

class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        // Añadir más campos según sea necesario
    }
}

module.exports = UserDTO;
