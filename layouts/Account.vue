<script setup>
import Common from './Common.vue';

const userStore = useUserStore();
defineOptions({ title: 'Your account page | BizWorld' });
</script>
<template>
  <Common>
    <main class="flexible col" id="feed">
      <header>
        <div class="container guttered flexbox">
          <div class="flex-none">
            <img
              :src="userStore.userData.profileImg"
              class="profile-pic circular image"
              alt="Your profile Picture"
            />
          </div>
          <div class="flexible">
            <h5>
              {{
                `${userStore.userData.firstName} ${userStore.userData.lastName}`
              }}
            </h5>
            <div class="semibold">
              <span>{{ userStore.userData.following.length }} Following </span>
              |
              <span>{{ userStore.userData.bookmarks.length }} Bookmarks </span>
            </div>
          </div>
        </div>
      </header>
      <IScroller
        v-scrollPin="{ top: 68 }"
        class="z-level-3"
        style="margin-top: 5rem"
      >
        <div class="l-scroll">
          <SvgIcon name="double_arrow_left" class="mini" />
        </div>
        <div class="r-scroll">
          <SvgIcon name="double_arrow_right" class="mini" />
        </div>
        <div class="rail menu scroll-items">
          <div class="items" style="margin: 0px auto">
            <router-link
              to="/account/profile"
              class="item"
              exact-active-class="active"
              >Profile</router-link
            >
            <router-link
              to="/account/reviews"
              class="item"
              exact-active-class="active"
              >Reviews</router-link
            >
            <router-link
              to="/account/saved"
              class="item"
              exact-active-class="active"
              >Saved cards</router-link
            >
            <router-link
              to="/account/followed"
              class="item"
              exact-active-class="active"
              >Followed providers</router-link
            >
            <router-link
              to="/account/settings"
              class="item"
              exact-active-class="active"
              >Settings</router-link
            >
          </div>
        </div>
      </IScroller>
      <div>
        <slot />
      </div>
    </main>
  </Common>
</template>
<style lang="scss" scoped>
#feed {
  header {
    position: relative;
    width: 100%;
  }

  .profile-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 1rem;
  }

  .cover-pic {
    width: 100%;
    padding-top: calc(100% / 3 * 1);
    background-color: gray;
  }

  .profile-pic {
    width: 5rem;
    height: 5rem;
    border: 4px solid var(--surface);
    // margin-top: calc(-7.5rem / 2 - 1rem);
  }
}
</style>
