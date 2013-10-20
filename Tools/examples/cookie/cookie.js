/**
 * Получение всех доступных кук
 */
console.log(document.cookie);





























/**
 * Создание куки
 */
// Сессионная кука
document.cookie = 'test=value';






















// Объект Date
// new Date() - объект педставляющий текущее время
// new Date(number) - объект предствляющий number миллисекунд с начала эры юникс (01 Jan 1970 00:00:00)
// date.getTime() - количество миллисекунд объекта времени с начала эры юник
// date.toUTCString() - формат записи даты
// Greenwich Mean Time (GMT) - среднее время по гринвичу























// Однодневная кука
document.cookie = 'test=true;expires=' + new Date( new Date().getTime() + 1000*60*60*24).toUTCString();

// Обновляем значение
document.cookie = 'test=false;expires=' + new Date( new Date().getTime() + 1000*60*60*24).toUTCString();

// Кука для пути /browser-support
document.cookie = 'test=true;expires=' + new Date( new Date().getTime() + 1000*60*60*24*2).toUTCString() + ';path=/browser-support';




















// Кука для домена
document.cookie = 'test=true;domain=jquery.com';

// Кука для домена и поддоменов
document.cookie = 'test=true;domain=.jquery.com';

// Кука для поддомена
document.cookie = 'test=true;domain=api.jquery.com';

// Удаление
document.cookie = 'test=;expires=' + new Date(0).toGMTString();










// сереалиализация
JSON.stringify();

// десериализация
JSON.parse();
