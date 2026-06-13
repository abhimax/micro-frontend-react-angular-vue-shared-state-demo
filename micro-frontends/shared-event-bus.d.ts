/**
 * Shared Event Bus for Micro-Frontend Communication
 *
 * This utility provides a framework-agnostic event bus using the browser's CustomEvent API.
 * It enables communication between React, Angular, and Vue micro-frontends.
 *
 * Usage:
 * - Emit events: eventBus.emit('patient:selected', { patientId: '123' })
 * - Listen to events: eventBus.on('patient:selected', (data) => { console.log(data) })
 * - Remove listeners: eventBus.off('patient:selected', handler)
 */
type EventCallback = (data: any) => void;
declare class EventBus {
    private listeners;
    /**
     * Emit an event to all registered listeners
     * @param eventName - The name of the event to emit
     * @param data - The data to pass to the event listeners
     */
    emit(eventName: string, data?: any): void;
    /**
     * Register a listener for an event
     * @param eventName - The name of the event to listen for
     * @param callback - The callback function to execute when the event is emitted
     * @returns A function to remove the listener
     */
    on(eventName: string, callback: EventCallback): () => void;
    /**
     * Remove a specific listener for an event
     * @param eventName - The name of the event
     * @param callback - The callback function to remove
     */
    off(eventName: string, callback: EventCallback): void;
    /**
     * Remove all listeners for a specific event, or all events if no event name is provided
     * @param eventName - Optional event name to clear listeners for
     */
    clear(eventName?: string): void;
    /**
     * Get the number of listeners for a specific event
     * @param eventName - The name of the event
     * @returns The number of listeners
     */
    listenerCount(eventName: string): number;
}
export declare const eventBus: EventBus;
export declare const EventNames: {
    readonly PATIENT_SELECTED: "patient:selected";
    readonly PATIENT_DESELECTED: "patient:deselected";
    readonly APPOINTMENT_SELECTED: "appointment:selected";
    readonly INVOICE_SELECTED: "invoice:selected";
};
export type EventName = typeof EventNames[keyof typeof EventNames];
export {};
