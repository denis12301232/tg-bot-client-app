export function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

export function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return value.value;
    }
  }
  return value;
}

export function debounce<T extends Function>(f: T, ms: number) {
  let isCooldown = false;

  return function (this: unknown, ...args: []) {
    if (isCooldown) return;
    f.apply(this, args);
    isCooldown = true;
    setTimeout(() => (isCooldown = false), ms);
  } as unknown as T;
}

export function asyncThrottle<T extends Function>(f: T, ms: number) {
  let isThrottled = false;
  let savedArgs: [] | null = null;
  let savedThis: unknown = null;

  async function wrapper(this: unknown, ...args: []) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    isThrottled = true;
    await f.apply(this, args);

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper as unknown as T;
}

export async function copyText(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard
      .writeText(text)
      .then(() => 'Copied')
      .catch((e: Error) => e.message);
  } else {
    const textArea = document.createElement('textarea');
    textArea.style.cssText = `position: fixed;top: -9999px;left: -9999px;`;
    textArea.value = text;
    document.documentElement.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.documentElement.removeChild(textArea);
    return success ? Promise.resolve('Скопировано') : Promise.reject('Ошибка');
  }
}
