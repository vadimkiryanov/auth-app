import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматирует дату в удобочитаемый формат
 * @param dateStr - строка даты в формате ISO
 * @returns отформатированная строка даты в формате "DD.MM.YYYY HH:MM"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  
  // Проверяем, является ли дата допустимой
  if (isNaN(date.getTime())) {
    return dateStr; // Возвращаем исходную строку, если дата недействительна
  }
  
  // Форматируем дату в виде "DD.MM.YYYY HH:MM" используя date-fns
  return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
}

/**
 * Форматирует дату с указанием времени "назад"
 * @param dateStr - строка даты в формате ISO
 * @returns строка вида "2 часа назад", "5 дней назад" и т.д.
 */
export function formatDateAgo(dateStr: string): string {
  const date = new Date(dateStr);
  
  // Проверяем, является ли дата допустимой
  if (isNaN(date.getTime())) {
    return 'Неизвестная дата';
  }
  
  // Используем date-fns для форматирования относительного времени
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
}