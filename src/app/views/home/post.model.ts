export interface Post {
  id?: string;
  userId: string;
  userName: string;
  userProfileUrl: string;
  imageUrl: string;
  description: string;
  timestamp: number;
  hearts?: Record<string, boolean>;
  institucion: string;
  curso: string;
  isChallenge?: boolean;
  challengeId?: string;
  isActiveChallenge?: boolean; // Nueva propiedad
  challengeTimeLeft?: number;  // Nueva propiedad
}
