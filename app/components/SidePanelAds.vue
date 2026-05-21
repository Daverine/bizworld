<template>
  <aside class="flex-none col sidemenu max-lg:hidden">
    <div class="flex flex-wrap py-4 px-2" v-scrollPin="{ top: 84, bottom: 16 }">
      <div style="width: 100%">
        <h6 class="text-center" style="margin-bottom: 16px">Sponsored (Ads)</h6>
        <div class="ads">
          <div class="text-center ad">
            <NuxtImg format="webp" src="/images/ads.jpg" alt="ad" />
            <div>
              Fix your laptops and desktops (Hardware and Software).
              <button class="primary button">contact us</button>
            </div>
          </div>
        </div>
      </div>
      <!-- <rc-shareables name="common_footer" /> -->
    </div>
  </aside>
</template>
<style>
.ad {
  box-shadow: 0px 0px 5px #aaa;
  padding: 10px;
  background-color: var(--color-surface);
}
</style>
