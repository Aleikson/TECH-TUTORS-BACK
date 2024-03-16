import userActivation from '../models/userActivation.model.js';
import { errorHandler } from '../utils/error.js';

export const test = (request, response) => {
    response.json({ 
        status: 200,
        message: 'API is working!' });
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
