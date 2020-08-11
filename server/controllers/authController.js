const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) =>{
        const {username, password, isAdmin} = res.body;
        const db = req.app.get('db');
        const result = await db.get.user([username]);
        const existingUser = result[0];
        if (existingUser){
            return res.status(409).send('Username taken');
        }
        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };
        return res.status(201).send(req.session.user);
    },
};