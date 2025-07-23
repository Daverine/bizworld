<script>
export default {
  props: ['details', 'isSaved'],
  methods: {
    nextOpenDay(hours) {
      let ex = new Date().getDay() === 6 ? 0 : new Date().getDay() + 1,
        i = 1,
        result;
      for (; i < 6; i++) {
        if (hours[ex > 5 ? -1 + i : ex + i][0] > -1) {
          result = ex > 5 ? -1 + i : ex + i;
          break;
        }
      }
      return result;
    },
    whatDay(index) {
      return [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][index];
    },
  },
};
</script>
<template>
  <div
    class="biz-card card open-modal"
    :data-type="details.type"
    data-target="sc-details"
  >
    <div class="biz-display">
      <NuxtImg
        height="128"
        format="webp"
        densities="1x"
        class="image"
        :src="details.bizLogo"
      />
      <SvgIcon
        v-if="details.verified"
        name="verified_sp"
        title="Verified"
        class="small green-text"
        style="position: absolute; bottom: 0px; right: 0px"
      />
    </div>
    <div class="biz-title">{{ details.bizName }}</div>
    <div class="small semibold">{{ details.mainCategory }}</div>
    <div class="sc-gap">
      <span
        v-if="details.rating"
        class="semibold"
        title="Average Rate (Number of raters)"
      >
        <SvgIcon name="star_filled" class="yellow-text mini r-spaced" />
        <span class="small">{{
          `${details.rating.rate} (${details.rating.raters})`
        }}</span>
      </span>
    </div>
    <div style="display: flex; flex-flow: row; gap: 0.25em; margin-top: 0.5rem">
      <a
        :href="details.bizUrl"
        target="_blank"
        class="primary compact button ex-open-modal"
      >
        <SvgIcon name="public" class="lead" /> Visit
      </a>
      <Dropdown
        :options="{ directionPriority: { x: 'right', y: 'top' } }"
        class="compact button ex-open-modal"
      >
        <SvgIcon name="more_horiz" class="lead" /> More
        <div class="drop menu">
          <div class="item">
            <SvgIcon name="unfollow" class="lead" /> Unfollow
          </div>
          <div class="item"><SvgIcon name="share" class="lead" /> Share</div>
          <div class="item">
            <SvgIcon name="report" class="lead" /> Report page
          </div>
        </div>
      </Dropdown>
    </div>
  </div>
</template>
<style>
.biz-card {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  max-width: 100%;
  width: 15rem;
  gap: var(--sc-gap);
  padding: 0.5rem;
  cursor: pointer;
}
.biz-display {
  position: relative;
  width: 4.25rem;
  height: 4.25rem;
}
.biz-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  text-align: center;
  overflow: hidden;
  font-size: 1.125em;
  font-weight: var(--semibold-weight);
  color: var(--on-surface);
  line-height: 1.25 !important;
  width: 100%;
  padding-bottom: 0.125em;
  margin: 0 0 0.125em !important;
}
</style>
