export const getInitial = (name, fallback = 'P') => name?.trim().charAt(0).toUpperCase() || fallback;
