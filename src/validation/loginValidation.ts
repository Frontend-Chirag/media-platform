import * as zod from 'zod';

export const LoginValidation = zod.object({
    email: zod.string().email({ message: 'Please enter a valid email' }),
    password: zod.string().min(6, { message: 'Incorrect password ' }),
})