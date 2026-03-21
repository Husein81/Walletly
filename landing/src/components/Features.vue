<template>
  <section id="features" class="bg-gray-50 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h2 class="text-base font-semibold text-[rgb(var(--primary-hover))] uppercase tracking-wide">Features</h2>
        <p class="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">Everything you need to manage your money</p>
        <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-500">Designed for individuals who want simplicity without compromising on powerful features.</p>
      </div>
      
      <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in features" :key="feature.name" class="relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--primary-soft))] text-[rgb(var(--primary-hover))] transition-colors group-hover:bg-[rgb(var(--primary))] group-hover:text-white">
            <component :is="feature.icon" class="h-8 w-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.name }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Settings2, 
  Tags, 
  History 
} from 'lucide-vue-next';

const features = [
  {
    name: 'Smart Tracking',
    description: 'Log your expenses and income with just a few taps. Catogorize transactions to see where your money goes.',
    icon: TrendingUp,
  },
  {
    name: 'Multi-Wallet Support',
    description: 'Manage different accounts like Cash, Credit Cards, and Bank accounts all in one place.',
    icon: Wallet,
  },
  {
    name: 'Deep Analytics',
    description: 'Visual representations of your spending habits with intuitive charts and detailed reports.',
    icon: PieChart,
  },
  {
    name: 'Custom Categories',
    description: 'Create and manage personalized categories and icons that fit your unique lifestyle.',
    icon: Tags,
  },
  {
    name: 'Transaction History',
    description: 'Easily search, filter, and review past transactions with our powerful history view.',
    icon: History,
  },
  {
    name: 'Total Control',
    description: 'Set monthly limits and track your progress to stay within your budget effortlessly.',
    icon: Settings2,
  },
];
</script>
