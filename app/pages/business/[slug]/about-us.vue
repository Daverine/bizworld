<script setup>
definePageMeta({ layout: 'biz-pages', name: 'biz-about' });
const data = useBizStore();
const avail = useAvailability(data.details.hours);
const isReady = computed(() => data.details && avail.value);
</script>

<template>
  <main v-if="isReady" class="about-main">
    <div class="heading text-center">About Us</div>
    <div class="container-text">
      <p>{{ data.details.description }}</p>
    </div>
    <section class="container-text">
      <div class="heading text-center">Contact Us</div>
      <p>
        There are various ways you can contacts us. If have an account on
        Bizworld, you can easily send us message here and we would reply as soon
        as possible.
      </p>
      <div class="text-center p-4">
        <button class="compact button">Chat Us Now</button>
      </div>
      <table class="table clear">
        <tbody>
          <tr>
            <td>Telephone number</td>
            <td>{{ data.details.contacts.tel }}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{{ data.details.contacts.email }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section id="biz-hours" class="container-text">
      <div class="heading text-center">Business Hours</div>
      <table class="mx-auto clear table selectable text-center">
        <thead>
          <tr>
            <th>Day</th>
            <th>Open</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(hour, i) in data.details.hours"
            :class="{ active: new Date().getDay() === i }"
          >
            <td>{{ avail.whatDay(i) }}</td>
            <template v-if="hour">
              <td>{{ hour[0] }}</td>
              <td>{{ hour[1] }}</td>
            </template>
            <td v-else colspan="2">Closed</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="container-text">
      <div class="heading text-center">Office Address</div>
      <p>
        {{ data.details.location.address }}, {{ data.details.location.city }},
        {{ data.details.location.state }}.
      </p>
      <div class="text-center p-4">
        <NuxtLink
          :to="data.details.location.map"
          external
          target="_blank"
          class="button"
          >View on Map</NuxtLink
        >
      </div>
    </section>
  </main>
</template>

<style></style>
