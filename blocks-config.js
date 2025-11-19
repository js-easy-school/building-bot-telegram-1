// Конфигурация блоков для визуального редактора

const BLOCK_TYPES = {
    start: {
        name: 'Старт бота',
        icon: '▶️',
        category: 'basic',
        description: 'Обработчик команды /start',
        defaultData: {
            command: '/start',
            welcomeMessage: 'Привет! Я бот. Чем могу помочь?'
        },
        properties: [
            {
                name: 'command',
                label: 'Команда',
                type: 'text',
                placeholder: '/start'
            },
            {
                name: 'welcomeMessage',
                label: 'Приветственное сообщение',
                type: 'textarea',
                placeholder: 'Введите текст приветствия'
            }
        ]
    },

    command: {
        name: 'Команда',
        icon: '⚡',
        category: 'basic',
        description: 'Обработчик произвольной команды',
        defaultData: {
            command: '/help',
            description: 'Показать помощь'
        },
        properties: [
            {
                name: 'command',
                label: 'Команда',
                type: 'text',
                placeholder: '/help'
            },
            {
                name: 'description',
                label: 'Описание команды',
                type: 'textarea',
                placeholder: 'Что делает эта команда?'
            }
        ]
    },

    message: {
        name: 'Сообщение',
        icon: '💬',
        category: 'basic',
        description: 'Обработчик текстовых сообщений',
        defaultData: {
            messageType: 'text',
            pattern: ''
        },
        properties: [
            {
                name: 'messageType',
                label: 'Тип сообщения',
                type: 'select',
                options: [
                    { value: 'text', label: 'Текст' },
                    { value: 'photo', label: 'Фото' },
                    { value: 'video', label: 'Видео' },
                    { value: 'document', label: 'Документ' }
                ]
            },
            {
                name: 'pattern',
                label: 'Шаблон (необязательно)',
                type: 'text',
                placeholder: 'Регулярное выражение или текст'
            }
        ]
    },

    send_text: {
        name: 'Отправить текст',
        icon: '📤',
        category: 'response',
        description: 'Отправить текстовое сообщение пользователю',
        defaultData: {
            text: 'Ваше сообщение здесь',
            parseMode: 'HTML'
        },
        properties: [
            {
                name: 'text',
                label: 'Текст сообщения',
                type: 'textarea',
                placeholder: 'Введите текст сообщения'
            },
            {
                name: 'parseMode',
                label: 'Режим форматирования',
                type: 'select',
                options: [
                    { value: 'HTML', label: 'HTML' },
                    { value: 'Markdown', label: 'Markdown' },
                    { value: '', label: 'Без форматирования' }
                ]
            }
        ]
    },

    send_photo: {
        name: 'Отправить фото',
        icon: '🖼️',
        category: 'response',
        description: 'Отправить фотографию',
        defaultData: {
            photoUrl: '',
            caption: ''
        },
        properties: [
            {
                name: 'photoUrl',
                label: 'URL фотографии или file_id',
                type: 'text',
                placeholder: 'https://example.com/photo.jpg'
            },
            {
                name: 'caption',
                label: 'Подпись (необязательно)',
                type: 'textarea',
                placeholder: 'Подпись к фото'
            }
        ]
    },

    send_buttons: {
        name: 'Кнопки',
        icon: '🔘',
        category: 'response',
        description: 'Отправить сообщение с кнопками',
        defaultData: {
            text: 'Выберите действие:',
            buttons: [
                { text: 'Кнопка 1', callback_data: 'btn1' },
                { text: 'Кнопка 2', callback_data: 'btn2' }
            ],
            buttonType: 'inline'
        },
        properties: [
            {
                name: 'text',
                label: 'Текст сообщения',
                type: 'textarea',
                placeholder: 'Введите текст'
            },
            {
                name: 'buttonType',
                label: 'Тип кнопок',
                type: 'select',
                options: [
                    { value: 'inline', label: 'Inline (под сообщением)' },
                    { value: 'reply', label: 'Reply (клавиатура)' }
                ]
            },
            {
                name: 'buttons',
                label: 'Кнопки',
                type: 'button-list'
            }
        ]
    },

    condition: {
        name: 'Условие',
        icon: '❓',
        category: 'logic',
        description: 'Условное ветвление',
        defaultData: {
            conditionType: 'text_equals',
            value: '',
            operator: '=='
        },
        properties: [
            {
                name: 'conditionType',
                label: 'Тип условия',
                type: 'select',
                options: [
                    { value: 'text_equals', label: 'Текст равен' },
                    { value: 'text_contains', label: 'Текст содержит' },
                    { value: 'callback_data', label: 'Callback данные' },
                    { value: 'user_id', label: 'ID пользователя' },
                    { value: 'custom', label: 'Произвольное условие' }
                ]
            },
            {
                name: 'value',
                label: 'Значение для сравнения',
                type: 'text',
                placeholder: 'Введите значение'
            },
            {
                name: 'operator',
                label: 'Оператор',
                type: 'select',
                options: [
                    { value: '==', label: 'Равно (==)' },
                    { value: '!=', label: 'Не равно (!=)' },
                    { value: 'in', label: 'Содержит (in)' },
                    { value: '>', label: 'Больше (>)' },
                    { value: '<', label: 'Меньше (<)' }
                ]
            }
        ]
    },

    variable: {
        name: 'Переменная',
        icon: '📦',
        category: 'logic',
        description: 'Сохранить или изменить переменную',
        defaultData: {
            varName: 'my_var',
            varValue: '',
            operation: 'set'
        },
        properties: [
            {
                name: 'varName',
                label: 'Имя переменной',
                type: 'text',
                placeholder: 'my_variable'
            },
            {
                name: 'operation',
                label: 'Операция',
                type: 'select',
                options: [
                    { value: 'set', label: 'Установить значение' },
                    { value: 'get', label: 'Получить значение' },
                    { value: 'increment', label: 'Увеличить на 1' },
                    { value: 'decrement', label: 'Уменьшить на 1' }
                ]
            },
            {
                name: 'varValue',
                label: 'Значение',
                type: 'text',
                placeholder: 'Значение переменной'
            }
        ]
    },

    delay: {
        name: 'Задержка',
        icon: '⏱️',
        category: 'logic',
        description: 'Задержка перед следующим действием',
        defaultData: {
            delay: 1000,
            unit: 'ms'
        },
        properties: [
            {
                name: 'delay',
                label: 'Длительность',
                type: 'number',
                placeholder: '1000'
            },
            {
                name: 'unit',
                label: 'Единица измерения',
                type: 'select',
                options: [
                    { value: 'ms', label: 'Миллисекунды' },
                    { value: 's', label: 'Секунды' }
                ]
            }
        ]
    },

    save_data: {
        name: 'Сохранить данные',
        icon: '💾',
        category: 'data',
        description: 'Сохранить данные в базу/файл',
        defaultData: {
            dataKey: 'user_data',
            dataValue: '',
            storage: 'memory'
        },
        properties: [
            {
                name: 'storage',
                label: 'Тип хранилища',
                type: 'select',
                options: [
                    { value: 'memory', label: 'Память (временно)' },
                    { value: 'file', label: 'Файл (JSON)' },
                    { value: 'database', label: 'База данных' }
                ]
            },
            {
                name: 'dataKey',
                label: 'Ключ',
                type: 'text',
                placeholder: 'user_data'
            },
            {
                name: 'dataValue',
                label: 'Значение',
                type: 'textarea',
                placeholder: 'Данные для сохранения'
            }
        ]
    },

    load_data: {
        name: 'Загрузить данные',
        icon: '📂',
        category: 'data',
        description: 'Загрузить данные из базы/файла',
        defaultData: {
            dataKey: 'user_data',
            storage: 'memory'
        },
        properties: [
            {
                name: 'storage',
                label: 'Тип хранилища',
                type: 'select',
                options: [
                    { value: 'memory', label: 'Память (временно)' },
                    { value: 'file', label: 'Файл (JSON)' },
                    { value: 'database', label: 'База данных' }
                ]
            },
            {
                name: 'dataKey',
                label: 'Ключ',
                type: 'text',
                placeholder: 'user_data'
            }
        ]
    },

    api_request: {
        name: 'API запрос',
        icon: '🔌',
        category: 'api',
        description: 'Выполнить HTTP запрос к API',
        defaultData: {
            url: '',
            method: 'GET',
            headers: '',
            body: ''
        },
        properties: [
            {
                name: 'url',
                label: 'URL',
                type: 'text',
                placeholder: 'https://api.example.com/endpoint'
            },
            {
                name: 'method',
                label: 'Метод',
                type: 'select',
                options: [
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'DELETE', label: 'DELETE' }
                ]
            },
            {
                name: 'headers',
                label: 'Заголовки (JSON)',
                type: 'textarea',
                placeholder: '{"Content-Type": "application/json"}'
            },
            {
                name: 'body',
                label: 'Тело запроса (JSON)',
                type: 'textarea',
                placeholder: '{"key": "value"}'
            }
        ]
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BLOCK_TYPES };
}
