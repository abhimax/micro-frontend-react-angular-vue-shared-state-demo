<template>
  <div class="p-6 text-left">
    <div class="flex items-center gap-2 align-middle mb-4">
      <h2 class="text-2xl font-bold">Invoices</h2>
<span style="font-size: 0.7rem; font-weight: 600; background:rgb(10, 128, 90); color: #fff; padding: 0.15rem 0.5rem; border-radius: 9999px;">Vue</span>
    </div>

    <div v-if="selectedPatientId" class="mb-4 bg-blue-600/20 px-4 py-2 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">Filtered by Patient ID:</span>
        <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {{ selectedPatientId }}
        </span>
      </div>
      <button
        @click="clearSelection"
        class="text-sm text-blue-300 hover:text-white transition-colors underline"
      >
        Clear Filter
      </button>
    </div>

    <p v-if="loading" class="opacity-70">Loading invoices…</p>
    <p v-if="error" class="text-red-400">⚠ {{ error }}</p>

    <table v-if="!loading && !error" class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-white/20 text-left">
          <th class="py-2 pr-4">ID</th>
          <th class="py-2 pr-4">Patient</th>
          <th class="py-2 pr-4">Service</th>
          <th class="py-2 pr-4">Amount</th>
          <th class="py-2 pr-4">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="inv in filteredInvoices"
          :key="inv.id"
          class="border-b border-white/10"
        >
          <td class="py-2 pr-4">{{ inv.id }}</td>
          <td class="py-2 pr-4">{{ inv.patientId }}</td>
          <td class="py-2 pr-4">{{ inv.serviceName }}</td>
          <td class="py-2 pr-4">{{ inv.amount }}</td>
          <td class="py-2 pr-4">{{ inv.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { Invoice } from './types';
import { fetchInvoices } from './api';
import { eventBus, EventNames } from '../../shared-event-bus';

const invoices = ref<Invoice[]>([]);
const allInvoices = ref<Invoice[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedPatientId = ref<number | null>(null);

// Filter invoices by selected patient
const filteredInvoices = computed(() => {
  if (!selectedPatientId.value) return allInvoices.value;
  return allInvoices.value.filter((inv) => inv.patientId === selectedPatientId.value);
});

const clearSelection = () => {
  selectedPatientId.value = null;
};

// Load invoices from billing-service once, when the component mounts.
onMounted(async () => {
  try {
    allInvoices.value = await fetchInvoices();
    invoices.value = allInvoices.value;
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }

  // Listen for patient selection events
  const unsubscribeSelected = eventBus.on(EventNames.PATIENT_SELECTED, (data) => {
    selectedPatientId.value = data.patientId;
  });

  // Listen for patient deselection events
  const unsubscribeDeselected = eventBus.on(EventNames.PATIENT_DESELECTED, () => {
    selectedPatientId.value = null;
  });

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribeSelected();
    unsubscribeDeselected();
  });
});
</script>

<style scoped>
/* Styles are handled by Tailwind CSS via postcss */
</style>
