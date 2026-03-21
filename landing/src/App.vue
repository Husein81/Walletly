<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <main>
      <Hero />
      <Features />
    </main>
    <Footer />
  </div>
</template>