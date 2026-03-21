<template>
  <nav class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))] text-white shadow-lg">
          <Wallet class="h-6 w-6" />
        </div>
        <span class="text-2xl font-bold tracking-tight text-gray-900 leading-none">Walletly</span>
      </div>
      <div class="hidden md:flex md:items-center md:space-x-8 text-sm font-medium text-gray-600">
        <a href="#features" class="hover:text-[rgb(var(--primary))] transition-colors">Features</a>
        <a href="#how-it-works" class="hover:text-[rgb(var(--primary))] transition-colors">How it Works</a>
        <a href="https://play.google.com/store/apps" target="_blank" class="flex items-center gap-2 rounded-full bg-[rgb(var(--primary))] px-6 py-2.5 text-white hover:bg-[rgb(var(--primary-hover))] transition-all shadow-md hover:shadow-lg active:scale-95">
            Download Now
        <Download class="size-4"/>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Wallet, Download } from 'lucide-vue-next';
</script>
