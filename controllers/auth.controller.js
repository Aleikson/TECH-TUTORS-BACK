import bcryptjs from 'bcryptjs';
import UserActivation from '../models/userActivation.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (request, response, next) => {
    const { username, email, password } = request.body;

    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
    ) {
        next(new Error('Todos os campos são obrigatórios!'));
        return;
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserActivation({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        response.json('Cadastro realizado com sucesso');
    } catch (error) {
        next(error);
    }
};

export const signin = async (request, response, next) => {
    const { email, password } = request.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(404, 'Todos os campos são obrigatórios!'));
    }

    try {
        const validUser = await UserActivation.findOne({ email });
        if (!validUser) {
            return next(errorHandler(400, 'Usuário não encontrado'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Senha inválida!'));
        }

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );
        const { password: pass, ...rest } = validUser._doc;

        response
            .status(200)
            .cookie('access_token', token, { httpOnly: true })
            .json(rest);
    } catch (error) {
        next(error);
    }
};
