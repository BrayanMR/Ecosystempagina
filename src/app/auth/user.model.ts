export interface User {
  name: string;
  lastname: string;
  email: string;
  password: string;
  identificacion: string;
  institucion: string;
  curso: string;
  role: 'user' | 'admin';
  status: string;
  uid: string;
  profilePicture: string;
  studyCertificate: string;
  puntos: number; // Agregar este campo
  approved?: boolean;
  retosCompletados?: string[]; // Array de IDs de retos completados
  description?: string; // Nuevo campo añadido


}
