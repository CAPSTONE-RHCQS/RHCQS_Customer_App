import { API_ROOT } from '../../utils/constants';

export const registerUser = async (email: string, password: string, confirmPassword: string, phoneNumber: string) => {
    const response = await fetch(`${API_ROOT}/register?role=Customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword, phoneNumber }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.Error);
    }

    return response.json();
};

