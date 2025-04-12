<script setup>
definePageMeta({ layout: 'account', auth: true, });
const userStore = useUserStore();
defineOptions({ title: 'Profile | BizWorld' });
</script>
<template>
    <table class="simple rounded loose table profileTab">
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
                <td>Profile picture</td>
                <td>
                    <img :src="userStore.userData.profileImg" class="circular image" style="max-width: 7rem;"
                        alt="profile picture" />
                </td>
            </tr>
            <tr>
                <td>First name</td>
                <td>{{ userStore.userData.firstName }}</td>
            </tr>
            <tr>
                <td>Last name</td>
                <td>{{ userStore.userData.lastName }}</td>
            </tr>
            <tr>
                <td>Birth year</td>
                <td>{{ userStore.userData.birthday }}</td>
            </tr>
            <tr>
                <td>Gender</td>
                <td>{{ userStore.userData.gender }}</td>
            </tr>
            <tr>
                <td>Default search location</td>
                <td> {{ userStore.userData.searchLocation }}</td>
            </tr>
        </tbody>
    </table>
    <div class="text-center container">
        <h4>Are you looking for employment?</h4>
        <p>You can create a work profile for yourself on Bizworld. Employers can easily search for keywords that matches
            you profile and get you employed.</p>
        <div class="compact button">Create a work profile</div>
    </div>
</template>
<style>
.profileTab th:last-child:not(:first-child),
.profileTab td:last-child:not(:first-child) {
    text-align: right;
}
</style>