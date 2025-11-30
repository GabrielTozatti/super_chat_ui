import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        await register(formData.username, formData.email, formData.password);
        setIsLogin(true)
      }
    } catch (err: any) {
      const data = err.response?.data;

      if (data?.errors) {
        const formatted: Record<string, string> = {};

        data.errors.forEach((e: any) => {
          formatted[e.field] = e.message;
        });

        setErrors(formatted);
        return;
      }

      if (data?.message) setErrors({ general: data.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-indigo-600 to-purple-600 bg-cover bg-center">
      <div className="relative w-full max-w-[480px] bg-[#313338] p-8 rounded-md shadow-2xl animate-fade-in-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Boas-vindas de volta!' : 'Criar uma conta'}
          </h2>
          <p className="text-[#B5BAC1] text-sm">
            {isLogin
              ? 'Estamos muito animados em te ver novamente!'
              : 'Vamos começar sua jornada!'}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="text-[#C96A6A] text-xs mb-4">
              {errors.general}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-[#B5BAC1] text-xs font-bold uppercase mb-2">
              E-mail <span className="text-[#C96A6A]">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-[#1E1F22] text-white p-2.5 rounded border-none outline-none focus:ring-0 h-10 font-normal"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-[#C96A6A] text-[9px] mt-1">{errors.email}</p>
            )}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-[#B5BAC1] text-xs font-bold uppercase mb-2">
                Nome de Usuário <span className="text-[#C96A6A]">*</span>
              </label>
              <input
                name="username"
                type="text"
                required={isLogin}
                className="w-full bg-[#1E1F22] text-white p-2.5 rounded border-none outline-none focus:ring-0 h-10 font-normal"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-[#C96A6A] text-[9px] mt-1">{errors.name}</p>
              )}
            </div>
          )}
          <div className="mb-6">
            <label className="block text-[#B5BAC1] text-xs font-bold uppercase mb-2">
              Senha <span className="text-[#C96A6A]">*</span>
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-[#1E1F22] text-white p-2.5 rounded border-none outline-none focus:ring-0 h-10 font-normal"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-[#C96A6A] text-[9px] mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2.5 rounded transition-colors duration-200 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Continuar')}
          </button>
          <div className="mt-4 text-sm text-[#949BA4]">
            {isLogin ? (
              <>
                Precisa de uma conta?{' '}
                <button
                  type="button"
                  onClick={() => { setErrors({}); setIsLogin(false); }}
                  className="text-[#5865F2] hover:underline font-normal cursor-pointer"
                >
                  Registre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => { setErrors({}); setIsLogin(true); }}
                  className="text-[#5865F2] hover:underline font-normal cursor-pointer"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;