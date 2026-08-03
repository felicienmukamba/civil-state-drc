export class Validation {
  static validateId(id: string | number): number {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId) || numId <= 0) {
      throw new Error('ID invalide');
    }
    return numId;
  }

  static validateRequiredFields(data: any, fields: string[]): void {
    const missing = fields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Champs requis manquants: ${missing.join(', ')}`);
    }
  }

  static parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }
    return date;
  }
}
