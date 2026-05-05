
import * as leaveService from '../services/leaveService';
import { controllerWrapper } from '../utils/controllerWrapper';
import { TokenPayload, TokenPayloadRequest } from '../types/auth';

export const requestLeaveController = controllerWrapper(async (req: TokenPayloadRequest) => {
    const result = await leaveService.requestLeave(req.user.userId, req.body);
    return { result };
});
export const getLeaveRequestsController = controllerWrapper(async (req: TokenPayloadRequest) => {
    const result = await leaveService.getLeaveRequests(req.user);
    return { result };
});

export const getCalendarController = controllerWrapper(async () => {
    const result = await leaveService.getCalendarView();
    return { result };
});

export const processLeaveController = controllerWrapper(async (req: TokenPayloadRequest) => {
    const id  = req.params.id as string;
    const result = await leaveService.processLeave(id, req.user, req.body);
    return { result };
});