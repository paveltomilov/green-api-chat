import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      setError('Пожалуйста, заполните оба поля.');
      return;
    }

    login({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() });
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-3">
            <LogIn className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Вход в Green API Chat</h1>
          <p className="text-sm text-gray-500 mt-1">
            Введите данные вашего инстанса
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="idInstance" className="block text-sm font-medium text-gray-700 mb-1">
              idInstance
            </label>
            <input
              id="idInstance"
              type="text"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              placeholder="1101000001"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="apiTokenInstance" className="block text-sm font-medium text-gray-700 mb-1">
              apiTokenInstance
            </label>
            <input
              id="apiTokenInstance"
              type="password"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            Войти
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Данные хранятся в <code>sessionStorage</code> и удаляются при закрытии вкладки.
        </p>
      </div>
    </div>
  );
};