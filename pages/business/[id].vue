<script setup>
definePageMeta({ layout: 'details' });
const route = useRoute();
const details = ref({
  type: 'business',
  bizName: 'Emmadave Computer Technology Services',
  mainCategory: 'Computer repair services',
  logo: '/images/logo-sq.png',
  coverPic: '/images/ads.jpg',
  bizUrl: 'https://www.edtech.com',
  description:
    'We offer technical services on laptop and desktop. We offer computer tech training We also do web development.',
  verified: true,
  rating: { rate: 3.5, raters: 30 },
  contacts: {
    tel: '08157483233',
    email: 'contact_us@edtech.com',
  },
  location: {
    address: '3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102',
    city: 'Abeokuta',
    state: 'Ogun State',
    url: 'https://goo.gl/maps/y9ExQLSq37FL6EHm6',
  },
  reviews: [
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 3,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 3,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 2,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
    {
      userid: 'e8e34',
      username: 'daverine',
      userpic: '/images/profile_pic.jpg',
      anonymous: false,
      timestamp: 1694061107318,
      rating: 4,
      review: 'I enjoy my experience doing business with you guys. keep it up.',
    },
  ],
  hours: [
    [-1],
    ['8:30', '18:30'],
    ['8:30', '18:30'],
    ['15:30', '18:30'],
    ['8:30', '18:30'],
    [-1],
    ['8:30', '18:30'],
  ],
  template: {
    userid: 'e8e34',
    username: 'daverine',
    userpic: '/images/profile_pic.jpg',
    anonymous: false,
    timestamp: 1694061107318,
    rating: 4,
    review: 'I enjoy my experience doing business with you guys. keep it up.',
  },
});
const divider = useTemplateRef('divider');
const dgContent = useTemplateRef('dgContent');
const activeFixedMenu = ref(false);
const feedStore = useFeedStore();

onMounted(() => feedStore.getUpdate());

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
</script>

<template>
  <main class="grid-layout">
    <header
      class="flexbox dm-gap"
      style="padding-top: 0.5rem; align-items: center; gap: 1rem"
    >
      <div
        class="dm-logo flex-none"
        style="position: relative; width: max-content; line-height: 0"
      >
        <img
          class="logo image"
          style="width: 5rem; height: 5rem; object-fit: contain"
          :src="details.logo"
          alt="Business Logo"
        />
        <SvgIcon
          v-if="details.verified"
          name="verified_sp"
          v-tooltip.unblocking
          data-tooltip="Verified"
          style="position: absolute; bottom: 0.5em; right: 0.5em"
        />
      </div>
      <div class="dm-heading flexible">
        <h5 class="dm-title">{{ details.bizName }}</h5>
        <div class="faint-text">{{ details.mainCategory }}</div>
      </div>
      <button class="flex-none flat button auto-l-margined md-and-down-hidden">
        <SvgIcon name="follow" class="lead" /> Follow
      </button>
    </header>
    <div
      v-scrollPin="{ top: 64 }"
      class="fluid pin-top-blend z-level-2 r-aligned menu"
      style="height: 3.5rem; margin-bottom: 0.75rem;"
    >
      <div class="container items">
        <div class="xhover l-aligned item as-icon">
          <img
            :src="details.logo"
            alt="site logo"
            class="show-onpinned logo-lg site-logo"
          />
        </div>
        <div class="items md-and-down-hidden">
          <div class="item">Home</div>
          <div class="item">Feeds</div>
          <div class="item">Products</div>
          <div class="item">Services</div>
          <div class="item">About Us</div>
        </div>
        <div
          class="item open-sidepanel md-and-up-hidden"
          data-target="bizsidepanel"
        >
          <SvgIcon name="menu" class="lead" />
          Menu
          <SidePanel class="right" id="bizsidepanel">
            <div class="padded panel">
              <div class="vertical menu">
                <div class="centered item exit-sidepanel">
                  <SvgIcon name="arrow_back" />
                </div>
                <router-link to="/" class="xhover centered item exit-sidepanel">
                  <img
                    :src="details.logo"
                    alt="site logo"
                    class="logo-lg site-logo"
                  />
                </router-link>
                <div class="item">Home</div>
                <div class="item">Feeds</div>
                <div class="item">Products</div>
                <div class="item">Services</div>
                <div class="item">About Us</div>
              </div>
              <hr />
              <footer style="margin-top: auto">
                <Shareables name="color_scheme" />
                <Shareables name="copyright" />
              </footer>
            </div>
          </SidePanel>
        </div>
        <Dropdown
          :options="{ directionPriority: { x: 'left' } }"
          v-tooltip.unblocking
          data-tooltip="More options"
          class="item"
        >
          <SvgIcon name="more_horiz" />
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
        </Dropdown>
      </div>
    </div>
    <div
      class="dm-display"
      style="position: relative; padding-top: calc(100% / 6 * 2)"
    >
      <img
        class="image open-lightbox"
        data-target="lightbox1"
        :data-lightbox="details.coverPic"
        style="
          position: absolute;
          height: 100%;
          width: 100%;
          object-fit: cover;
          top: 0px;
          left: 0px;
        "
        :src="details.coverPic"
        alt="Business page cover picture"
      />
    </div>
    <div
      class="flexbox guttered flex-wrap"
      style="align-items: center; padding: 1rem"
    >
      <SvgIcon class="flex-none" name="domain" />
      <div class="flexible">
        {{ details.description }}
        <a :href="`${details.bizUrl}/about_us`" target="_blank">Learn more.</a>
      </div>
      <button class="flex-none auto-l-margined primary compact button">
        Contact Us
      </button>
    </div>
    <div
      class="flexbox guttered flex-wrap surface-v1-bg"
      style="align-items: center; padding: 1rem"
    >
      <SvgIcon class="flex-none" name="today" />
      <div class="flexible">
        <span
          v-tooltip.unblocking
          :data-tooltip="
            details.hours[new Date().getDay()][0] === -1
              ? 'Did not open today at all.'
              : `Open today by ${to12hrsTime(
                  details.hours[new Date().getDay()][0]
                )} and closes by ${to12hrsTime(
                  details.hours[new Date().getDay()][1]
                )}.`
          "
        >
          <span
            >We are currently
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
              <span class="error-text">closed. </span>
              <span
                v-if="
                  typeof details.hours[new Date().getDay()][0] === 'string' &&
                  getMinutes(details.hours[new Date().getDay()][0]) >
                    getMinutes(
                      `${new Date().getHours()}:${new Date().getMinutes()}`
                    )
                "
              >
                Opens
                {{ to12hrsTime(details.hours[new Date().getDay()][0]) }} Today.
              </span>
              <span v-else>
                We'll open
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
                      )} Tomorrow. `
                    : `${to12hrsTime(
                        details.hours[nextOpenDay(details.hours)][0]
                      )} on
                ${whatDay(nextOpenDay(details.hours))}. `
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
              <span>Closes {{ details.hours[new Date().getDay()][1] }}. </span>
            </template>
          </span>
          <a href="#">Check our business hours</a>
        </span>
        <SvgIcon
          name="info"
          class="mini l-spaced faint-text-more"
          v-tooltip.unblocking
          data-tooltip="Note that the given detail is generated using your device time relative to the Business location timezone."
        />
      </div>
      <button class="flex-none auto-l-margined compact button">
        Shedule Visit
      </button>
    </div>
    <section>
      <div class="heading" style="padding: 1rem">New and Trending products</div>
      <div class="flexbox guttered flex-wrap justify-center">
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
        <PageProduct class="flex-none" />
      </div>
    </section>
    <section>
      <div class="heading" style="padding: 1rem">Our services</div>
      <div class="flexbox guttered flex-wrap justify-center">
        <PageService class="flex-none" />
        <PageService class="flex-none" />
        <PageService class="flex-none" />
        <PageService class="flex-none" />
      </div>
    </section>
    <section class="posts-sec">
      <div
        v-scrollPin="{
          top: 136,
          bottom: 16,
          sticky: true,
        }"
        class="page-aside biz-pin text-center"
      >
        <div
          class="dm-logo flex-none"
          style="position: relative; width: max-content; line-height: 0"
        >
          <img
            class="logo image"
            style="width: 5rem; height: 5rem; object-fit: contain"
            :src="details.logo"
            alt="Business Logo"
          />
          <SvgIcon
            v-if="details.verified"
            name="verified_sp"
            v-tooltip.unblocking
            data-tooltip="Verified"
            style="position: absolute; bottom: 0.5em; right: 0.5em"
          />
        </div>
        <h6 class="dm-title text-center">{{ details.bizName }}</h6>
        <div class="faint-text">{{ details.mainCategory }}</div>
        <p>
          <span
            v-tooltip.unblocking
            :data-tooltip="
              details.hours[new Date().getDay()][0] === -1
                ? 'Did not open today at all.'
                : `Open today by ${to12hrsTime(
                    details.hours[new Date().getDay()][0]
                  )} and closes by ${to12hrsTime(
                    details.hours[new Date().getDay()][1]
                  )}.`
            "
          >
            <span
              >We are currently
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
                <span class="error-text">closed. </span>
                <span
                  v-if="
                    typeof details.hours[new Date().getDay()][0] === 'string' &&
                    getMinutes(details.hours[new Date().getDay()][0]) >
                      getMinutes(
                        `${new Date().getHours()}:${new Date().getMinutes()}`
                      )
                  "
                >
                  Opens
                  {{ to12hrsTime(details.hours[new Date().getDay()][0]) }}
                  Today.
                </span>
                <span v-else>
                  We'll open
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
                    Tomorrow. `
                      : `${to12hrsTime(
                          details.hours[nextOpenDay(details.hours)][0]
                        )} on
                    ${whatDay(nextOpenDay(details.hours))}. `
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
                  >Closes {{ details.hours[new Date().getDay()][1] }}.
                </span>
              </template>
            </span>
            <a href="#">Check our business hours</a>
          </span>
          <SvgIcon
            name="info"
            class="mini l-spaced faint-text-more"
            v-tooltip.unblocking
            data-tooltip="Note that the given detail is generated using your device time relative to the Business location timezone."
          />
        </p>
        <div class="flexbox guttered">
          <button class="primary button">Contact Us</button>
          <button class="button">View Location</button>
        </div>
      </div>
      <div class="posts-main">
        <div class="heading">Updates from us</div>
        <FeedCard
          v-for="(feed, i) in feedStore.feeds"
          :key="i"
          :details="feed"
        />
        <button class="fluid button" style="max-width: 500px">
          View more posts
        </button>
      </div>
    </section>
    <section class="text-center" style="padding: 6.25rem">
      <h3>Thanks for visiting our website.</h3>
      <p class="container-text huge semibold">
        We hope you got what you’re looking for. You can make inquiries if not.
        We hope to see you soon.
      </p>
      <button class="secondary button" style="margin-top: 1rem">
        Start Chat
      </button>
    </section>
    <footer class="fluid grid-layout surface-v3-bg" style="padding: 4rem 0rem">
      <div class="footer-main">
        <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
          <div
            class="dm-logo flex-none"
            style="position: relative; width: max-content; line-height: 0"
          >
            <img
              class="logo image"
              style="width: 4rem; height: 4rem; object-fit: contain"
              :src="details.logo"
              alt="Business Logo"
            />
            <SvgIcon
              v-if="details.verified"
              name="verified_sp"
              v-tooltip.unblocking
              data-tooltip="Verified"
              class="mini"
              style="position: absolute; bottom: 0.5em; right: 0.5em"
            />
          </div>
          <h6 class="dm-title">{{ details.bizName }}</h6>
          <!-- <div class="faint-text">{{ details.mainCategory }}</div> -->
          <div class="flexible">
            {{ details.description }}
            <a :href="`${details.bizUrl}/about_us`" target="_blank"
              >Learn more.</a
            >
          </div>
          <div>
            <div class="bold" style="margin-bottom: 0.75rem">
              Earned barges on Bizword
            </div>
            <div style="display: flex; gap: 1.5rem; margin-bottom: 1rem">
              <div class="ft-badge">
                <Badges name="verified" style="font-size: 3rem" />
                <div class="semibold">Verified</div>
              </div>
              <div class="ft-badge">
                <Badges name="escrow" style="font-size: 3rem" />
                <div class="semibold">Trade Assurance</div>
              </div>
              <div class="ft-badge">
                <Badges name="5years" style="font-size: 3rem" />
                <div class="semibold">Sustainable</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
          <div class="bold">Menus</div>
          <div class="text vertical menu">
            <NuxtLink class="item">Home</NuxtLink>
            <NuxtLink class="item">Feeds</NuxtLink>
            <NuxtLink class="item">Products</NuxtLink>
            <NuxtLink class="item">Services</NuxtLink>
            <NuxtLink class="item">About us</NuxtLink>
          </div>
        </div>
        <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
          <div class="bold">Contact Us</div>
          <div>
            <p>Start chat with us directly from here.</p>
            <button class="secondary button">Start Chat</button>
          </div>
          <div>
            <div class="bold">Telephone</div>
            <p>{{ details.contacts.tel }}</p>
          </div>
          <div>
            <div class="bold">Our physical location</div>
            <p>
              {{
                `${details.location.address}, ${details.location.city}, ${details.location.state}.`
              }}
            </p>
          </div>
        </div>
        <div class="flexbox flex-column" style="flex-basis: 20%; gap: 1.5rem">
          <div class="bold nowrap-text">Social media</div>
          <div class="vertical text menu">
            <a class="item" href="#">Facebook</a>
            <a class="item" href="#">Instagram</a>
            <a class="item" href="#">Twitter</a>
            <a class="item" href="#">LinkedIn</a>
            <a class="item" href="#">Youtube</a>
          </div>
        </div>
      </div>
    </footer>
  </main>
</template>

<style lang="scss">
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

  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr;

    & > .page-aside {
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
  align-self: start;
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
  filter: saturate(0.1);
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
