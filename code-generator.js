// Генератор кода для Telegram ботов

class CodeGenerator {
    constructor() {
        this.includeComments = true;
    }

    generatePythonCode(blocks) {
        let code = this.getPythonHeader();

        // Генерируем обработчики для каждого блока
        const handlers = [];
        const startBlocks = blocks.filter(b => ['start', 'command', 'message'].includes(b.type));

        startBlocks.forEach(block => {
            const handler = this.generatePythonHandler(block, blocks);
            if (handler) handlers.push(handler);
        });

        code += handlers.join('\n\n');
        code += this.getPythonFooter();

        return code;
    }

    generateNodeJSCode(blocks) {
        let code = this.getNodeJSHeader();

        // Генерируем обработчики для каждого блока
        const handlers = [];
        const startBlocks = blocks.filter(b => ['start', 'command', 'message'].includes(b.type));

        startBlocks.forEach(block => {
            const handler = this.generateNodeJSHandler(block, blocks);
            if (handler) handlers.push(handler);
        });

        code += handlers.join('\n\n');
        code += this.getNodeJSFooter();

        return code;
    }

    getPythonHeader() {
        return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Telegram Bot
Сгенерировано с помощью Telegram Bot Builder
"""

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters
import logging
import json
import asyncio

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Хранилище данных (в памяти)
user_data = {}

# Вставьте сюда ваш токен бота
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"

`;
    }

    getNodeJSHeader() {
        return `/**
 * Telegram Bot
 * Сгенерировано с помощью Telegram Bot Builder
 */

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Вставьте сюда ваш токен бота
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// Создаем бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Хранилище данных (в памяти)
const userData = {};

console.log('Бот запущен...');

`;
    }

    generatePythonHandler(block, allBlocks) {
        const blockIndex = allBlocks.indexOf(block);
        const nextBlocks = allBlocks.slice(blockIndex + 1);

        switch (block.type) {
            case 'start':
                return this.generatePythonStartHandler(block, nextBlocks);
            case 'command':
                return this.generatePythonCommandHandler(block, nextBlocks);
            case 'message':
                return this.generatePythonMessageHandler(block, nextBlocks);
            default:
                return '';
        }
    }

    generateNodeJSHandler(block, allBlocks) {
        const blockIndex = allBlocks.indexOf(block);
        const nextBlocks = allBlocks.slice(blockIndex + 1);

        switch (block.type) {
            case 'start':
                return this.generateNodeJSStartHandler(block, nextBlocks);
            case 'command':
                return this.generateNodeJSCommandHandler(block, nextBlocks);
            case 'message':
                return this.generateNodeJSMessageHandler(block, nextBlocks);
            default:
                return '';
        }
    }

    generatePythonStartHandler(block, nextBlocks) {
        const data = block.data;
        let code = `${this.comment('Обработчик команды ' + data.command)}
async def start_command(update: Update, context) -> None:
    """Обработчик команды ${data.command}"""
    user = update.effective_user
    chat_id = update.effective_chat.id

`;

        // Добавляем действия из следующих блоков
        const actions = this.generatePythonActions(nextBlocks, '    ');
        code += actions;

        if (!actions) {
            code += `    await update.message.reply_text(
        "${data.welcomeMessage || 'Привет!'}"
    )\n`;
        }

        code += '\n';
        return code;
    }

    generateNodeJSStartHandler(block, nextBlocks) {
        const data = block.data;
        let code = `${this.comment('Обработчик команды ' + data.command)}
bot.onText(/\\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;

`;

        // Добавляем действия из следующих блоков
        const actions = this.generateNodeJSActions(nextBlocks, '    ');
        code += actions;

        if (!actions) {
            code += `    await bot.sendMessage(chatId, "${data.welcomeMessage || 'Привет!'}");\n`;
        }

        code += '});\n';
        return code;
    }

    generatePythonCommandHandler(block, nextBlocks) {
        const data = block.data;
        const cmdName = data.command.replace('/', '');

        let code = `${this.comment('Обработчик команды ' + data.command)}
async def ${cmdName}_command(update: Update, context) -> None:
    """${data.description || 'Обработчик команды ' + data.command}"""
    chat_id = update.effective_chat.id

`;

        const actions = this.generatePythonActions(nextBlocks, '    ');
        code += actions || `    await update.message.reply_text("Выполнена команда ${data.command}")\n`;

        code += '\n';
        return code;
    }

    generateNodeJSCommandHandler(block, nextBlocks) {
        const data = block.data;
        const pattern = data.command.replace('/', '\\/');

        let code = `${this.comment('Обработчик команды ' + data.command)}
bot.onText(/${pattern}/, async (msg) => {
    const chatId = msg.chat.id;

`;

        const actions = this.generateNodeJSActions(nextBlocks, '    ');
        code += actions || `    await bot.sendMessage(chatId, "Выполнена команда ${data.command}");\n`;

        code += '});\n';
        return code;
    }

    generatePythonMessageHandler(block, nextBlocks) {
        const data = block.data;

        let code = `${this.comment('Обработчик текстовых сообщений')}
async def handle_message(update: Update, context) -> None:
    """Обработчик текстовых сообщений"""
    chat_id = update.effective_chat.id
    text = update.message.text

`;

        if (data.pattern) {
            code += `    # Проверка шаблона
    if "${data.pattern}" in text.lower():
`;
            const actions = this.generatePythonActions(nextBlocks, '        ');
            code += actions || `        await update.message.reply_text("Сообщение принято")\n`;
        } else {
            const actions = this.generatePythonActions(nextBlocks, '    ');
            code += actions || `    await update.message.reply_text("Получено: " + text)\n`;
        }

        code += '\n';
        return code;
    }

    generateNodeJSMessageHandler(block, nextBlocks) {
        const data = block.data;

        let code = `${this.comment('Обработчик текстовых сообщений')}
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith('/')) return;

`;

        if (data.pattern) {
            code += `    // Проверка шаблона
    if (text.toLowerCase().includes("${data.pattern}")) {
`;
            const actions = this.generateNodeJSActions(nextBlocks, '        ');
            code += actions || `        await bot.sendMessage(chatId, "Сообщение принято");\n`;
            code += '    }\n';
        } else {
            const actions = this.generateNodeJSActions(nextBlocks, '    ');
            code += actions || `    await bot.sendMessage(chatId, "Получено: " + text);\n`;
        }

        code += '});\n';
        return code;
    }

    generatePythonActions(blocks, indent) {
        let code = '';

        for (const block of blocks) {
            // Останавливаемся на следующем обработчике
            if (['start', 'command', 'message'].includes(block.type)) break;

            const action = this.generatePythonAction(block, indent);
            if (action) code += action;
        }

        return code;
    }

    generateNodeJSActions(blocks, indent) {
        let code = '';

        for (const block of blocks) {
            // Останавливаемся на следующем обработчике
            if (['start', 'command', 'message'].includes(block.type)) break;

            const action = this.generateNodeJSAction(block, indent);
            if (action) code += action;
        }

        return code;
    }

    generatePythonAction(block, indent) {
        const data = block.data;

        switch (block.type) {
            case 'send_text':
                const parseMode = data.parseMode ? `, parse_mode='${data.parseMode}'` : '';
                return `${indent}await update.message.reply_text(\n${indent}    "${data.text}"${parseMode}\n${indent})\n`;

            case 'send_photo':
                const caption = data.caption ? `, caption="${data.caption}"` : '';
                return `${indent}await update.message.reply_photo(\n${indent}    photo="${data.photoUrl}"${caption}\n${indent})\n`;

            case 'send_buttons':
                if (data.buttonType === 'inline') {
                    const buttons = data.buttons.map(btn =>
                        `[InlineKeyboardButton("${btn.text}", callback_data="${btn.callback_data}")]`
                    ).join(',\n' + indent + '        ');

                    return `${indent}keyboard = [\n${indent}        ${buttons}\n${indent}    ]
${indent}reply_markup = InlineKeyboardMarkup(keyboard)
${indent}await update.message.reply_text(
${indent}    "${data.text}",
${indent}    reply_markup=reply_markup
${indent})\n`;
                } else {
                    const buttons = data.buttons.map(btn => `["${btn.text}"]`).join(',\n' + indent + '        ');
                    return `${indent}keyboard = [\n${indent}        ${buttons}\n${indent}    ]
${indent}reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
${indent}await update.message.reply_text(
${indent}    "${data.text}",
${indent}    reply_markup=reply_markup
${indent})\n`;
                }

            case 'delay':
                const delayMs = data.unit === 's' ? data.delay * 1000 : data.delay;
                return `${indent}await asyncio.sleep(${delayMs / 1000})\n`;

            case 'variable':
                if (data.operation === 'set') {
                    return `${indent}user_data["${data.varName}"] = "${data.varValue}"\n`;
                } else if (data.operation === 'get') {
                    return `${indent}value = user_data.get("${data.varName}", "")\n`;
                }
                return '';

            case 'save_data':
                if (data.storage === 'file') {
                    return `${indent}with open('bot_data.json', 'w') as f:
${indent}    json.dump(user_data, f)\n`;
                }
                return `${indent}user_data["${data.dataKey}"] = "${data.dataValue}"\n`;

            default:
                return '';
        }
    }

    generateNodeJSAction(block, indent) {
        const data = block.data;

        switch (block.type) {
            case 'send_text':
                const parseMode = data.parseMode ? `, { parse_mode: '${data.parseMode}' }` : '';
                return `${indent}await bot.sendMessage(chatId, "${data.text}"${parseMode});\n`;

            case 'send_photo':
                const options = data.caption ? `, { caption: "${data.caption}" }` : '';
                return `${indent}await bot.sendPhoto(chatId, "${data.photoUrl}"${options});\n`;

            case 'send_buttons':
                if (data.buttonType === 'inline') {
                    const buttons = data.buttons.map(btn =>
                        `[{ text: "${btn.text}", callback_data: "${btn.callback_data}" }]`
                    ).join(',\n' + indent + '        ');

                    return `${indent}const keyboard = [\n${indent}        ${buttons}\n${indent}    ];
${indent}await bot.sendMessage(chatId, "${data.text}", {
${indent}    reply_markup: { inline_keyboard: keyboard }
${indent}});\n`;
                } else {
                    const buttons = data.buttons.map(btn => `["${btn.text}"]`).join(',\n' + indent + '        ');
                    return `${indent}const keyboard = [\n${indent}        ${buttons}\n${indent}    ];
${indent}await bot.sendMessage(chatId, "${data.text}", {
${indent}    reply_markup: { keyboard: keyboard, resize_keyboard: true }
${indent}});\n`;
                }

            case 'delay':
                const delayMs = data.unit === 's' ? data.delay * 1000 : data.delay;
                return `${indent}await new Promise(resolve => setTimeout(resolve, ${delayMs}));\n`;

            case 'variable':
                if (data.operation === 'set') {
                    return `${indent}userData["${data.varName}"] = "${data.varValue}";\n`;
                } else if (data.operation === 'get') {
                    return `${indent}const value = userData["${data.varName}"] || "";\n`;
                }
                return '';

            case 'save_data':
                if (data.storage === 'file') {
                    return `${indent}fs.writeFileSync('bot_data.json', JSON.stringify(userData, null, 2));\n`;
                }
                return `${indent}userData["${data.dataKey}"] = "${data.dataValue}";\n`;

            default:
                return '';
        }
    }

    getPythonFooter() {
        return `
# Обработчик callback запросов
async def button_callback(update: Update, context) -> None:
    """Обработчик нажатий на inline кнопки"""
    query = update.callback_query
    await query.answer()

    # Здесь обрабатывайте callback_data
    data = query.data
    await query.edit_message_text(text=f"Вы выбрали: {data}")

def main() -> None:
    """Запуск бота"""
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()

    # Регистрируем обработчики команд
    application.add_handler(CommandHandler("start", start_command))

    # Обработчик callback запросов
    application.add_handler(CallbackQueryHandler(button_callback))

    # Обработчик текстовых сообщений
    # application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Запускаем бота
    logger.info("Бот запущен!")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
`;
    }

    getNodeJSFooter() {
        return `
// Обработчик callback запросов
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Отвечаем на callback запрос
    await bot.answerCallbackQuery(query.id);

    // Здесь обрабатывайте callback_data
    await bot.sendMessage(chatId, \`Вы выбрали: \${data}\`);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

console.log('Бот успешно запущен!');
`;
    }

    comment(text) {
        if (!this.includeComments) return '';
        return `# ${text}\n`;
    }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CodeGenerator };
}
