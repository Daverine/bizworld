<script setup>
definePageMeta({ layout: 'common', auth: true });
</script>
<template>
  <main class="flexible col" id="feed">
    <div
      class="mybiz-card card"
      style="
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
        padding: 10px;
      "
    >
      <div style="display: flex; gap: 0.5em">
        <div
          class="rounded"
          style="width: 90px; height: 90px; background-color: pink"
        ></div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            width: calc(100% - 90px - 0.5em);
          "
        >
          <div class="bold h6">Emmadave Computer Technology Services</div>
          <div class="faint-text">
            <span>@emmadavetechservices</span> |
            <span>Computer repair services</span>
          </div>
          <div class="flexbox flex-wrap semibold" style="gap: 1em">
            <span
              ><Icon
                name="material-symbols:comment-outline-rounded"
                class="small"
              />
              3 Messages</span
            >
            <span
              ><Icon
                name="material-symbols:groups-outline-rounded"
                class="small"
              />
              3 Followers</span
            >
          </div>
        </div>
      </div>
      <div class="fluid flexbox flex-wrap" style="gap: 0.5em">
        <NuxtLink to="/manage/id3894/overview" class="compact flexible button"
          >Manage page</NuxtLink
        >
        <button class="compact flexible button">Create post</button>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'bottom' } }"
          class="as-icon flexible compact button"
        >
          <Icon name="material-symbols:more-horiz" />
          <div class="drop menu">
            <div class="item">
              <Icon
                name="material-symbols:campaign-outline-rounded"
                class="lead"
              />
              Promote
            </div>
            <div class="item">
              <Icon name="material-symbols:share-outline" class="lead" /> Share
            </div>
          </div>
        </LimbDropdown>
      </div>
    </div>
  </main>
</template>
