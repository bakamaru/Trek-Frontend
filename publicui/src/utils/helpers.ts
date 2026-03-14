export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Formats a date to "DD MMM YYYY" format (e.g., "26 JAN 2025")
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getCDNUrl = (path: string): string => {
  const cdn = import.meta.env.VITE_CDN_PATH || '';
  if (!cdn)
    return path;
  if (path == null)
    return path;
  const base = cdn.endsWith('/') ? cdn.slice(0, -1) : cdn;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export function objectToFormData(obj: any, form = new FormData(), namespace = "") {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value instanceof Date) {
      form.append(formKey, value.toISOString());
    } else if (value instanceof File) {
      form.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((el, i) => {
        const arrayKey = `${formKey}[${i}]`;
        if (el instanceof File) {
          form.append(arrayKey, el);
        } else if (typeof el === "object") {
          objectToFormData(el, form, arrayKey);
        } else {
          form.append(arrayKey, el);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      objectToFormData(value, form, formKey); // recursive for nested objects
    } else if (value !== undefined && value !== null) {
      form.append(formKey, value);
    }
  }
  return form;
}
