import { writable } from 'svelte/store';

export const toasts = writable([]);

export const addToast = (message, timeout = 3, type = 'success') => {
	toasts.update((toast) => {
		toast.push({ message, timeout: timeout, type, show: true });
    countdown(toast.length - 1);
    return toast;
	});
};

const countdown = (index) => {
  toasts.update((toast) => {
    const t = toast[index];
    if (t.timeout > 0) {
      setTimeout(() => {
        t.timeout--;
        countdown(index);
      }, 1000);
    } else {
      t.show = false;
    }
    return toast;
  });
};
