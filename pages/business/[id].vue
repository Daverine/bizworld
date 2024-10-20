<script setup>
definePageMeta({ layout: 'details' });
const route = useRoute();
const details = ref({
  "type": "business",
  "bizName": "Emmadave Computer Technology Services",
  "mainCategory": "Computer repair services",
  "logo": "/images/logo-sq.png",
  "coverPic": "/images/ads.jpg",
  "bizUrl": "https://www.edtech.com",
  "description": "We offer technical services on laptop and desktop. We offer computer tech training We also do web development.",
  "verified": true,
  "rating": { "rate": 3.5, "raters": 30 },
  "contacts": {
    "tel": "08157483233",
    "email": "contact_us@edtech.com"
  },
  "location": {
    "address": "3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102",
    "city": "Abeokuta",
    "state": "Ogun State",
    "url": "https://goo.gl/maps/y9ExQLSq37FL6EHm6"
  },
  "reviews": [
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 4,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 3,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 3,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 2,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 2,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 2,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 4,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 4,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 4,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 4,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    },
    {
      "userid": "e8e34",
      "username": "daverine",
      "userpic": "/images/profile_pic.jpg",
      "anonymous": false,
      "timestamp": 1694061107318,
      "rating": 4,
      "review": "I enjoy my experience doing business with you guys. keep it up."
    }
  ],
  "hours": [
    [-1],
    ["8:30", "18:30"],
    ["8:30", "18:30"],
    ["15:30", "18:30"],
    ["8:30", "18:30"],
    [-1],
    ["8:30", "18:30"]
  ],
  "template": {
    "userid": "e8e34",
    "username": "daverine",
    "userpic": "/images/profile_pic.jpg",
    "anonymous": false,
    "timestamp": 1694061107318,
    "rating": 4,
    "review": "I enjoy my experience doing business with you guys. keep it up."
  }
});
const divider = useTemplateRef('divider');
const dgContent = useTemplateRef('dgContent');
const activeFixedMenu = ref(false);

function nextOpenDay(hours) {
  let
    ex = new Date().getDay() === 6 ? 0 : new Date().getDay() + 1,
    i = 1,
    result
    ;

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
  return `${(Number(time[0]) % 12) || 12}:${time[1]}${Number(time[0]) >= 12 ? 'PM' : 'AM'}`;
}

function whatDay(index) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
}

function handleScroll() {
  if (divider.value.getBoundingClientRect().top <= 210) {
    activeFixedMenu.value = true;
  }
  else { activeFixedMenu.value = false; }
}

onUpdated(() => {
  if (props.details) dgContent.value.dispatchEvent(new Event("scroll"))
});
</script>

<template>
  <main class="container-md">
    <header class="flexbox flex-column" style="gap: 1rem;">
      <div class="dm-header a-block flexbox padded" :class="{ active: activeFixedMenu }">
        <div class="content h6 semibold 0-margined truncate">Business page summary</div>
        <button class="button">Visit Business Page</button>
      </div>
      <div class="dm-display" style="position: relative; padding-top: calc(100% / 5 * 2);">
        <img class="image"
          style="position: absolute; height: 100%; width: 100%; object-fit: cover; top: 0px; left: 0px;"
          :src="details.coverPic" alt="Business page cover picture" />
      </div>
      <div class="flexbox dm-gap" style="gap: 2rem;">
        <div class="dm-logo" style="position: relative; width: max-content; line-height: 0;">
          <img class="logo image circular"
            style="width: 8rem; height: 8rem; object-fit: contain; border: 2px solid gray;" :src="details.logo"
            alt="Business Logo" />
          <SvgIcon v-if="details.verified" name="verified_sp" v-tooltip.unblocking data-tooltip="Verified"
            style="position: absolute; bottom: 0px; right: 0px;" />
        </div>
        <div class="dm-heading flexible">
          <h3 class="dm-title">{{ details.bizName }}</h3>
          <div class="faint-text-v1">{{ details.mainCategory }}</div>
        </div>
      </div>
      <div class="dm-gap flexbox flex-separate">
        <div class="semibold" v-tooltip.unblocking data-tooltip="Average Rate (Number of raters)">
          <SvgIcon name="star_filled" class="yellow-text small r-spaced" />
          <span>{{ `${(details.reviews.reduce((n, i) => n + i.rating, 0) / details.reviews.length).toFixed(1)}
            (${details.reviews.length} reviews)` }}</span>
        </div>
        <div>
          <span v-tooltip.unblocking
            :data-tooltip="details.hours[new Date().getDay()][0] === -1 ? 'Did not open today at all.' : `Open today by ${to12hrsTime(details.hours[new Date().getDay()][0])} and closes by ${to12hrsTime(details.hours[new Date().getDay()][1])}.`">
            <SvgIcon name="today" class="small r-spaced" />
            <span class="semibold">
              <template
                v-if="details.hours[new Date().getDay()][0] === -1 || getMinutes(details.hours[new Date().getDay()][0]) > getMinutes(`${new Date().getHours()}:${new Date().getMinutes()}`) || getMinutes(details.hours[new Date().getDay()][1]) <= getMinutes(`${new Date().getHours()}:${new Date().getMinutes()}`)">
                <span class="error-text">Closed. </span>
                <span
                  v-if="typeof (details.hours[new Date().getDay()][0]) === 'string' && getMinutes(details.hours[new Date().getDay()][0]) > getMinutes(`${new Date().getHours()}:${new Date().getMinutes()}`)">Opens
                  {{ to12hrsTime(details.hours[new Date().getDay()][0]) }} Today</span>
                <span v-else>
                  Opens
                  {{
                    details.hours[new Date().getDay() === 6 ? 0 : new Date().getDay() + 1][0] !== -1
                      ? `${to12hrsTime(details.hours[new Date().getDay() === 6 ? 0 : new Date().getDay() +
                        1][0])}
                  Tomorrow`
                      : `${to12hrsTime(details.hours[nextOpenDay(details.hours)][0])} on
                  ${whatDay(nextOpenDay(details.hours))}`
                  }}
                </span>
              </template>
              <template v-else>
                <span
                  v-if="getMinutes(details.hours[new Date().getDay()][1]) - getMinutes(`${new Date().getHours()}:${new Date().getMinutes()}`) <= 60"
                  class="warning-text">Closes soon. </span>
                <span v-else class="success-text">Open. </span>
                <span>Closes {{ details.hours[new Date().getDay()][1] }}</span>
              </template>
            </span>
          </span>
          <SvgIcon name="info" class="mini l-spaced faint-text-v2" v-tooltip.unblocking
            data-tooltip="Note that the given detail is generated using your system time relative to the Business location timezone." />
        </div>
      </div>
      <div class="flexbox" style="gap: 0.5em;">
        <button class="primary button">
          <SvgIcon name="public" class="lead" /> Visit Business Page
        </button>
        <button class="flat button md-and-down-hidden">
          <SvgIcon name="follow" class="lead" /> Follow
        </button>
        <div style="display: flex; gap: 1em; margin-left: auto;">
          <button class="flat circular button" v-tooltip.unblocking data-tooltip="Save card">
            <SvgIcon name="bookmark_add" />
          </button>
          <Dropdown :options="{ directionPriority: { x: 'left', y: 'top' } }" v-tooltip.unblocking
            data-tooltip="More options" class="flat circular button">
            <SvgIcon name="more_vert" />
            <div class="drop menu">
              <div class="item">
                <SvgIcon name="follow" class="lead" /> Follow page
              </div>
              <div class="item">
                <SvgIcon name="bookmark_add" class="lead" /> Save card
              </div>
              <div class="item">
                <SvgIcon name="share" class="lead" /> Share
              </div>
              <div class="item">
                <SvgIcon name="report" class="lead" /> Report page
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
      <hr ref="divider" />
    </header>
    <div class="content 0-padding">
      <div style="padding: 1em 1.5em;">
        <div>
          <table class="dm-info table borderless">
            <tbody>
              <tr>
                <td>
                  <SvgIcon name="domain" />
                </td>
                <td>
                  {{ details.description }}
                  <a :href="`${details.bizUrl}/about_us`" target="_blank">Learn more.</a>
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="location_on" />
                </td>
                <td>
                  {{ `${details.location.address}, ${details.location.city}, ${details.location.state}.` }}
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="call" />
                </td>
                <td>
                  {{ details.contacts.tel }}
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="public" />
                </td>
                <td class="link">
                  <a :href="details.bizUrl" target="_blank">{{ details.bizUrl }}</a>
                </td>
              </tr>
              <tr>
                <td>
                  <SvgIcon name="today" />
                </td>
                <td>
                  <table class="table selectable compact clear 0-margined">
                    <tbody>
                      <tr v-for="(hour, i) in details.hours" :key="i" :class="{ 'active': new Date().getDay() === i }">
                        <td>{{ whatDay(i) }}</td>
                        <td>
                          {{ hour[0] === -1 ? 'Closed' : `${to12hrsTime(hour[0])} - ${to12hrsTime(hour[1])}` }}
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
          <div class="flexbox" style="flex-direction: row-reverse;">
            <div class="col 6-width md-2-width">
              <div class="centered"
                :set="rating = (details.reviews.reduce((n, i) => n + i.rating, 0) / details.reviews.length).toFixed(1)">
                <div class="semibold" style="font-size: 3em;">
                  {{ (details.reviews.reduce((n, i) => n + i.rating, 0) / details.reviews.length).toFixed(1) }}
                </div>
                <div class="rating small yellow-text">
                  <SvgIcon v-for="i in Math.floor(rating)" name="star_filled" />
                  <SvgIcon v-if="rating - Math.floor(rating) >= 0.5" name="star_half" />
                  <SvgIcon v-for="i in (5 - Math.round(rating))" name="star" />
                </div>
                <div>{{ `${details.reviews.length} reviews` }}</div>
              </div>
            </div>
            <div class="col 6-width md-4-width">
              <table class="table compact borderless 0-margined">
                <tbody>
                  <tr v-for="i in 5" :set="(n = 6 - i)">
                    <td style="width: 15px;">{{ n }}</td>
                    <td>
                      <div class="progress-bar">
                        <div class="determinate"
                          :style="`width: ${details.reviews.filter((elem) => elem.rating === n).length * 100 / details.reviews.length}%;`">
                        </div>
                      </div>
                    </td>
                    <td style="width: 15px; text-align: right;">
                      {{ `(${details.reviews.filter((elem) => elem.rating === n).length})` }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="centered small semibold italic">
            Patronize {{ details.bizName }} to write a review.
            <button class="button">
              <SvgIcon name="rate_review" class="lead" />
              Write a review
            </button>
          </div>
        </div>
        <hr />
        <div>
          <div class="dm-gap">
            <div class="sub heading">Latest Reviews</div>
          </div>
          <div class="dm-reviews">
            <div v-for="a in Math.min(5, details.reviews.length)" class="dm-review"
              :set="review = details.reviews[a - 1]">
              <header>
                <div class="avatar circular image" style="background-color: var(--on-surface-v1);">
                </div>
                <div class="content">
                  <div class="bold">{{ review.username }}</div>
                  <div class="flexbox flex-wrap flex-separate" style="gap: 0.5em;">
                    <div class="rating mini yellow-text" :set="rating = review.rating">
                      <SvgIcon v-for="i in Math.floor(rating)" name="star_filled" />
                      <SvgIcon v-if="rating - Math.floor(rating) >= 0.5" name="star_half" />
                      <SvgIcon v-for="i in (5 - Math.round(rating))" name="star" />
                    </div>
                    <div>Render Time here.</div>
                  </div>
                </div>
                <Dropdown>
                  <SvgIcon name="more_vert" />
                  <div class="drop menu small">
                    <div class="item">
                      <SvgIcon name="flag" class="lead" /> Report
                    </div>
                  </div>
                </Dropdown>
              </header>
              <article>{{ review.review }}</article>
            </div>
            <div v-if="details.reviews.length > 5" class="centered">
              <a href="#" class="flat primary button">More reviews ({{ details.reviews.length - 5 }})</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer auto-t-bordered flexbox" style="gap: 0.5em;">
      <button class="primary button">
        <SvgIcon name="public" class="lead" /> Visit Business Page
      </button>
      <button class="flat button md-and-down-hidden">
        <SvgIcon name="follow" class="lead" /> Follow
      </button>
      <div style="display: flex; gap: 1em; margin-left: auto;">
        <button class="flat circular button" v-tooltip.unblocking data-tooltip="Save card">
          <SvgIcon name="bookmark_add" />
        </button>
        <Dropdown :options="{ directionPriority: { x: 'left', y: 'top' } }" v-tooltip.unblocking
          data-tooltip="More options" class="flat circular button">
          <SvgIcon name="more_vert" />
          <div class="drop menu">
            <div class="item">
              <SvgIcon name="follow" class="lead" /> Follow page
            </div>
            <div class="item">
              <SvgIcon name="bookmark_add" class="lead" /> Save card
            </div>
            <div class="item">
              <SvgIcon name="share" class="lead" /> Share
            </div>
            <div class="item">
              <SvgIcon name="report" class="lead" /> Report page
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  </main>
</template>

<!-- <style lang="scss">
.dm-header {
  position: absolute;
  width: 100%;
  align-items: center;
  background-color: transparent;
  z-index: var(--z-level-3);
  transition: background-color ease 250ms;

  &.active {
    background-color: var(--surface);
    box-shadow: var(--z-depth-2);
  }

  &>.content {
    transition: opacity ease 250ms;
  }

  &:not(.active)>.content {
    opacity: 0;
  }

  &>.trailing.icon {
    height: 2em !important;
    width: 2em !important;
  }

  &:not(.active)>.trailing.icon {
    background-color: var(--surface) !important;
    box-shadow: var(--z-depth-1);
  }
}

.dm-display {
  position: relative;
  width: 100%;
  max-width: var(--display-width);
  flex: 0 0 auto;
  border-radius: inherit !important;

  .dm-media {
    position: relative;
    width: 100%;
    height: 0rem;

    canvas,
    .dm-dps {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0px;
      left: 0px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

.dm-gap {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}

.dm-logo {
  position: relative;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  background-color: #fff;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 2px solid gray;
}

.dm-title {
  font-size: 1.375em;
  font-weight: var(--semibold-weight);
  color: var(--on-surface);
  line-height: 1.125 !important;
  width: 100%;
  padding-bottom: 0.125em;
  margin: 0 0 0.125em !important;
}

.dm-info td {
  vertical-align: top;

  &:first-child>i.icon {
    color: var(--primary);
  }
}

.dm-review {
  &>header {
    display: flex;
    gap: 1em;
    align-items: center;
    width: 100%;

    &>.avatar.image {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--surface-v5);
    }

    &>.content {
      flex: 1 1 auto;
    }
  }
}

.dm-heading {
  width: calc(100% - 4.25rem - 0.5rem);
}

.dm-media {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: calc(100% / 9 * 5); // 9:5 aspect ratio
}
</style> -->