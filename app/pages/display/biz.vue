<script setup>
const props = defineProps(['details']);
const divider = useTemplateRef('divider');
const dgContent = useTemplateRef('dgContent');
const activeFixedMenu = ref(false);

function nextOpenDay(hours) {
  let ex = new Date().getDay() === 6 ? 0 : new Date().getDay() + 1,
    i = 1,
    result;

  for (; i < 6; i++) {
    if (hours[ex > 5 ? -1 + i : ex + i][0] !== -1) {
      result = ex > 5 ? -1 + i : ex + i;
      break;
    }
  }

  return result;
}

function getMinutes(time) {
  time = time.split(':');
  return Number(time[0]) * 60 + Number(time[1]);
}

function to12hrsTime(time) {
  time = time.split(':');
  return `${Number(time[0]) % 12 || 12}:${time[1]}${
    Number(time[0]) >= 12 ? 'PM' : 'AM'
  }`;
}

function whatDay(index) {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][index];
}

function handleScroll() {
  if (divider.value.getBoundingClientRect().top <= 210) {
    activeFixedMenu.value = true;
  } else {
    activeFixedMenu.value = false;
  }
}

onUpdated(() => {
  if (props.details) dgContent.value.dispatchEvent(new Event('scroll'));
});
</script>
<template>
  <div
    v-if="details"
    class="dialog self-scroll full-screen sc-dialog"
    :data-type="details.type"
  >
    <div
      class="header dm-header a-block flexbox"
      :class="{ active: activeFixedMenu }"
    >
      <div class="content h6 semibold 0-margined truncate">
        {{ details.bizName }}
      </div>
      <button class="flat circular button trailing icon exit-modal">
        <SvgIcon name="close" />
      </button>
    </div>
    <div ref="dgContent" class="content 0-padding" @scroll="handleScroll">
      <div class="dm-display">
        <div
          class="dm-media"
          :style="`background-image: url('${details.coverPic}')`"
        ></div>
      </div>
      <div style="padding: 1em 1.5em">
        <div class="dm-gap">
          <div
            class="dm-logo"
            :style="`background-image: url('${details.logo}')`"
          >
            <SvgIcon
              v-if="details.verified"
              name="verified_sp"
              v-tooltip:aria.unblocking
              aria-label="Verified"
              class="green-text"
              style="position: absolute; bottom: -3px; right: -5px"
            />
          </div>
          <div class="dm-heading">
            <h4 class="dm-title">{{ details.bizName }}</h4>
            <div class="faint-text">{{ details.mainCategory }}</div>
          </div>
        </div>
        <div class="dm-gap">
          <div
            class="semibold"
            v-tooltip:aria.unblocking
            aria-label="Average Rate (Number of raters)"
          >
            <SvgIcon name="star_filled" class="yellow-text small r-spaced" />
            <span>{{
              `${(
                details.reviews.reduce((n, i) => n + i.rating, 0) /
                details.reviews.length
              ).toFixed(1)}
              (${details.reviews.length} reviews)`
            }}</span>
          </div>
          <div>
            <span
              v-tooltip:aria.unblocking
              :aria-label="
                details.hours[new Date().getDay()][0] === -1
                  ? 'Did not open today at all.'
                  : `Open today by ${to12hrsTime(
                      details.hours[new Date().getDay()][0]
                    )} and closes by ${to12hrsTime(
                      details.hours[new Date().getDay()][1]
                    )}.`
              "
            >
              <SvgIcon name="today" class="small r-spaced" />
              <span class="semibold">
                <template
                  v-if="
                    details.hours[new Date().getDay()][0] === -1 ||
                    getMinutes(details.hours[new Date().getDay()][0]) >
                      getMinutes(
                        `${new Date().getHours()}:${new Date().getMinutes()}`
                      ) ||
                    getMinutes(details.hours[new Date().getDay()][1]) <=
                      getMinutes(
                        `${new Date().getHours()}:${new Date().getMinutes()}`
                      )
                  "
                >
                  <span class="error-text">Closed. </span>
                  <span
                    v-if="
                      typeof details.hours[new Date().getDay()][0] ===
                        'string' &&
                      getMinutes(details.hours[new Date().getDay()][0]) >
                        getMinutes(
                          `${new Date().getHours()}:${new Date().getMinutes()}`
                        )
                    "
                    >Opens
                    {{
                      to12hrsTime(details.hours[new Date().getDay()][0])
                    }}
                    Today</span
                  >
                  <span v-else>
                    Opens
                    {{
                      details.hours[
                        new Date().getDay() === 6 ? 0 : new Date().getDay() + 1
                      ][0] !== -1
                        ? `${to12hrsTime(
                            details.hours[
                              new Date().getDay() === 6
                                ? 0
                                : new Date().getDay() + 1
                            ][0]
                          )}
                    Tomorrow`
                        : `${to12hrsTime(
                            details.hours[nextOpenDay(details.hours)][0]
                          )} on
                    ${whatDay(nextOpenDay(details.hours))}`
                    }}
                  </span>
                </template>
                <template v-else>
                  <span
                    v-if="
                      getMinutes(details.hours[new Date().getDay()][1]) -
                        getMinutes(
                          `${new Date().getHours()}:${new Date().getMinutes()}`
                        ) <=
                      60
                    "
                    class="warning-text"
                    >Closes soon.
                  </span>
                  <span v-else class="success-text">Open. </span>
                  <span
                    >Closes {{ details.hours[new Date().getDay()][1] }}</span
                  >
                </template>
              </span>
            </span>
            <SvgIcon
              name="info"
              class="mini l-spaced"
              style="color: var(--on-surface-variant)"
              v-tooltip:aria.unblocking
              aria-label="Note that the given detail is generated using your system time relative to the Business location timezone."
            />
          </div>
        </div>
        <hr ref="divider" />
        <div>
          <table class="dm-info table borderless">
            <tbody>
              <tr>
                <td>
                  <SvgIcon name="domain" />
                </td>
                <td>
                  {{ details.description }}
                  <a :href="`${details.bizUrl}/about_us`" target="_blank"
                    >Learn more.</a
                  >
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="location_on" />
                </td>
                <td>
                  {{
                    `${details.location.address}, ${details.location.city}, ${details.location.state}.`
                  }}
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="call" />
                </td>
                <td>{{ details.contacts.tel }}</td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="public" />
                </td>
                <td class="link">
                  <a :href="details.bizUrl" target="_blank">{{
                    details.bizUrl
                  }}</a>
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="today" />
                </td>
                <td>
                  <table class="table compact clear 0-margined">
                    <tbody>
                      <tr
                        v-for="(hour, i) in details.hours"
                        :class="{ active: new Date().getDay() === i }"
                      >
                        <td>{{ whatDay(i) }}</td>
                        <td>
                          {{
                            hour[0] === -1
                              ? 'Closed'
                              : `${to12hrsTime(hour[0])} -
                          ${to12hrsTime(hour[1])}`
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />
        <div>
          <div class="sub heading">Review Summary</div>
          <div class="flexbox" style="flex-direction: row-reverse">
            <div class="col 6-width md-2-width">
              <div
                class="text-center"
                :set="
                  (rating = (
                    details.reviews.reduce((n, i) => n + i.rating, 0) /
                    details.reviews.length
                  ).toFixed(1))
                "
              >
                <div class="semibold" style="font-size: 3em">
                  {{
                    (
                      details.reviews.reduce((n, i) => n + i.rating, 0) /
                      details.reviews.length
                    ).toFixed(1)
                  }}
                </div>
                <div class="rating small yellow-text">
                  <SvgIcon v-for="i in Math.floor(rating)" name="star_filled" />
                  <SvgIcon
                    v-if="rating - Math.floor(rating) >= 0.5"
                    name="star_half"
                  />
                  <SvgIcon v-for="i in 5 - Math.round(rating)" name="star" />
                </div>
                <div>{{ `${details.reviews.length} reviews` }}</div>
              </div>
            </div>
            <div class="col 6-width md-4-width">
              <table class="table compact borderless 0-margined">
                <tbody>
                  <tr v-for="i in 5" :set="(n = 6 - i)">
                    <td style="width: 15px">{{ n }}</td>
                    <td>
                      <div class="progress-bar">
                        <div
                          class="determinate"
                          :style="`width: ${
                            (details.reviews.filter((elem) => elem.rating === n)
                              .length *
                              100) /
                            details.reviews.length
                          }%;`"
                        ></div>
                      </div>
                    </td>
                    <td style="width: 15px; text-align: right">
                      {{
                        `(${
                          details.reviews.filter((elem) => elem.rating === n)
                            .length
                        })`
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="text-center small semibold italic">
            Patronize {{ details.bizName }} to write a review.
            <!-- <button class="button">
                                <SvgIcon name="rate_review" class="lead" />
                                Write a review
                            </button> -->
          </div>
        </div>
        <hr />
        <div>
          <div class="dm-gap">
            <div class="sub heading">Latest Reviews</div>
            <!-- <LimbDropdown class="outlined small button">
                                <SvgIcon name="sort" class="lead" />
                                Sort
                                <div class="drop menu">
                                    <div class="item">Newest</div>
                                    <div class="item">Highest</div>
                                    <div class="item">Lowest</div>
                                </div>
                            </LimbDropdown> -->
          </div>
          <div class="dm-reviews">
            <div
              v-for="a in Math.min(5, details.reviews.length)"
              class="dm-review"
              :set="(review = details.reviews[a - 1])"
            >
              <header>
                <div class="avatar image">
                  <span class="huge uppercased">{{
                    review.username.split('')[0]
                  }}</span>
                </div>
                <div class="content">
                  <div class="bold">{{ review.username }}</div>
                  <div class="dm-gap" style="gap: 0.5em">
                    <div
                      class="rating mini yellow-text"
                      :set="(rating = review.rating)"
                    >
                      <SvgIcon
                        v-for="i in Math.floor(rating)"
                        name="star_filled"
                      />
                      <SvgIcon
                        v-if="rating - Math.floor(rating) >= 0.5"
                        name="star_half"
                      />
                      <SvgIcon
                        v-for="i in 5 - Math.round(rating)"
                        name="star"
                      />
                    </div>
                    <div>Render Time here.</div>
                  </div>
                </div>
                <LimbDropdown>
                  <SvgIcon name="more_vert" />
                  <div class="drop menu small">
                    <div class="item">
                      <SvgIcon name="flag" class="lead" /> Report
                    </div>
                  </div>
                </LimbDropdown>
              </header>
              <article>{{ review.review }}</article>
            </div>
            <div v-if="details.reviews.length > 5" class="text-center">
              <a href="#" class="flat primary button"
                >More reviews ({{ details.reviews.length - 5 }})</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer auto-t-bordered flexbox" style="gap: 0.5em">
      <button class="primary button">
        <SvgIcon name="public" class="lead" /> Visit Business Page
      </button>
      <button class="flat button md-and-down-hidden">
        <SvgIcon name="follow" class="lead" /> Follow
      </button>
      <div style="display: flex; gap: 1em; margin-left: auto">
        <button
          class="flat circular button"
          v-tooltip:aria.unblocking
          aria-label="Save card"
        >
          <SvgIcon name="bookmark_add" />
        </button>
        <LimbDropdown
          :options="{ directionPriority: { x: 'left', y: 'top' } }"
          v-tooltip:aria.unblocking
          aria-label="More options"
          class="flat circular button"
        >
          <SvgIcon name="more_vert" />
          <div class="drop menu">
            <div class="item">
              <SvgIcon name="follow" class="lead" /> Follow page
            </div>
            <div class="item">
              <SvgIcon name="bookmark_add" class="lead" /> Save card
            </div>
            <div class="item"><SvgIcon name="share" class="lead" /> Share</div>
            <div class="item">
              <SvgIcon name="report" class="lead" /> Report page
            </div>
          </div>
        </LimbDropdown>
      </div>
    </div>
  </div>
</template>
