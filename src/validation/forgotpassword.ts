import * as zod from 'zod';

export const forgotPasswordSchema = zod.object({
    email: zod.string().email({ message: 'Invalid email address' }),
    
})