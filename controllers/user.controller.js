import userActivation from '../models/userActivation.model.js';
import { errorHandler } from '../utils/error.js';

export const test = (request, response) => {
    response.json({
        status: 200,
        message: 'API is working!',
    });
};

export const updateUser = async (request, response, next) => {
    if (request.user.id !== request.params.userId) {
        return next(errorHandler(403, 'Você não está autorizado a atualizar este usuário!'));
    }
    if (request.body.password) {
        if (request.body.password.length < 6) {
            return next(errorHandler(400, 'A senha deve conter 6 dígitos'));
        }
        request.body.password = bcryptjs.hashSync(request.body.password, 10);
    }
    if (request.body.username) {
        if (request.body.username.length < 7 || request.body.username.length > 20) {
            return next(
                errorHandler(400, 'Nome de usuário deve conter 7 a 20 caracteres')
            );
        }
        if (request.body.username.includes(' ')) {
            return next(errorHandler(400, 'Nome de usuário não pode conter espaços em branco'));
        }
        if (request.body.username !== request.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!request.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(400, 'Nome de usuário deve apenas conter números e letras')
            );
        }
    }
    try {
        const updatedUser = await userActivation.findByIdAndUpdate(
            request.params.userId,
            {
                $set: {
                    username: request.body.username,
                    email: request.body.email,
                    profilePicture: request.body.profilePicture,
                    password: request.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        response.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (request, response, next) => {
    if (!request.user.isAdmin && request.user.id !== request.params.userId) {
        return next(
            errorHandler(403, 'Você não está autorizado a deletar este usuário!')
        );
    }
    try {
        await userActivation.findByIdAndDelete(request.params.userId);
        response.status(200).json('Usuário foi deletado');
    } catch (error) {
        next(error);
    }
};

export const signout = (request, response, next) => {
    try {
        response
            .clearCookie('access_token')
            .status(200)
            .json('Usuário foi desconectado!');
    } catch (error) {
        next(error);
    }
};
