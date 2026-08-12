export type Event = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string;
  mode: string;
  organizer: string;
  date: Date | string;
  registrationDeadline: Date | string;
  maxParticipants: number;
  prize: string;
  teamSize: string;
  status: string;
  certificateAvailable: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Registration = {
  id: number;
  eventId: number;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  teamName?: string | null;
  reason: string;
  certificateId?: string | null;
  certificateIssued: boolean;
  certificateIssuedAt?: Date | string | null;
  createdAt: Date | string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  college?: string | null;
  branch?: string | null;
  year?: string | null;
  profile?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
};
