 import React, { useState } from 'react';
 import SimpleReactValidator from 'simple-react-validator';
 interface RegistrationFormProps {
 onSubmit: (data: { login: string; email: string; password: string }) => void;
 }
 const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
 const [login, setLogin] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
  const [validator] = useState(new SimpleReactValidator());
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validator.allValid()) {
      onSubmit({ login, email, password });
      setSubmitted(true);
    } else {
      validator.showMessages();
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Login</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onBlur={() => validator.showMessageFor('login')}
        />
        {validator.message('login', login, 'required')}
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validator.showMessageFor('email')}
        />
        {validator.message('email', email, 'required|email')}
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validator.showMessageFor('password')}
        />
        {validator.message('password', password, 'required|min:8')}
      </div>
      <button type="submit" disabled={!validator.allValid()}>
        Register
      </button>
      {submitted && <p>Registration Successful!</p>}
    </form>
  );
 };
 export default RegistrationForm;

