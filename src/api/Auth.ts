


export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Имитация проверки существующего email
      if (userData.email === 'existing@example.com') {
        resolve({
          success: false,
          message: 'Email is already registered'
        });
        return;
      }

      // Успешная регистрация
      resolve({
        success: true,
        message: 'Registration successful!',
        data: {
          id: Math.random().toString(36).substr(2, 9),
          login: userData.login,
          email: userData.email,
          token: 'mock-jwt-token-' + Date.now()
        }
      });
    }, 1500);
  });
};
