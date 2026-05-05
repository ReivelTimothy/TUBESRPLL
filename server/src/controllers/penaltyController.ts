// server/src/controllers/penaltyController.ts
import * as penaltyService from '../services/penaltyService';
import { TokenPayloadRequest } from '../types/auth';
import { controllerWrapper } from '../utils/controllerWrapper';

export const createPenaltyController = controllerWrapper(async (req: TokenPayloadRequest) => {
    const result = await penaltyService.createPenalty(req.user, req.body);
    return { result };
});

export const getPenaltiesController = controllerWrapper(async (req: TokenPayloadRequest) => {
    const result = await penaltyService.getPenalties(req.user);
    return { result };
});

export const deletePenaltyController = controllerWrapper(async (req: any) => {
    const id = req.params.userId as string;
    const result = await penaltyService.deletePenalty(id);
    return { result };
});