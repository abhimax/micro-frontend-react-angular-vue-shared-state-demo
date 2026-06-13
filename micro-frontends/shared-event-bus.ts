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

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Emit an event to all registered listeners
   * @param eventName - The name of the event to emit
   * @param data - The data to pass to the event listeners
   */
  emit(eventName: string, data?: any): void {
    // Dispatch using CustomEvent for cross-window/frame communication
    const customEvent = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      composed: true, // Allows event to cross shadow DOM boundaries
    });
    window.dispatchEvent(customEvent);

    // Also call internal listeners for same-frame communication
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Register a listener for an event
   * @param eventName - The name of the event to listen for
   * @param callback - The callback function to execute when the event is emitted
   * @returns A function to remove the listener
   */
  on(eventName: string, callback: EventCallback): () => void {
    // Add to internal listeners
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(callback);

    // Also listen to CustomEvent for cross-window/frame communication
    const customEventHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      try {
        callback(customEvent.detail);
      } catch (error) {
        console.error(`Error in event listener for ${eventName}:`, error);
      }
    };
    window.addEventListener(eventName, customEventHandler);

    // Return cleanup function
    return () => {
      this.off(eventName, callback);
      window.removeEventListener(eventName, customEventHandler);
    };
  }

  /**
   * Remove a specific listener for an event
   * @param eventName - The name of the event
   * @param callback - The callback function to remove
   */
  off(eventName: string, callback: EventCallback): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Remove all listeners for a specific event, or all events if no event name is provided
   * @param eventName - Optional event name to clear listeners for
   */
  clear(eventName?: string): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get the number of listeners for a specific event
   * @param eventName - The name of the event
   * @returns The number of listeners
   */
  listenerCount(eventName: string): number {
    return this.listeners.get(eventName)?.size || 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Export event name constants for type safety
export const EventNames = {
  PATIENT_SELECTED: 'patient:selected',
  PATIENT_DESELECTED: 'patient:deselected',
  APPOINTMENT_SELECTED: 'appointment:selected',
  INVOICE_SELECTED: 'invoice:selected',
} as const;

export type EventName = typeof EventNames[keyof typeof EventNames];
