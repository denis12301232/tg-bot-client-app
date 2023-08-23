export default class Helpers {
  static replacer(key: string, value: any) {
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()),
      };
    } else {
      return value;
    }
  }

  static reviver(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return value.value;
      }
    }
    return value;
  }
}
