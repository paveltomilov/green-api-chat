# Green API Chat (React)
Тестовое задание на позицию Frontend React Developer.
## Локальный запуск

1. Клонируйте репозиторий:
   git clone https://github.com/paveltomilov/green-api-chat.git
   cd green-api-react-chat

2. Установите зависимости:
   npm install

3. Запустите проект:
   npm run dev

4. Откройте http://localhost:5173 в браузере.

## Как тестировать

1. Войдите, используя idInstance и apiTokenInstance из личного кабинета GREEN-API.
2. Инстанс должен быть авторизован в WhatsApp (отсканирован QR-код).
3. Введите номер телефона получателя (например, 79991234567) и нажмите кнопку создания чата.
4. Отправьте сообщение и проверьте получение ответа с другого телефона.

## Реализованные требования

- Ввод idInstance и apiTokenInstance.
- Создание нового чата по номеру телефона.
- Отправка текстовых сообщений (sendMessage).
- Получение сообщений (receiveNotification через HTTP polling).
- Удаление уведомлений из очереди (deleteNotification).

## Ключевые архитектурные решения

1. Vite + React + TypeScript — быстрая сборка и строгая типизация.
2. Tailwind CSS — минималистичный UI в стиле мессенджера.
3. Кастомные хуки (useAuth, usePolling) — бизнес-логика отделена от UI.
4. HTTP Polling — цикл с receiveTimeout=5 и обязательным deleteNotification.
5. Прокси Vite — настроен для обхода CORS при прямых запросах к GREEN-API.
6. Оптимистичный UI — сообщение появляется мгновенно, при ошибке откатывается.
7. sessionStorage — хранение токенов в рамках сессии.

## Структура

src/
├── api/         # HTTP-клиент GREEN-API
├── context/     # AuthContext
├── hooks/       # useAuth, usePolling
├── pages/       # Login, Chat
├── types/       # TypeScript-интерфейсы
├── utils/       # Форматирование телефона
└── App.tsx
