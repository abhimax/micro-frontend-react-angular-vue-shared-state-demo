import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { AppointmentsService } from './appointments.service';
import type { Appointment } from './types';
import { eventBus, EventNames } from '../../../shared-event-bus';

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

      @if (selectedPatientId()) {
        <div class="filter-indicator">
          <div class="filter-content">
            <span>Filtered by Patient ID: </span>
            <strong>{{ selectedPatientId() }}</strong>
          </div>
          <button (click)="clearSelection()" class="clear-button">
            Clear Filter
          </button>
        </div>
      }

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
            @for (a of filteredAppointments(); track a.id) {
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
      .filter-indicator {
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        background: rgba(37, 99, 235, 0.2);
        border-radius: 0.5rem;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .filter-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .filter-content strong {
        background: rgba(37, 99, 235, 1);
        color: #fff;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-weight: 600;
      }
      .clear-button {
        background: none;
        border: none;
        color: rgba(147, 197, 253, 1);
        font-size: 0.875rem;
        cursor: pointer;
        text-decoration: underline;
        transition: color 0.2s;
      }
      .clear-button:hover {
        color: #fff;
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
export class AppComponent implements OnInit, OnDestroy {
  private readonly service = inject(AppointmentsService);

  readonly allAppointments = signal<Appointment[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedPatientId = signal<number | null>(null);

  // Filter appointments by selected patient
  filteredAppointments = signal<Appointment[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.service.getAppointments();
      this.allAppointments.set(data);
      this.appointments.set(data);
      this.filteredAppointments.set(data);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.loading.set(false);
    }

    // Listen for patient selection events
    const unsubscribeSelected = eventBus.on(EventNames.PATIENT_SELECTED, (data) => {
      this.selectedPatientId.set(data.patientId);
      this.filterAppointments();
    });

    // Listen for patient deselection events
    const unsubscribeDeselected = eventBus.on(EventNames.PATIENT_DESELECTED, () => {
      this.selectedPatientId.set(null);
      this.filterAppointments();
    });

    // Store unsubscribe functions for cleanup
    this.unsubscribeFn = () => {
      unsubscribeSelected();
      unsubscribeDeselected();
    };
  }

  private filterAppointments(): void {
    const patientId = this.selectedPatientId();
    if (!patientId) {
      this.filteredAppointments.set(this.allAppointments());
    } else {
      this.filteredAppointments.set(
        this.allAppointments().filter((a) => a.patientId === patientId)
      );
    }
  }

  clearSelection(): void {
    this.selectedPatientId.set(null);
    this.filterAppointments();
  }

  private unsubscribeFn: (() => void) | null = null;

  ngOnDestroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
    }
  }
}
