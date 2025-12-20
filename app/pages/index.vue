<script lang="ts" setup>
const userStore = useUserStore();
</script>

<template>
  <header class="hm-header">
    <!-- Index unique menu -->
    <div class="menu">
      <div
        class="container-lg items"
        style="border-radius: var(--default-radius)"
      >
        <button
          class="item as-icon open-sidepanel"
          v-tooltip:aria.unblocking
          aria-label="Menu"
          data-target="msidepanel"
        >
          <Icon name="material-symbols:menu-rounded" />
        </button>
        <div class="items max-md:hidden">
          <NuxtLink :to="{ name: 'new-shop' }" class="item">
            Have a shop online
          </NuxtLink>
          <LimbDropdown class="item">
            Support
            <Icon
              name="material-symbols:expand-more-rounded"
              class="trailing"
            />
            <div class="drop menu">
              <Shareables name="supports" />
            </div>
          </LimbDropdown>
        </div>
        <div class="items r-aligned">
          <div class="item open-modal" data-target="explore-modal">
            <Icon name="material-symbols:manage-search-rounded" class="lead" />
            Explore
          </div>
          <template v-if="userStore.auth">
            <div
              class="as-icon item"
              v-tooltip:aria.unblocking
              aria-label="Notifications"
            >
              <Icon name="material-symbols:notifications-outline-rounded" />
            </div>
            <LimbDropdown
              :options="{ directionPriority: { x: 'left' } }"
              v-tooltip:aria.unblocking
              aria-label="Your profile"
              class="xhover browse as-icon item"
            >
              <NuxtImg
                preset="logo"
                :src="userStore.userData.profileImg"
                alt="profile"
                class="rounded-full logo"
              />
              <Shareables name="profile_menu" />
            </LimbDropdown>
          </template>
          <template v-else>
            <LimbDropdown class="as-icon item sm:hidden">
              <Icon
                name="material-symbols:person-add-outline-rounded"
                class="lead"
              />
              Account
              <div class="drop menu">
                <div class="item open-modal" data-target="login-modal">
                  Log in
                </div>
                <div class="item open-modal" data-target="register-modal">
                  Sign Up
                </div>
              </div>
            </LimbDropdown>
            <div class="items max-sm:hidden">
              <div class="item open-modal" data-target="login-modal">
                Log in
              </div>
              <div class="xhover item px-0">
                <button
                  class="primary button open-modal"
                  data-target="register-modal"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <SearchBoxMain />
    <div
      role="button"
      class="mouse_scroll"
      @click="
        (
          $event.currentTarget as HTMLElement
        )?.parentElement?.nextElementSibling?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      "
    >
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div>
        <span class="m_scroll_arrows unu"></span>
        <span class="m_scroll_arrows doi"></span>
        <span class="m_scroll_arrows trei"></span>
      </div>
    </div>
  </header>
  <div
    class="menu sticky z-level-2 surface-bg"
    style="top: 0px; border-bottom: 1px solid var(--outline)"
  >
    <Shareables name="main_menu" />
  </div>
  <article id="firstSec">
    <section class="sec-block">
      <div class="big text-center container-text">
        <h1>
          Do <span class="primary-text">business</span> at your
          <span class="primary-text">conveniency</span>
        </h1>
        <p>
          Perceive Bizworld as a massive online marketplace where you meet a
          variety of businesses and careers showcasing themselves.
        </p>
        <p>
          You can get updates from stores, offices, and businesses in general.
          You can rate and write reviews on their offered products and services.
        </p>
        <div v-if="!userStore.auth" class="text-center">
          <button
            class="primary button open-modal"
            data-target="register-modal"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </section>
    <section class="sec-block">
      <div class="container grid grid-cols-1 md:grid-cols-2">
        <div class="col">
          <NuxtImg
            format="webp"
            sizes="800px"
            densities="1x"
            src="/images/explore.jpg"
            alt="picture depicting explore"
            class="rounded-sm"
          />
        </div>
        <div class="col container-text big">
          <div>
            <h2>
              <span class="primary-text">Explore</span> businesses around you
              without leaving <span class="primary-text">your spot</span>
            </h2>
            <p>
              You can browse for businesses based on listed categories of
              commonly needed products and services. You can compare enterprises
              and determine where you should get things done.
            </p>
            <ul>
              <li>Find the category of service or shopping you need</li>
              <li>Compare distance, ratings and reviews of businesses</li>
              <li>View business info like location, what they offer, etc.</li>
              <li>Navigate to a business page to interact with the business</li>
              <li>
                Rate and write a review on a business based on your experience
              </li>
              <!-- Browse for products and services around you and know where to get things done without having to ask anyone. Our explore section displays businesses in categories of what they offer. So you can easily compare businesses there. If the category you are looking for is not there you can make use of seach instead.</li> -->
            </ul>
            <p>
              If you can not find the category of interest on our explore page,
              use the search feature instead.
            </p>
            <div class="text-center">
              <button
                class="primary button open-modal"
                data-target="explore-modal"
              >
                EXPLORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec-block">
      <div
        class="container grid grid-cols-1 md:grid-cols-2"
        style="direction: rtl"
      >
        <div class="col">
          <NuxtImg
            format="webp"
            sizes="800px"
            densities="1x"
            src="/images/qr.jpg"
            alt="picture depicting qr"
            class="rounded-sm"
          />
        </div>
        <div class="col container-text big" style="direction: ltr">
          <div>
            <h2>
              <span class="primary-text">Know</span> their products and services
              <span class="primary-text">without asking</span>
            </h2>
            <p>
              <em>BizWorld QR codes</em> are a convenient way to access
              information about businesses. These QR codes are often placed in
              public areas to make it easy for people to access a business’s
              page. You can use the QR code scanner on this page for such codes.
            </p>
            <!-- <p>Scan a business bizWorld QR Code and get to know what products or services a business offer. Businesses that have page(s) on bizWorld usually have their BizWorld QR Code pasted in public places to help people easyly access their page. You can utilize the QR scanner on this page on such Code and directly access a business page and explore their business world.</p> -->
            <div class="text-center">
              <button
                class="primary button open-modal"
                data-target="scanqr-modal"
              >
                SCAN QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="sec-block">
      <div class="big text-center container-text">
        <h2>
          Take <span class="primary-text">your business online</span> with ease
        </h2>
        <p>
          Are you a business owner? Do you want people to connect with your
          business with ease online? We have you covered. Click on the Get
          Started button below to create your microsite here on BizWorld today
          and get connected with new clients and customers.
        </p>
        <div class="text-center">
          <button class="primary button open-modal" data-target="create-biz">
            GET STARTED
          </button>
        </div>
      </div>
    </section>
  </article>
  <footer style="background-color: rgba(128, 128, 128, 0.1)">
    <div
      class="container flex gap-6 flex-wrap justify-between"
      style="padding: 2.75rem 1.25rem 1.25rem"
    >
      <div class="col">
        <div class="heading">
          <NuxtImg
            preset="logo"
            src="/images/logo.png"
            style="max-height: 1.25em"
          />
        </div>
        <div class="vertical text menu">
          <div class="item open-modal" data-target="search-modal">
            Business search
          </div>
          <div class="item open-modal" data-target="scanqr-modal">
            Scan QR code
          </div>
          <div class="item open-modal" data-target="explore-modal">
            Explore categories
          </div>
          <a href="#" class="item">Bring your business online</a>
          <a href="#" class="item">Showcase yourself</a>
        </div>
      </div>
      <div class="col">
        <div class="heading">Resources</div>
        <div class="vertical text menu">
          <a href="#" class="item">Help center</a>
          <a href="#" class="item">Blog</a>
          <a href="#" class="item">What’s a micro-site</a>
          <a href="#" class="item">About Us</a>
        </div>
      </div>
      <!-- <div class="col">
				<div class="heading">Business</div>
				<div class="vertical text menu">
					<a href="#" class="item">BizWorld</a>
					<a href="#" class="item">Linda - POS</a>
					<a href="#" class="item">School Management System</a>
				</div>
			</div> -->
      <div class="col">
        <div class="heading">Contacts</div>
        <div class="vertical text menu">
          <a href="#" class="item">+234000000000</a>
          <a href="#" class="item">info@bizworld.com</a>
          <a href="#" class="item">support@bizworld.com</a>
        </div>
        <button class="secondary compact button">Anonymous Feedback</button>
      </div>
      <div class="col">
        <div class="heading">Follow us</div>
        <div class="vertical text menu">
          <a href="#" class="item">LinkedIn</a>
          <a href="#" class="item">YouTube</a>
          <a href="#" class="item">Instagram</a>
          <a href="#" class="item">Facebook</a>
        </div>
      </div>
    </div>
    <div
      class="wrappable text menu"
      style="padding: 10px 0px; background-color: rgba(128, 128, 128, 0.1)"
    >
      <div class="container items">
        <div class="item">Terms of use</div>
        <div class="item">About us</div>
        <div class="item">Help</div>
        <div class="item">Settings</div>
        <div class="items r-aligned">
          <div class="item">@ Copyright 2023</div>
          <div class="item">Emmadave Inc.</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.hm-header {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.hm-searchbox {
  width: 100%;
  text-align: center;
  max-width: 600px;
  padding: 0px 1rem;
}

.sec-block {
  padding-top: 4.65rem;
  padding-bottom: 4.65rem;
}

.sec-block .col {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.mouse_scroll {
  display: block;
  width: 1.5rem;
  margin-bottom: 2rem;
}

.m_scroll_arrows {
  display: block;
  width: 0.3125rem;
  height: 0.3125rem;
  transform: rotate(45deg);

  border-right: 2px solid var(--on-surface);
  border-bottom: 2px solid var(--on-surface);
  margin: 0 0 0.1875rem 0.25rem;

  width: 1rem;
  height: 1rem;
}

.unu {
  margin-top: 1px;
}

.unu,
.doi,
.trei {
  animation: mouse-scroll 1s infinite;
}

.unu {
  animation-direction: alternate;
  animation-delay: alternate;
}

.doi {
  animation-delay: 0.2s;
  animation-direction: alternate;
  margin-top: -0.375rem;
}

.trei {
  animation-delay: 0.3s;
  animation-direction: alternate;
  margin-top: -0.375rem;
}

.mouse {
  height: 2.625rem;
  width: 1.5rem;
  border-radius: 0.875rem;
  transform: none;
  border: 2px solid var(--on-surface);
  top: 10.625rem;
}

.wheel {
  height: 0.3125rem;
  width: 0.125rem;
  display: block;
  margin: 0.3125rem auto;
  background-color: var(--on-surface);
  position: relative;
  height: 0.25rem;
  width: 0.25rem;
  border: 2px solid var(--on-surface);
  border-radius: 0.5rem;
}

.wheel {
  animation: mouse-wheel 0.6s linear infinite;
}

@keyframes mouse-wheel {
  0% {
    top: 1px;
  }

  25% {
    top: 0.125rem;
  }

  50% {
    top: 0.25rem;
  }

  75% {
    top: 0.125rem;
  }

  100% {
    top: 1px;
  }
}

@keyframes mouse-scroll {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>
