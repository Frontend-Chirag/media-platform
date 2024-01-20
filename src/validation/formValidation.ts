import * as zod from 'zod';

export const formValidation = zod.object({
    name: zod.string().min(2, { message: 'Name must be at least 2 characters long' }),
    username: zod.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: zod.string().email({ message: 'Please enter a valid email' }),
    password: zod.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
