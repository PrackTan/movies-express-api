import * as yup from "yup";
// Login
export const loginSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(3).max(20).required(),
    }),
});
// Signup
export const signupSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(3).max(20).required(),
        birthday: yup.string().required(),
    }),
});
// Update Profile
export const updateUserSchema = yup.object({
    body: yup.object({
        name: yup.string(),
        photoURL: yup.string(),
        birthday: yup.string().required(),
    }),
});
