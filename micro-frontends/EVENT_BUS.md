# Event Bus Implementation

This document describes the custom event bus implementation for sharing state across micro-frontends in the medical domain architecture demo.

## Overview

The event bus enables cross-framework communication between:
- **Patient** (React) - Emits patient selection events
- **Appointment** (Angular) - Listens for patient selection events
- **Invoice/Billing** (Vue.js) - Listens for patient selection events
- **Host** (React) - Can also participate in event bus communication

## Architecture

The event bus uses the browser's CustomEvent API, which is framework-agnostic and works across:
- React micro-frontends
- Angular micro-frontends
- Vue.js micro-frontends
- Different windows/iframes (via composed events)

## Event Bus Utility

Location: `micro-frontends/shared-event-bus.ts`

### API

```typescript
// Emit an event
eventBus.emit('patient:selected', { patientId: 123, patient: {...} });

// Listen to events
const unsubscribe = eventBus.on('patient:selected', (data) => {
  console.log('Patient selected:', data.patientId);
});

// Remove listener
unsubscribe();

// Remove specific listener
eventBus.off('patient:selected', callback);

// Clear all listeners for an event
eventBus.clear('patient:selected');

// Clear all listeners
eventBus.clear();

// Get listener count
const count = eventBus.listenerCount('patient:selected');
```

### Event Names

```typescript
export const EventNames = {
  PATIENT_SELECTED: 'patient:selected',
  PATIENT_DESELECTED: 'patient:deselected',
  APPOINTMENT_SELECTED: 'appointment:selected',
  INVOICE_SELECTED: 'invoice:selected',
} as const;
```

## Implementation Details

### Patient React App (`patient-remote-mf`)

**Emits events when a patient is clicked:**

```typescript
import { eventBus, EventNames } from '../../shared-event-bus';

const handlePatientClick = (patient: Patient) => {
  setSelectedPatientId(patient.id);
  eventBus.emit(EventNames.PATIENT_SELECTED, { 
    patientId: patient.id, 
    patient 
  });
};
```

**Features:**
- Clickable patient rows with hover effects
- Visual highlighting of selected patient
- Emits patient selection events to all listeners

### Billing Vue App (`billing-vue-remote-mf`)

**Listens for patient selection events:**

```typescript
import { eventBus, EventNames } from '../../shared-event-bus';

const selectedPatientId = ref<number | null>(null);

const filteredInvoices = computed(() => {
  if (!selectedPatientId.value) return allInvoices.value;
  return allInvoices.value.filter((inv) => inv.patientId === selectedPatientId.value);
});

onMounted(async () => {
  // ... load invoices ...
  
  const unsubscribe = eventBus.on(EventNames.PATIENT_SELECTED, (data) => {
    selectedPatientId.value = data.patientId;
  });
  
  onUnmounted(() => {
    unsubscribe();
  });
});
```

**Features:**
- Filters invoices by selected patient
- Shows filter indicator when patient is selected
- Automatic cleanup on component unmount

### Appointment Angular App (`appointment-angular-remote-mf`)

**Listens for patient selection events:**

```typescript
import { eventBus, EventNames } from '../../../shared-event-bus';

readonly selectedPatientId = signal<number | null>(null);
readonly filteredAppointments = signal<Appointment[]>([]);

async ngOnInit(): Promise<void> {
  // ... load appointments ...
  
  const unsubscribe = eventBus.on(EventNames.PATIENT_SELECTED, (data) => {
    this.selectedPatientId.set(data.patientId);
    this.filterAppointments();
  });
  
  this.unsubscribeFn = unsubscribe;
}

ngOnDestroy(): void {
  if (this.unsubscribeFn) {
    this.unsubscribeFn();
  }
}
```

**Features:**
- Filters appointments by selected patient
- Shows filter indicator when patient is selected
- Proper cleanup using Angular lifecycle hooks

## Usage Flow

1. **User clicks a patient** in the Patient React app
2. **Patient app emits** `patient:selected` event with patient data
3. **Billing Vue app receives** the event and filters invoices
4. **Appointment Angular app receives** the event and filters appointments
5. **Both apps update** their UI to show only data for the selected patient

## Benefits

- **Framework-agnostic**: Works across React, Angular, and Vue
- **Decoupled**: Micro-frontends don't need direct references to each other
- **Type-safe**: Event names are defined as constants
- **Cleanup-friendly**: Built-in unsubscribe mechanism
- **Cross-window**: Works across different windows/iframes via CustomEvent
- **Simple API**: Easy to use with minimal boilerplate

## Extending the Event Bus

To add new events:

1. Add the event name to `EventNames` in `shared-event-bus.ts`:

```typescript
export const EventNames = {
  // ... existing events ...
  YOUR_NEW_EVENT: 'your:event:name',
} as const;
```

2. Emit the event from the appropriate micro-frontend:

```typescript
eventBus.emit(EventNames.YOUR_NEW_EVENT, { yourData });
```

3. Listen for the event in other micro-frontends:

```typescript
eventBus.on(EventNames.YOUR_NEW_EVENT, (data) => {
  // Handle the event
});
```

## Testing

To test the event bus integration:

1. Start all micro-frontends: `npm run dev`
2. Navigate to the patients page
3. Click on a patient row
4. Navigate to the invoices page - should show filtered invoices for that patient
5. Navigate to the appointments page - should show filtered appointments for that patient

## Troubleshooting

**Events not received:**
- Ensure the event bus file is imported correctly (check the relative path)
- Verify the event name matches exactly between emitter and listener
- Check that listeners are registered before events are emitted

**Memory leaks:**
- Always call the unsubscribe function returned by `eventBus.on()`
- In React: use useEffect cleanup
- In Vue: use onUnmounted
- In Angular: use ngOnDestroy

**Type errors:**
- Ensure patientId is the correct type (number in this implementation)
- Check that the event data structure matches between emitter and listener
