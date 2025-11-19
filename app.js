// Основная логика приложения Telegram Bot Builder

class BotBuilder {
    constructor() {
        this.blocks = [];
        this.selectedBlock = null;
        this.blockIdCounter = 0;
        this.codeGenerator = new CodeGenerator();

        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupEventListeners();
        this.loadFromLocalStorage();
    }

    setupDragAndDrop() {
        const paletteItems = document.querySelectorAll('.block-item');
        const canvas = document.getElementById('canvas');

        // Обработчики для элементов палитры
        paletteItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('blockType', item.dataset.type);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
            });
        });

        // Обработчики для canvas
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
        });

        canvas.addEventListener('dragleave', (e) => {
            if (e.target === canvas) {
                canvas.classList.remove('drag-over');
            }
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');

            const blockType = e.dataTransfer.getData('blockType');
            if (blockType) {
                this.addBlock(blockType);
            }
        });
    }

    setupEventListeners() {
        // Кнопки управления
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProject());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadProject());
        document.getElementById('generateBtn').addEventListener('click', () => this.showCodeModal());

        // Вкладки
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Копирование кода
        document.getElementById('copyCodeBtn').addEventListener('click', () => {
            this.copyCode('generatedCode');
        });

        // Модальное окно
        const modal = document.getElementById('codeModal');
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.hideCodeModal());

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideCodeModal();
            }
        });

        // Переключение языка в модальном окне
        document.querySelectorAll('.code-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCodeLanguage(e.target.dataset.lang);
            });
        });

        // Кнопки в модальном окне
        document.getElementById('copyModalCodeBtn').addEventListener('click', () => {
            this.copyCode('modalCode');
        });

        document.getElementById('downloadCodeBtn').addEventListener('click', () => {
            this.downloadCode();
        });
    }

    addBlock(blockType) {
        const config = BLOCK_TYPES[blockType];
        if (!config) return;

        const blockId = this.blockIdCounter++;
        const block = {
            id: blockId,
            type: blockType,
            data: { ...config.defaultData }
        };

        this.blocks.push(block);
        this.renderCanvas();
        this.saveToLocalStorage();

        // Убираем placeholder если он есть
        const placeholder = document.querySelector('.canvas-placeholder');
        if (placeholder) placeholder.style.display = 'none';
    }

    removeBlock(blockId) {
        this.blocks = this.blocks.filter(b => b.id !== blockId);
        this.renderCanvas();
        this.saveToLocalStorage();

        if (this.selectedBlock && this.selectedBlock.id === blockId) {
            this.selectedBlock = null;
            this.renderProperties();
        }

        // Показываем placeholder если блоков нет
        if (this.blocks.length === 0) {
            const placeholder = document.querySelector('.canvas-placeholder');
            if (placeholder) placeholder.style.display = 'block';
        }
    }

    selectBlock(blockId) {
        this.selectedBlock = this.blocks.find(b => b.id === blockId);
        this.renderCanvas();
        this.renderProperties();
    }

    updateBlockData(blockId, newData) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) {
            block.data = { ...block.data, ...newData };
            this.renderCanvas();
            this.saveToLocalStorage();
        }
    }

    renderCanvas() {
        const canvas = document.getElementById('canvas');
        const blocksContainer = canvas.querySelector('.canvas-blocks') || this.createBlocksContainer();

        blocksContainer.innerHTML = '';

        this.blocks.forEach(block => {
            const blockElement = this.createBlockElement(block);
            blocksContainer.appendChild(blockElement);
        });
    }

    createBlocksContainer() {
        const canvas = document.getElementById('canvas');
        let container = canvas.querySelector('.canvas-blocks');

        if (!container) {
            container = document.createElement('div');
            container.className = 'canvas-blocks';
            canvas.appendChild(container);
        }

        return container;
    }

    createBlockElement(block) {
        const config = BLOCK_TYPES[block.type];
        const isSelected = this.selectedBlock && this.selectedBlock.id === block.id;

        const element = document.createElement('div');
        element.className = `canvas-block ${isSelected ? 'selected' : ''}`;
        element.dataset.blockId = block.id;

        element.innerHTML = `
            <div class="block-header">
                <div class="block-title">
                    <span class="block-icon">${config.icon}</span>
                    <span>${config.name}</span>
                </div>
                <div class="block-actions">
                    <button class="block-action-btn edit-btn" title="Редактировать">✏️</button>
                    <button class="block-action-btn delete-btn" title="Удалить">🗑️</button>
                </div>
            </div>
            <div class="block-content">
                ${this.renderBlockContent(block)}
            </div>
        `;

        // События
        element.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectBlock(block.id);
        });

        element.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Удалить этот блок?')) {
                this.removeBlock(block.id);
            }
        });

        element.addEventListener('click', () => {
            this.selectBlock(block.id);
        });

        return element;
    }

    renderBlockContent(block) {
        const config = BLOCK_TYPES[block.type];
        let content = `<p><strong>${config.description}</strong></p>`;

        // Показываем основные данные блока
        const data = block.data;
        const keys = Object.keys(data).slice(0, 2); // Первые 2 поля

        keys.forEach(key => {
            const value = data[key];
            if (typeof value === 'string' && value.length > 0) {
                const shortValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
                content += `<div><small><strong>${key}:</strong> ${shortValue}</small></div>`;
            }
        });

        return content;
    }

    renderProperties() {
        const container = document.getElementById('block-properties');

        if (!this.selectedBlock) {
            container.innerHTML = '<p class="no-selection">Выберите блок для редактирования свойств</p>';
            return;
        }

        const config = BLOCK_TYPES[this.selectedBlock.type];
        let html = `
            <h3>${config.icon} ${config.name}</h3>
            <p style="color: #718096; font-size: 0.9rem; margin-bottom: 1rem;">${config.description}</p>
        `;

        config.properties.forEach(prop => {
            html += this.renderProperty(prop, this.selectedBlock.data[prop.name]);
        });

        container.innerHTML = html;

        // Добавляем обработчики изменений
        this.attachPropertyHandlers();
    }

    renderProperty(prop, value) {
        let html = `<div class="property-group">`;
        html += `<label>${prop.label}</label>`;

        switch (prop.type) {
            case 'text':
            case 'number':
                html += `<input type="${prop.type}" name="${prop.name}" value="${value || ''}" placeholder="${prop.placeholder || ''}">`;
                break;

            case 'textarea':
                html += `<textarea name="${prop.name}" placeholder="${prop.placeholder || ''}">${value || ''}</textarea>`;
                break;

            case 'select':
                html += `<select name="${prop.name}">`;
                prop.options.forEach(opt => {
                    const selected = value === opt.value ? 'selected' : '';
                    html += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
                });
                html += `</select>`;
                break;

            case 'button-list':
                html += this.renderButtonList(value || []);
                break;
        }

        html += `</div>`;
        return html;
    }

    renderButtonList(buttons) {
        let html = '<div class="button-list">';

        buttons.forEach((btn, index) => {
            html += `
                <div class="button-item">
                    <input type="text" placeholder="Текст кнопки" value="${btn.text || ''}" data-btn-index="${index}" data-btn-field="text">
                    <input type="text" placeholder="Callback data" value="${btn.callback_data || ''}" data-btn-index="${index}" data-btn-field="callback_data">
                    <button class="delete-btn" data-btn-index="${index}">×</button>
                </div>
            `;
        });

        html += `<button class="add-btn" onclick="botBuilder.addButton()">+ Добавить кнопку</button>`;
        html += '</div>';

        return html;
    }

    attachPropertyHandlers() {
        const inputs = document.querySelectorAll('#block-properties input, #block-properties textarea, #block-properties select');

        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const name = e.target.name;
                const value = e.target.value;

                if (this.selectedBlock) {
                    this.updateBlockData(this.selectedBlock.id, { [name]: value });
                }
            });
        });

        // Обработчики для списка кнопок
        const buttonInputs = document.querySelectorAll('[data-btn-index]');
        buttonInputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.addEventListener('change', (e) => this.updateButton(e));
            } else if (input.tagName === 'BUTTON') {
                input.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.btnIndex);
                    this.removeButton(index);
                });
            }
        });
    }

    addButton() {
        if (!this.selectedBlock) return;

        const buttons = this.selectedBlock.data.buttons || [];
        buttons.push({ text: 'Новая кнопка', callback_data: 'new_btn' });

        this.updateBlockData(this.selectedBlock.id, { buttons });
        this.renderProperties();
    }

    removeButton(index) {
        if (!this.selectedBlock) return;

        const buttons = [...this.selectedBlock.data.buttons];
        buttons.splice(index, 1);

        this.updateBlockData(this.selectedBlock.id, { buttons });
        this.renderProperties();
    }

    updateButton(e) {
        if (!this.selectedBlock) return;

        const index = parseInt(e.target.dataset.btnIndex);
        const field = e.target.dataset.btnField;
        const value = e.target.value;

        const buttons = [...this.selectedBlock.data.buttons];
        buttons[index][field] = value;

        this.updateBlockData(this.selectedBlock.id, { buttons });
    }

    clearCanvas() {
        if (confirm('Очистить всё? Это действие нельзя отменить.')) {
            this.blocks = [];
            this.selectedBlock = null;
            this.renderCanvas();
            this.renderProperties();
            this.saveToLocalStorage();

            const placeholder = document.querySelector('.canvas-placeholder');
            if (placeholder) placeholder.style.display = 'block';
        }
    }

    saveProject() {
        const json = JSON.stringify(this.blocks, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'telegram-bot-project.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    loadProject() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.blocks = data;
                    this.blockIdCounter = Math.max(...data.map(b => b.id), 0) + 1;
                    this.renderCanvas();
                    this.saveToLocalStorage();

                    const placeholder = document.querySelector('.canvas-placeholder');
                    if (placeholder && this.blocks.length > 0) {
                        placeholder.style.display = 'none';
                    }

                    alert('Проект загружен!');
                } catch (error) {
                    alert('Ошибка при загрузке файла: ' + error.message);
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    switchTab(tabName) {
        // Переключаем кнопки
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Переключаем содержимое
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Если переключились на вкладку с кодом, генерируем код
        if (tabName === 'code') {
            this.generateCodePreview();
        }
    }

    generateCodePreview() {
        const codeType = document.querySelector('input[name="codeType"]:checked').value;
        const includeComments = document.getElementById('includeComments').checked;

        this.codeGenerator.includeComments = includeComments;

        let code;
        if (codeType === 'python') {
            code = this.codeGenerator.generatePythonCode(this.blocks);
        } else {
            code = this.codeGenerator.generateNodeJSCode(this.blocks);
        }

        document.getElementById('generatedCode').textContent = code;
    }

    showCodeModal() {
        const modal = document.getElementById('codeModal');
        modal.classList.add('show');

        // Генерируем код по умолчанию (Python)
        this.switchCodeLanguage('python');
    }

    hideCodeModal() {
        const modal = document.getElementById('codeModal');
        modal.classList.remove('show');
    }

    switchCodeLanguage(lang) {
        // Переключаем кнопки
        document.querySelectorAll('.code-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Генерируем код
        let code;
        if (lang === 'python') {
            code = this.codeGenerator.generatePythonCode(this.blocks);
        } else {
            code = this.codeGenerator.generateNodeJSCode(this.blocks);
        }

        document.getElementById('modalCode').textContent = code;
    }

    copyCode(elementId) {
        const code = document.getElementById(elementId).textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Код скопирован в буфер обмена!');
        });
    }

    downloadCode() {
        const lang = document.querySelector('.code-type-btn.active').dataset.lang;
        const code = document.getElementById('modalCode').textContent;

        const extension = lang === 'python' ? 'py' : 'js';
        const filename = `telegram_bot.${extension}`;

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    saveToLocalStorage() {
        localStorage.setItem('telegram-bot-blocks', JSON.stringify(this.blocks));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('telegram-bot-blocks');
        if (saved) {
            try {
                this.blocks = JSON.parse(saved);
                this.blockIdCounter = Math.max(...this.blocks.map(b => b.id), 0) + 1;
                this.renderCanvas();

                if (this.blocks.length > 0) {
                    const placeholder = document.querySelector('.canvas-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }
            } catch (error) {
                console.error('Ошибка загрузки из localStorage:', error);
            }
        }
    }
}

// Инициализация приложения
let botBuilder;
document.addEventListener('DOMContentLoaded', () => {
    botBuilder = new BotBuilder();
});
