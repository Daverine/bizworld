<script setup>
definePageMeta({ layout: 'details' });
const route = useRoute();
const details = ref({
  "type": "service",
  "title": "Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW",
  "price": "N100,000",
  "currency": "Naira",
  "media": [['pic', '/images/product.jpeg']],
  "specifications": {
    "Type": "Laptop",
    "Condition": "Used",
    "Brand": "Dell",
    "Model": "Inspiron 5050",
    "Processor": "Intel Corel i5 5th Generation",
    "RAM": "8gb DDR3",
    "Storage": "256gb SSD M.2",
    "Display Size": "15.6\"",
    "Graphics": "Intel Graphics 3000 (64mb)"
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
  "bizData": {
    "logo": "/images/logo-sq.png",
    "bizName": "Emmadave Computer Technology Services",
    "bizUrl": "https://www.edtech.com",
    "mainCategory": "Computer repair services",
    "contacts": {
      "tel": "08157483233",
      "email": "contact_us@edtech.com"
    },
    "verified": true,
    "location": {
      "address": "3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102",
      "city": "Abeokuta",
      "state": "Ogun State",
      "url": "https://goo.gl/maps/y9ExQLSq37FL6EHm6"
    },
    "hours": [
      [-1],
      ["8:30", "18:30"],
      ["8:30", "18:30"],
      ["15:30", "18:30"],
      ["8:30", "18:30"],
      [-1],
      ["8:30", "18:30"]
    ]
  }
});
const divider = useTemplateRef('divider');
const dgContent = useTemplateRef('dgContent');
const activeFixedMenu = ref(false);
const feedStore = useFeedStore();

onMounted(() => feedStore.getUpdate());



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

</script>
<template>
  <main class="grid-layout" style="padding-top: 1rem;">
    <div class="prod-cont">
      <div class="sp-wrapper z-level-2 p-h dm-display">
        <div v-scrollPin="{ topSpacing: 72, ancestorGuarded: true, breakpoints: [{ maxWidth: 767, pinnable: false, }], }"
          class="dm-media">
          <Carousel>
            <div v-for="slide in details.media" class="cs-slide">
              <img v-if="slide[0] === 'pic'" :src="slide[1]" :data-lightbox="slide[1]" data-target="lightbox1"
                class="image" />
            </div>
          </Carousel>
        </div>
      </div>
      <div class="dm-details">
        <div class="dm-heading">
          <span v-tooltip.unblocking :data-tooltip="details.bizData.location.address" class="truncate"
            style="color: var(--on-surface-variant);">
            <SvgIcon name="location_on" class="mini r-spaced" />
            <span class="small semibold">{{ `${details.bizData.location.city}, ${details.bizData.location.state}`
              }}</span>
          </span>
          <h4 class="dm-title">{{ details.title }}</h4>
          <div class="dm-gap">
            <div v-tooltip.unblocking data-tooltip="Average Rate (Number of raters)">
              <SvgIcon name="star_filled" class="yellow-text small r-spaced" />
              <span class="semibold">{{ `${(details.reviews.reduce((n, i) => n + i.rating,
                0) / details.reviews.length).toFixed(1)} (${details.reviews.length} reviews)` }}</span>
            </div>
            <div>
              <span class="h5 bold 0-margined" style="color: var(--primary);">{{ details.price }}&nbsp;</span>
              <SvgIcon name="handshake" class="l-spaced small" v-if="details.negotiable" v-tooltip.unblocking
                data-tooltip="Negotiable" />
            </div>
          </div>
        </div>
        <hr ref="divider" />
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="overview" class="lead icon" />
          Product Overview
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <p>This product is suitable for office use and it also presentable. It has a long lasting battery and its
            capable of handling comming computer daily tasks.</p>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="list_alt" class="lead icon" />
          Specifications
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <table class="basic definition table">
            <tbody>
              <tr v-for="(value, key) in details.specifications">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="local_shipping" class="lead icon" />
          Delivery
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <div class="italic">No delivery service offered by seller.</div>
          <a href="https://www.bw.net/thirdparty-delivery" target="_blank" class="warning compact action note">
            <SvgIcon name="local_shipping" class="lead huge" />
            <div class="content">
              <div class="heading">Third-party Delivery</div>
              <div class="faint-text-v1">Click here to check our list of third-party delivery providers.</div>
            </div>
            <SvgIcon name="chevron_right" class="trailing" />
          </a>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="security" class="lead icon" />
          Buyer's Protection
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <div class="compact success note">
            <div class="lead">
              <SvgIcon name="verified_user" class="huge" />
            </div>
            <div class="content">
              <div class="heading">Escrow Payment</div>
              <div class="faint-text-v1">The seller receives escrow payment. So you can be assured to get your ordered
                product.</div>
            </div>
          </div>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="reviews" class="lead icon" />
          Ratings and Reviews
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <section>
            <div class="flexbox" style="flex-flow: row-reverse wrap;">
              <div class="col 6-width md-2-width">
                <div class="centered"
                  :set="rating = (details.reviews.reduce((n, i) => n + i.rating, 0) / details.reviews.length).toFixed(1)">
                  <div class="semibold" style="font-size: 3em;">{{ (details.reviews.reduce((n, i) => n + i.rating,
                    0) / details.reviews.length).toFixed(1) }}</div>
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
                      <td style="width: 15px; text-align: right;">{{ `(${details.reviews.filter((elem) => elem.rating
                        === n).length})` }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="centered">
              <span class="small semibold italic">Patronize {{ details.bizData.bizName }} to write a review.</span>
              <!-- <button class="button">
                                    <SvgIcon name="rate_review" class="lead" />
                                    Write a review
                                </button> -->
            </div>
          </section>
          <hr />
          <div>
            <div class="dm-gap">
              <div style="font-weight: var(--semibold-weight)">Reviews</div>
              <Dropdown :options="{ directionPriority: { x: 'left' } }" class="outlined small button">
                <SvgIcon name="sort" class="lead" />
                Sort
                <div class="drop menu">
                  <div class="item">Newest</div>
                  <div class="item">Highest</div>
                  <div class="item">Lowest</div>
                </div>
              </Dropdown>
            </div>
            <div class="dm-reviews">
              <div v-for="a in Math.min(5, details.reviews.length)" class="dm-review"
                :set="review = details.reviews[a - 1]">
                <header>
                  <div class="avatar image"><span class="huge">{{ review.username.split('')[0].toUpperCase() }}</span>
                  </div>
                  <div class="content">
                    <div class="bold">{{ review.username }}</div>
                    <div class="dm-gap" style="gap: 0.5em;">
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
              <div v-if="details.reviews.length > 5" class="centered"><a href="#" class="flat primary button">More
                  reviews ({{ details.reviews.length - 5 }})</a></div>
            </div>
          </div>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="store" class="lead icon" />
          Seller's Information
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="a-block collapsible">
          <div class="lead" style="position: relative; align-self: center;">
            <img :src="details.bizData.logo" class="loose avatar image" />
            <SvgIcon name="verified_sp" v-tooltip.unblocking data-tooltip="Verified" class="small green-text"
              style="position: absolute; bottom: 0px; right: 0px;" />
          </div>
          <div class="content">
            <a href="#" style="font-weight: var(--bold-weight);">{{ details.bizData.bizName }}</a>
            <div class="sc-gap">
              <span class="small semibold">{{ details.bizData.mainCategory }}</span>
              <span v-tooltip.unblocking :data-tooltip="details.bizData.location.address" class="truncate"
                style="color: var(--on-surface-variant);">
                <SvgIcon name="location_on" class="mini r-spaced" />
                <span class="small semibold">{{ `${details.bizData.location.city}, ${details.bizData.location.state}`
                  }}</span>
              </span>
            </div>
            <div class="semibold sc-gap">
              <span v-if="details.bizData.rating" class="semibold" v-tooltip.unblocking
                data-tooltip="Average Rate (Number of raters)">
                <SvgIcon name="star_filled" class="yellow-text mini r-spaced" />
                <span class="small">{{ `${details.bizData.rating.rate} (${details.bizData.rating.raters})` }}</span>
              </span>
              <span v-tooltip.unblocking
                :data-tooltip="details.bizData.hours[new Date().getDay()][0] < 0 ? 'Did not open today at all.' : `Open today by ${details.bizData.hours[new Date().getDay()][0]}:00 and closes by ${details.bizData.hours[new Date().getDay()][1]}:00.`">
                <SvgIcon name="today" class="mini r-spaced" />
                <span class="small">
                  <template
                    v-if="details.bizData.hours[new Date().getDay()][0] < 0 || details.bizData.hours[new Date().getDay()][0] > new Date().getHours() || details.bizData.hours[new Date().getDay()][1] <= new Date().getHours()">
                    <span class="error-text">Closed. </span>
                    <span v-if="details.bizData.hours[new Date().getDay()][0] > new Date().getHours()">Opens {{
                      details.bizData.hours[new Date().getDay()][0] }}</span>
                    <span else>
                      Opens
                      {{
                        details.bizData.hours[new Date().getDay() === 6 ? 0 : new Date().getDay() + 1][0] > -1
                          ? `${details.bizData.hours[new Date().getDay() === 6 ? 0 : new Date().getDay() + 1][0]}:00
                      Tomorrow`
                          : `${details.bizData.hours[nextOpenDay(details.bizData.hours)][0]} on
                      ${whatDay(nextOpenDay(details.bizData.hours))}`
                      }}</span>
                  </template>
                  <template v-else>
                    <span v-if="details.bizData.hours[new Date().getDay()][1] - new Date().getHours() < 2"
                      class="warning-text">Closes soon. </span>
                    <span v-else class="success-text">Open. </span>
                    <span>Closes {{ `${details.bizData.hours[new Date().getDay()][1]}:00` }}</span>
                  </template>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sp-wrapper fluid z-level-2 p-h dm-display">
      <div v-scrollPin="{ pinPriority: 'bottom', ancestorGuarded: true, }" class="prod-footer surface-bg">
        <div class="container flexbox"
          style="padding: 0.5rem 1rem; gap: 0.5em; box-shadow: 0px 5px 10px 5px var(--surface);">
          <button class="primary button">
            <SvgIcon name="chat" class="lead" /> Send Inquiry
          </button>
          <button class="secondary circular button">
            <SvgIcon name="call" />
          </button>
          <div style="display: flex; gap: 1em;">
            <button class="flat button md-and-down-hidden">
              <SvgIcon name="bookmark_add" class="lead" /> Save
            </button>
            <Dropdown :options="{ directionPriority: { x: 'left', y: 'top' } }" v-tooltip.unblocking
              data-tooltip="More options" class="flat circular button">
              <SvgIcon name="more_vert" />
              <div class="drop menu">
                <div class="item">
                  <SvgIcon name="category_search" class="lead" /> View related
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
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.prod-cont {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}

.show-onpinned {
  opacity: 0;
  transition: all 100ms ease;
}

.pinned .show-onpinned {
  opacity: 1;
}

.posts-sec {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto;
  gap: 1rem;
  margin-top: 5rem;

  @media only screen and (max-width : 1000px) {
    grid-template-columns: 1fr;

    &>.biz-pin {
      display: none;
    }
  }

}

.posts-main {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.page-aside {
  display: flex;
  border-radius: var(--sm-radius);
  border: 1px solid var(--outline);
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  max-width: 100%;
  padding: 1rem;
  align-items: center;
  flex-direction: column;
}

.ft-badge {
  filter: saturate(.1);
  text-align: center;
  color: transparent;

  &:hover {
    filter: saturate(1);
    color: inherit;
  }
}

.footer-main {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(4, 1fr);

  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 550px) {
    grid-template-columns: 1fr;
  }
}
</style>