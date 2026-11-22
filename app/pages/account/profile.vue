<script lang="ts" setup>
const { user } = useAuth();
</script>
<template>
  <div class="auto-contain no-edge flex max-w-lg flex-1 flex-col gap-4">
    <table
      class="simple loose table rounded [&_td:last-child]:text-right [&_th:last-child]:text-right"
    >
      <thead>
        <tr>
          <th>
            <div class="heading">Basic info</div>
          </th>
          <th>
            <div class="compact button">Edit profile</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2" class="text-center!">
            <NuxtImg
              preset="thumbnail"
              :src="user?.image || '/images/profilepic.jpg'"
              class="image mx-auto rounded-full"
              style="max-width: 7rem"
              alt="profile picture"
            />
          </td>
        </tr>
        <tr>
          <td>First name</td>
          <td>{{ user?.first_name }}</td>
        </tr>
        <tr>
          <td>Last name</td>
          <td>{{ user?.last_name }}</td>
        </tr>
        <tr>
          <td>Birth year</td>
          <td>{{ user?.birth_year }}</td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>{{ user?.gender }}</td>
        </tr>
        <tr>
          <td>Default search location</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div class="auto-contain max-w-6xl text-center">
      <h4>Are you looking for employment?</h4>
      <p>
        You can create a work profile for yourself on Bizworld. Employers can easily search for
        keywords that matches you profile and get you employed.
      </p>
      <div class="compact button">Create a work profile</div>
    </div>
  </div>
</template>
