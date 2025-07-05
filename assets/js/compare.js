$(document).ready(function() {
    // Текущие позиции для каждой колонки (0, 1, 2)
    let currentPositions = [0, 1, 2];
    const maxProducts = 3;
    
    // Массив для хранения данных товаров, прочитанных из HTML
    let productsData = [];
    
    // Массив для хранения изображений и статусов товаров
    let productsImages = [];
    let productsStatuses = [];
    
    // Флаг для показа только различий
    let showOnlyDifferences = false;
    
    // Переменные для обработки свайпов
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Минимальное расстояние для свайпа

    // Проверка существования необходимых элементов
    function validateElements() {
        const requiredElements = [
            '.modal-compare__item',
            '.modal-compare__row',
            '.modal-compare__toggle'
        ];
        
        for (const selector of requiredElements) {
            if ($(selector).length === 0) {
                return false;
            }
        }
        
        return true;
    }

    // Чтение данных из HTML при инициализации
    function readProductsFromHTML() {
        // Читаем данные из строк таблицы
        const characteristics = [];
        
        // Собираем названия характеристик
        $('.modal-compare__row').each(function() {
            const nameElement = $(this).find('.modal-compare__name');
            if (nameElement.length > 0) {
                const name = nameElement.text();
                characteristics.push(name);
            }
        });
        
        if (characteristics.length === 0) {
            return false;
        }
        
        // Читаем данные для каждого товара (колонки 0, 1, 2)
        for (let productIndex = 0; productIndex < maxProducts; productIndex++) {
            const product = {};
            
            $('.modal-compare__row').each(function() {
                const nameElement = $(this).find('.modal-compare__name');
                const valueElement = $(this).find('.modal-compare__value').eq(productIndex);
                
                if (nameElement.length > 0 && valueElement.length > 0) {
                    const name = nameElement.text();
                    const value = valueElement.html(); // Сохраняем HTML вместо текста
                    product[name] = value;
                }
            });
            
            productsData.push(product);
        }
        
        // Читаем изображения и статусы из HTML
        $('.modal-compare__item').each(function(index) {
            const imageElement = $(this).find('.modal-compare__image img');
            const statusElement = $(this).find('.modal-compare__status');
            
            if (imageElement.length === 0) {
                console.error(`Не найдено изображение для товара ${index}`);
                productsImages.push('');
            } else {
                productsImages.push(imageElement.attr('src'));
            }
            
            if (statusElement.length === 0) {
                console.error(`Не найден статус для товара ${index}`);
                productsStatuses.push({
                    class: 'none',
                    text: 'Нет данных'
                });
            } else {
                const statusClass = statusElement.attr('class')?.split(' ').find(cls => ['pre', 'none', 'avail'].includes(cls)) || 'none';
                const statusText = statusElement.text();
                productsStatuses.push({
                    class: statusClass,
                    text: statusText
                });
            }
        });
        
        return true;
    }

    // Обработчик для кнопки "вперед"
    $(document).on('click', '.modal-compare__nav-next', function() {
        // Находим родительский элемент modal-compare__item
        const item = $(this).closest('.modal-compare__item');
        if (item.length === 0) {
            return;
        }
        
        // Находим его позицию среди всех modal-compare__item
        const columnIndex = $('.modal-compare__item').index(item);
        if (columnIndex === -1) {
            return;
        }
        
        if (currentPositions[columnIndex] < maxProducts - 1) {
            currentPositions[columnIndex]++;
            updateColumn(columnIndex);
        }
    });

    // Обработчик для кнопки "назад"
    $(document).on('click', '.modal-compare__nav-prev', function() {
        // Находим родительский элемент modal-compare__item
        const item = $(this).closest('.modal-compare__item');
        if (item.length === 0) {
            return;
        }
        
        // Находим его позицию среди всех modal-compare__item
        const columnIndex = $('.modal-compare__item').index(item);
        if (columnIndex === -1) {
            return;
        }
        
        if (currentPositions[columnIndex] > 0) {
            currentPositions[columnIndex]--;
            updateColumn(columnIndex);
        }
    });

    // Обработчик для переключателя "Только различия"
    $(document).on('change', '.modal-compare__toggle .toggle__checkbox', function() {
        showOnlyDifferences = $(this).is(':checked');
        updateDifferencesVisibility();
    });

    // Обработчики свайпов для мобильных устройств
    $(document).on('touchstart', '.modal-compare__item', function(e) {
        const touch = e.originalEvent.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });

    $(document).on('touchend', '.modal-compare__item', function(e) {
        const touch = e.originalEvent.changedTouches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
        
        handleSwipe($(this));
    });

    // Обработка свайпа
    function handleSwipe(item) {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Проверяем, что свайп был горизонтальным (больше горизонтального движения)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            const columnIndex = $('.modal-compare__item').index(item);
            
            if (columnIndex === -1) {
                return;
            }
            
            if (deltaX > 0) {
                // Свайп вправо - предыдущий товар
                if (currentPositions[columnIndex] > 0) {
                    currentPositions[columnIndex]--;
                    updateColumn(columnIndex);
                }
            } else {
                // Свайп влево - следующий товар
                if (currentPositions[columnIndex] < maxProducts - 1) {
                    currentPositions[columnIndex]++;
                    updateColumn(columnIndex);
                }
            }
        }
    }

    // Обновление одной колонки
    function updateColumn(columnIndex) {
        if (columnIndex < 0 || columnIndex >= currentPositions.length) {
            return;
        }
        
        const newPosition = currentPositions[columnIndex];
        if (newPosition < 0 || newPosition >= maxProducts) {
            return;
        }
        
        const item = $('.modal-compare__item').eq(columnIndex);
        if (item.length === 0) {
            return;
        }
        
        // Обновляем изображение из прочитанных данных
        if (productsImages[newPosition]) {
            const imageElement = item.find('.modal-compare__image img');
            if (imageElement.length > 0) {
                imageElement.attr('src', productsImages[newPosition]);
            }
        }
        
        // Обновляем статус из прочитанных данных
        if (productsStatuses[newPosition]) {
            const statusEl = item.find('.modal-compare__status');
            if (statusEl.length > 0) {
                statusEl.removeClass('pre none avail').addClass(productsStatuses[newPosition].class);
                statusEl.text(productsStatuses[newPosition].text);
            }
        }
        
        // Обновляем счетчик
        const pagesElement = item.find('.modal-compare__pages');
        if (pagesElement.length > 0) {
            pagesElement.text(`${newPosition + 1} из ${maxProducts}`);
        }
        
        // Обновляем кнопки навигации
        const prevBtn = item.find('.modal-compare__nav-prev');
        const nextBtn = item.find('.modal-compare__nav-next');
        
        if (prevBtn.length > 0) {
            prevBtn.prop('disabled', newPosition === 0);
        }
        if (nextBtn.length > 0) {
            nextBtn.prop('disabled', newPosition === maxProducts - 1);
        }
        
        // Обновляем данные в таблице
        updateTableData(columnIndex, newPosition);
    }

    // Обновление данных в таблице для конкретной колонки
    function updateTableData(columnIndex, productIndex) {
        if (!productsData[productIndex]) {
            return;
        }
        
        const product = productsData[productIndex];
        
        // Обновляем каждую строку в таблице
        $('.modal-compare__row').each(function() {
            const nameElement = $(this).find('.modal-compare__name');
            const valueCell = $(this).find('.modal-compare__value').eq(columnIndex);
            
            if (nameElement.length > 0 && valueCell.length > 0) {
                const characteristicName = nameElement.text();
                const value = product[characteristicName] || '–';
                valueCell.html(value);
            }
        });
        
        // Реинициализируем Selectize для обновленных select элементов
        reinitializeSelectize();
        
        // Обновляем видимость различий после изменения данных
        updateDifferencesVisibility();
    }

    // Реинициализация Selectize
    function reinitializeSelectize() {
        // Уничтожаем существующие экземпляры Selectize
        $('.modal-compare .compare-selectbox').each(function() {
            const selectize = this.selectize;
            if (selectize && typeof selectize.destroy === 'function') {
                selectize.destroy();
            }
        });
        
        // Инициализируем Selectize заново
        if ($('.modal-compare .compare-selectbox').length > 0) {
            $('.modal-compare .compare-selectbox').selectize({
                hideSelected: false
            });
        }
    }

    // Обновление видимости различий
    function updateDifferencesVisibility() {
        if (!showOnlyDifferences) {
            // Показываем все строки
            $('.modal-compare__row').show();
            return;
        }
        
        // Проверяем каждую строку на различия
        $('.modal-compare__row').each(function() {
            const values = [];
            const valueCells = $(this).find('.modal-compare__value');
            
            if (valueCells.length === 0) {
                return; // Пропускаем строки без значений
            }
            
            // Собираем значения из всех колонок
            valueCells.each(function() {
                let value = $(this).text().trim();
                
                // Для селектов берем выбранное значение
                const select = $(this).find('select');
                if (select.length > 0 && select[0].selectize) {
                    value = select[0].selectize.getValue();
                }
                
                values.push(value);
            });
            
            // Проверяем, есть ли различия
            if (values.length > 0) {
                const firstValue = values[0];
                const hasDifferences = values.some(value => value !== firstValue);
                
                // Показываем/скрываем строку
                if (hasDifferences) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        });
    }

    // Инициализация
    function initCompare() {
        // Проверяем наличие необходимых элементов
        if (!validateElements()) {
            return;
        }
        
        // Сначала читаем данные из HTML
        if (!readProductsFromHTML()) {
            return;
        }
        
        // Затем обновляем все колонки
        for (let i = 0; i < currentPositions.length; i++) {
            updateColumn(i);
        }
    }

    // Запускаем инициализацию
    initCompare();
});
