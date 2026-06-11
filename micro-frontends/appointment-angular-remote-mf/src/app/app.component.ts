import { Component, OnInit, inject, signal } from '@angular/core';
import { AppointmentsService } from './appointments.service';
import type { Appointment } from './types';

// The Angular equivalent of the React appointment remote: same data, same
// table, same gateway call — just rendered by Angular instead of React.
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="ng-appointments">
      <h2>
        Appointments
        <span class="badge">Angular</span>
      </h2>

      @if (loading()) {
        <p class="muted">Loading appointments…</p>
      } @else if (error()) {
        <p class="err">⚠ {{ error() }}</p>
      } @else {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (a of appointments(); track a.id) {
              <tr>
                <td>{{ a.id }}</td>
                <td>{{ a.patientId }}</td>
                <td>{{ a.doctorName }}</td>
                <td>{{ a.department }}</td>
                <td>{{ a.date }}</td>
                <td>{{ a.time }}</td>
                <td>{{ a.status }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [
    `
      .ng-appointments {
        padding: 1.5rem;
        color: #fff;
        text-align: left;
        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
      }
      h2 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 0 1rem;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .badge {
        font-size: 0.7rem;
        font-weight: 600;
        background: #dd0031;
        color: #fff;
        padding: 0.15rem 0.5rem;
        border-radius: 9999px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }
      th,
      td {
        text-align: left;
        padding: 0.5rem 1rem 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      thead th {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
      .muted {
        opacity: 0.7;
      }
      .err {
        color: #f87171;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private readonly service = inject(AppointmentsService);

  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      this.appointments.set(await this.service.getAppointments());
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.loading.set(false);
    }
  }
}
