// Интерфейс данных пользователя для регистрации
interface UserData {
login: string;
email: string;
password: string;
}

// Интерфейс данных зарегистрированного пользователя
interface RegisteredUser {
id: string;
login: string;
email: string;
token: string;
}

// Интерфейс ответа от API
interface AuthResponse {
success: boolean;
message: string;
data?: RegisteredUser;
}

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
