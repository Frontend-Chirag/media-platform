import { User } from "@/Schemas/userSchema";

// Function to generate access and refresh tokens for a given user ID
export const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        // Find the user in the database using the provided user ID
        const user = await User.findById(userId);

        // If the user is not found, throw an error
        if (!user) throw new Error('User not found in generateAccessAndRefreshToken');

        // Generate an access token and a refresh token for the user
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Assign the refresh token to the user's refreshToken field
        user.refreshToken = refreshToken;

        // Log the generated refresh token for debugging purposes
        console.log('User RefreshToken generated', user.refreshToken);

        // Save the user with the new refresh token (skip validation before saving)
        await user.save({ validateBeforeSave: false });

        // Return the generated access and refresh tokens
        return { accessToken, refreshToken };
    } catch (error: any) {
        // Log an error message if token generation fails
        console.log('Failed to generate accessToken and refreshToken');
        throw new Error(error.message);
    }
};
