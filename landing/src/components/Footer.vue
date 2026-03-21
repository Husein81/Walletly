<template>
  <footer class="bg-gray-900 py-12 text-gray-300 mt-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-12 mb-12">
        <div class="flex items-center space-x-2 mb-8 md:mb-0">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--primary))] text-white">
            <Wallet class="h-6 w-6" />
          </div>
          <span class="text-2xl font-bold tracking-tight text-white">Walletly</span>
        </div>
        <div class="flex space-x-8 text-sm uppercase tracking-widest font-semibold">
          <a href="#features" class="hover:text-white transition-colors">Features</a>
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-sm">
          &copy; {{ new Date().getFullYear() }} Walletly App. All rights reserved.
        </p>
        <div class="flex space-x-4">
          <a href="https://play.google.com/store/apps" target="_blank" class="text-gray-400 hover:text-[rgb(var(--primary))] transition-colors font-medium underline underline-offset-4 decoration-[rgb(var(--primary))]">
            Play Store Download
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Wallet } from 'lucide-vue-next';
</script>
