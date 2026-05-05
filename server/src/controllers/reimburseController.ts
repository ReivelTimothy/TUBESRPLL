import * as reimburseService from '../services/reimburseService';
import { controllerWrapper } from '../utils/controllerWrapper';
import { TokenPayloadRequest } from '../types/auth';

export const requestReimburse = controllerWrapper(async (req: TokenPayloadRequest) => {
    const receiptFile = (req as any).file as Express.Multer.File | undefined;
    const payload = {
        amount: Number(req.body.amount),
        description: req.body.description,
        attachmentUrl: receiptFile ? `/uploads/reimbursements/${receiptFile.filename}` : undefined
    };

    const result = await reimburseService.requestReimburse(req.user.userId, payload);
    return { result };
});

export const getReimburses = controllerWrapper(async (req: TokenPayloadRequest) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = await reimburseService.getReimburseRequests(req.user, baseUrl);
    return { result };
});

export const processReimburse = controllerWrapper(async (req: TokenPayloadRequest) => {
    const id = req.params.id as string;
    const result = await reimburseService.processReimburse(id, req.user, req.body);
    return { result };
});