 // Форма регистрации
import React, { useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { registerUser } from '../../api/Auth'; // Импортируем функцию registerUser

// Интерфейс для данных пользователя
interface UserData {
  login: string;
  email: string;
  password: string;
}

// Новый интерфейс пропсов (onSubmit больше не нужен)
interface RegistrationFormProps {
  onRegistrationSuccess?: (data: UserData) => void;
  onRegistrationError?: (error: string) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onRegistrationSuccess, 
  onRegistrationError 
}) => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validator] = useState(() => new SimpleReactValidator());
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Новые состояния для управления процессом регистрации
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForceUpdate(prev => prev + 1); // Принудительно обновляем перед проверкой
    
    // Проверяем валидацию
    if (!validator.allValid()) {
      validator.showMessages();
      setForceUpdate(prev => prev + 1); // Обновляем для показа сообщений
      return;
    }

    // Подготавливаем данные для регистрации
    const userData: UserData = { login, email, password };
    
    // Устанавливаем состояние загрузки
    setIsLoading(true);
    setRegistrationStatus('idle');
    setStatusMessage('');

    try {
      // Вызываем registerUser из Auth.ts
      const result = await registerUser(userData);
      
      if (result.success) {
        // Успешная регистрация
        setRegistrationStatus('success');
        setStatusMessage(result.message || 'Registration successful!');
        
        // Вызываем callback при успехе
        if (onRegistrationSuccess) {
          onRegistrationSuccess(userData);
        }
        
        // Очищаем форму после успешной регистрации
        setLogin('');
        setEmail('');
        setPassword('');
        validator.hideMessages();
        
      } else {
        // Ошибка регистрации
        setRegistrationStatus('error');
        setStatusMessage(result.message || 'Registration failed');
        
        // Вызываем callback при ошибке
        if (onRegistrationError) {
          onRegistrationError(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      // Обработка ошибок при вызове API
      console.error('Registration error:', error);
      setRegistrationStatus('error');
      setStatusMessage('An unexpected error occurred');
      
      // Вызываем callback при ошибке
      if (onRegistrationError) {
        onRegistrationError('An unexpected error occurred');
      }
    } finally {
      // Снимаем состояние загрузки
      setIsLoading(false);
      setForceUpdate(prev => prev + 1);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setForceUpdate(prev => prev + 1); // Обновляем при каждом изменении поля
  };

  const handleBlur = (field: string) => {
    validator.showMessageFor(field);
    setForceUpdate(prev => prev + 1); // Обновляем при потере фокуса
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="login-input">Login</label>
        <input
          id="login-input"
          data-testid="login-input"
          aria-required="true"
          type="text"
          value={login}
          onChange={(e) => handleInputChange(setLogin, e.target.value)}
          onBlur={() => handleBlur('login')}
          disabled={isLoading} // Блокируем поле во время загрузки
        />
        {validator.message('login', login, 'required')}
      </div>

      <div>
        <label htmlFor="email-input">Email</label>
        <input
          id="email-input"
          data-testid="email-input"
          aria-required="true"
          type="email"
          value={email}
          onChange={(e) => handleInputChange(setEmail, e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={isLoading} // Блокируем поле во время загрузки
        />
        {validator.message('email', email, 'required|email')}
      </div>

      <div>
        <label htmlFor="password-input">Password</label>
        <input
          id="password-input"
          data-testid="password-input"
          aria-required="true"
          type="password"
          value={password}
          onChange={(e) => handleInputChange(setPassword, e.target.value)}
          onBlur={() => handleBlur('password')}
          disabled={isLoading} // Блокируем поле во время загрузки
        />
        {validator.message('password', password, 'required|min:8')}
      </div>

      <button 
        type="submit" 
        data-testid="submit-button"
        disabled={isLoading} // Блокируем кнопку во время загрузки
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>

      {/* Отображение статуса регистрации */}
      {registrationStatus === 'success' && (
        <div data-testid="success-message" style={{ color: 'green', marginTop: '10px' }}>
          ✅ {statusMessage}
        </div>
      )}

      {registrationStatus === 'error' && (
        <div data-testid="error-message" style={{ color: 'red', marginTop: '10px' }}>
          ❌ {statusMessage}
        </div>
      )}

      {/* Валидационные сообщения */}
      {!validator.allValid() && (
        <div data-testid="validation-message" style={{ color: 'orange', marginTop: '10px' }}>
          ⚠ Please fix the validation errors
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;
