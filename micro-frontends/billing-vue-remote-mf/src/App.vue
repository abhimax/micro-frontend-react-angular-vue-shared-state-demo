<template>
  <div class="p-6 text-left">
    <div class="flex items-center gap-2 align-middle mb-4">
      <h2 class="text-2xl font-bold">Invoices</h2>
      <span class="bg-teal-600 text-white px-2 py-1 rounded-full text-xs">
        Vue
      </span>
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
          v-for="inv in invoices"
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
import { ref, onMounted } from 'vue';
import type { Invoice } from './types';
import { fetchInvoices } from './api';

const invoices = ref<Invoice[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Load invoices from billing-service once, when the component mounts.
onMounted(async () => {
  try {
    invoices.value = await fetchInvoices();
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Styles are handled by Tailwind CSS via postcss */
</style>
