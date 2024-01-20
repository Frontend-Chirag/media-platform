import * as zod from 'zod';

export const editValidation = zod.object({
    name: zod.string().min(6, { message: 'name should be minimum 6 character long' }),
    username: zod.string().min(6, { message: 'name should be minimum 6 character long' }),
    bio: zod.string(),
    gender: zod.string(),
    profilePicture: zod.any()

})