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
    
    // Prevent future dates for past events (birth dates, celebration dates, etc.)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    if (date > today) {
      throw new Error('Les dates futures ne sont pas autorisées');
    }
    
    return date;
  }
}
