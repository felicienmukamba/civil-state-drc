import { NextResponse } from 'next/server';

export class ApiResponse {
  static success(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
  }

  static error(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
  }

  static created(data: any) {
    return NextResponse.json(data, { status: 201 });
  }

  static unauthorized(message: string = 'Non autorisé') {
    return NextResponse.json({ error: message }, { status: 401 });
  }

  static forbidden(message: string = 'Accès interdit') {
    return NextResponse.json({ error: message }, { status: 403 });
  }

  static notFound(message: string = 'Ressource introuvable') {
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
