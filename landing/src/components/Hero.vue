<template>
  <section class="relative overflow-hidden bg-white pt-20 pb-24 lg:pt-32 lg:pb-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
        <div class="lg:col-span-6 text-center lg:text-left">
          <div class="inline-flex items-center rounded-full bg-[rgb(var(--primary-soft))] px-3 py-1 text-sm font-medium text-[rgb(var(--primary-hover))] ring-1 ring-inset ring-[rgb(var(--primary-hover))/10] mb-6">
            <span class="mr-2 flex h-2 w-2 rounded-full bg-[rgb(var(--primary))] animate-pulse"></span>
            Version 2.0 is here
          </div>
          <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-8 leading-[1.1]">
            Take Control of Your <span class="text-transparent bg-clip-text bg-linear-to-r from-[rgb(var(--primary))] to-emerald-600">Finances</span>
          </h1>
          <p class="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            The smartest way to track expenses, manage budgets, and achieve your financial goals. All in one beautiful, secure app.
          </p>
          <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a href="https://play.google.com/store/apps" target="_blank" class="inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--primary))] px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-[rgb(var(--primary-hover))] transition-all hover:-translate-y-1 active:scale-95">
              <Download class="mr-2 h-5 w-5" />
              Get it on Google Play
            </a>
            <a href="#features" class="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all active:scale-95">
              Explore features
            </a>
          </div>
          <div class="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
            <div class="flex items-center">
              <ShieldCheck class="mr-2 h-5 w-5 text-green-500" />
              Bank-grade security
            </div>
            <div class="flex items-center">
              <Smartphone class="mr-2 h-5 w-5 text-[rgb(var(--primary))]" />
              Modern interface
            </div>
          </div>
        </div>
        <div class="mt-16 lg:mt-0 lg:col-span-6 relative">
          <div class="relative mx-auto w-full max-w-[320px]">
            <div class="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-[rgb(var(--primary))]/20 to-emerald-500/20 blur-2xl"></div>
            <div class="relative rounded-[2.5rem] border-[8px] border-gray-900 bg-gray-900 p-2 shadow-2xl overflow-hidden aspect-[9/19]">
              <!-- Mock App Content -->
              <div class="h-full w-full bg-white rounded-[1.8rem] overflow-hidden flex flex-col p-4">
                <div class="flex justify-between items-center mb-6 pt-2">
                  <div class="h-6 w-24 bg-gray-100 rounded-lg"></div>
                  <div class="h-8 w-8 rounded-full bg-gray-200"></div>
                </div>
                <div class="h-32 w-full bg-[rgb(var(--primary))] rounded-2xl mb-6 flex flex-col justify-center px-4 text-white">
                  <div class="text-[rgb(var(--primary-soft))] text-xs mb-1 uppercase tracking-wider font-semibold underline decoration-[rgb(var(--primary-soft))]/50">Total Balance</div>
                  <div class="text-2xl font-bold">$12,450.00</div>
                </div>
                <div class="space-y-4">
                  <div class="h-4 w-32 bg-gray-100 rounded mb-2"></div>
                  <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                    <div class="flex items-center space-x-3">
                      <div class="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <div class="h-5 w-5 rounded bg-[rgb(var(--primary-soft))] italic"></div>
                      </div>
                      <div class="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div class="h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div class="mt-auto h-16 w-full border-t border-gray-100 pt-4 flex justify-around">
                  <div class="h-1 w-12 bg-[rgb(var(--primary))] rounded-full absolute bottom-4"></div>
                  <div v-for="i in 4" :key="i" class="h-6 w-6 rounded-full bg-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download, ShieldCheck, Smartphone } from 'lucide-vue-next';
</script>
