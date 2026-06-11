import { Injectable } from '@angular/core';
import type { Appointment } from './types';

// Talks to the same API gateway the React remotes use (single origin).
@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private readonly apiBase = 'http://localhost:4000';

  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch(`${this.apiBase}/appointments`);
    if (!res.ok) {
      throw new Error(`Failed to load appointments (HTTP ${res.status})`);
    }
    return res.json();
  }
}
