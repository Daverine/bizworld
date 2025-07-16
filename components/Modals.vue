<script setup>
const searchStore = useSearchStore();
const userStore = useUserStore();

function popupSubmitSearch(e) {
  e.currentTarget
    .closest('.modal')
    .dispatchEvent(new CustomEvent('plconsole', { detail: 'close panel' }));
  searchStore.triggerSearch();
}
</script>
<template>
  <Modal id="search-modal">
    <div class="dialog self-scroll">
      <div class="header flexbox guttered">
        <div class="bold truncate">Make your business search here ...</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
      <div class="content">
        <form @submit.prevent="popupSubmitSearch">
          <label class="input fluid" style="font-size: 1.125rem">
            <Icon name="material-symbols:search-rounded" class="xhover" />
            <input
              v-model="searchStore.searchBox"
              type="search"
              autocomplete="off"
              placeholder="Your search here."
              class="subject"
              md-autofocus
            />
            <button
              type="button"
              title="Scan QR"
              class="icon open-modal exit-modal"
              data-target="scanqr-modal"
            >
              <Icon name="material-symbols:qr-code-scanner-rounded" />
            </button>
            <button
              type="button"
              title="Search location is set to Nigeria. Click to change it."
              class="icon open-modal"
              data-target=""
            >
              <Icon name="material-symbols:location-on-outline-rounded" />
            </button>
          </label>
          <div
            class="flexbox flexible-items lg-guttered"
            style="gap: 1rem; margin: 1rem auto 0px; max-width: 300px"
          >
            <button type="submit" class="fluid button">
              <Icon name="material-symbols:search-rounded" class="lead" />
              SEARCH
            </button>
            <button
              type="button"
              class="fluid button open-modal exit-modal"
              data-target="explore-modal"
            >
              EXPLORE
            </button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
  <Modal id="scanqr-modal">
    <div class="dialog self-scroll">
      <div class="header flexbox guttered">
        <div class="bold truncate">Scan Business QR</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
      <div class="content">
        <div
          class="text-center flexbox justify-center align-center"
          style="flex-flow: row wrap; min-height: 150px"
        >
          <svg
            width="59"
            height="45"
            viewBox="0 0 59 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.3332 13.747L1.58323 13.747L1.58323 43.4553L40.3332 43.4553L40.3332 13.747Z"
              class="ArIAXb"
            ></path>
            <path
              d="M40.3332 13.747L17.0832 13.747L17.0832 33.122L40.3332 33.122L40.3332 13.747Z"
              class="qOFLsb"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.614479 12.7783L6.74988 12.7783L6.74988 14.7158L2.55198 14.7158L2.55198 18.9137L0.614479 18.9137L0.614479 12.7783Z"
              fill="#BDC1C6"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M39.3644 42.4866L39.3644 38.2887L41.3019 38.2887L41.3019 44.4241L35.1665 44.4241L35.1665 42.4866L39.3644 42.4866Z"
              fill="#BDC1C6"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.614479 38.2887L2.55198 38.2887L2.55198 42.4866L6.74987 42.4866L6.74987 44.4241L0.614479 44.4241L0.614479 38.2887Z"
              fill="#BDC1C6"
            ></path>
            <path
              d="M19.6665 30.2531H58.4165L58.4165 0.544722H19.6665L19.6665 30.2531Z"
              fill="#AECBFA"
            ></path>
            <path
              d="M19.6665 21.8429L19.6665 30.2525L58.4168 30.2525L58.4168 19.7406L49.6667 12.4069C48.6234 11.5342 47.2931 11.0699 45.9272 11.1018C44.5614 11.1337 43.2547 11.6596 42.2542 12.5801L33.4166 20.7918L28.4166 17.2548C27.7332 16.7781 26.9013 16.5563 26.0684 16.6288C25.2354 16.7012 24.4554 17.0632 23.8666 17.6505L19.6665 21.8429Z"
              fill="#669DF6"
            ></path>
            <path
              d="M30.0056 12.9386C31.7315 12.9386 33.1306 11.5395 33.1306 9.8136C33.1306 8.08773 31.7315 6.68863 30.0056 6.68863C28.2798 6.68863 26.8807 8.08773 26.8807 9.8136C26.8807 11.5395 28.2798 12.9386 30.0056 12.9386Z"
              fill="#E8F0FE"
            ></path>
          </svg>
          <div class="fluid text-center faint-text semibold">
            Drag a business QR image here.
          </div>
        </div>
        <div class="no-spacing divider">OR</div>
        <div class="text-center" style="padding: 2em">
          <button class="primary button">Upload QR image</button>
        </div>
      </div>
    </div>
  </Modal>
  <Modal id="explore-modal">
    <Explore />
  </Modal>
  <Modal id="create-post">
    <div class="dialog">
      <div class="header flexbox guttered">
        <div class="bold truncate">Create post</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
      <div class="content">
        <div class="field">
          <label>Post as:</label>
          <Dropdown
            class="selection"
            style="display: flex; align-items: center"
          >
            <template #trailing>
              <Icon
                name="material-symbols:expand-more-rounded"
                class="trailing"
              />
            </template>
            <div class="drop menu">
              <div class="active item">
                <div
                  class="lead avatar circular image mini"
                  style="flex: 0 0 auto; background-color: #999"
                ></div>
                <div style="flex: 1 1 auto">
                  <div class="text text-left">
                    <div
                      class="semibold"
                      style="font-size: 1.125em; line-height: 1.25"
                    >
                      Ayoola Folorunso
                    </div>
                    <div class="small faint-text">Personal Account</div>
                  </div>
                </div>
              </div>
              <div class="item">
                <div
                  class="lead avatar circular image mini"
                  style="flex: 0 0 auto; background-color: #999"
                ></div>
                <div style="flex: 1 1 auto">
                  <div class="text text-left">
                    <div
                      class="semibold"
                      style="font-size: 1.125em; line-height: 1.25"
                    >
                      Emmadave Computers
                    </div>
                    <div class="small faint-text">Business Account</div>
                  </div>
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
        <form @submit.prevent="">
          <div class="field">
            <textarea
              placeholder="What did you want to post?"
              class="form-item huge transparent"
            ></textarea>
          </div>
          <div class="field">
            <div
              class="compact icon-bar r-aligned menu"
              style="border-radius: var(--default-radius)"
            >
              <div class="item">
                <Icon name="material-symbols:mood-outline-rounded" />
              </div>
              <div class="item">
                <Icon
                  name="material-symbols:add-photo-alternate-outline-rounded"
                />
              </div>
              <div class="item">
                <Icon name="material-symbols:attach-file-add-rounded" />
              </div>
            </div>
          </div>
          <div class="field">
            <button class="primary button">Post</button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
  <Modal id="register-modal">
    <div class="dialog">
      <div class="header flexbox guttered">
        <div class="bold truncate">Join BizWorld</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
      <div class="content">
        <div class="field">
          <button class="button">
            <Icon name="material-symbols:login" />
            Continue with Google
          </button>
        </div>
        <form @submit.prevent="userStore.signup()">
          <div class="field 0-margined">
            <label>Names</label>
            <div class="2-fields">
              <div class="field">
                <input class="form-item" type="text" placeholder="First name" />
              </div>
              <div class="field">
                <input class="form-item" type="text" placeholder="Last name" />
              </div>
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input class="form-item" type="text" placeholder="Email address" />
          </div>
          <div class="field">
            <label>Password</label>
            <input class="form-item" type="text" placeholder="Password" />
          </div>
          <div class="field">
            <label>Country</label>
            <input class="form-item" type="text" placeholder="Select country" />
          </div>
          <p>
            By signing up, you agree to our <a href="#">terms of use</a> &
            <a href="#">privacy policy</a>
          </p>
          <div class="field">
            <button class="primary button exit-modal">Create Account</button>
          </div>
          <hr />
          <p>
            Already have an account?
            <a
              href="#login"
              class="exit-modal open-modal"
              data-target="login-modal"
              >Login</a
            >
          </p>
        </form>
      </div>
    </div>
  </Modal>
  <Modal id="login-modal">
    <div class="dialog">
      <div class="header flexbox guttered">
        <div class="bold truncate">Login to BizWorld</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
      <div class="content">
        <div class="field">
          <button class="button">
            <Icon name="material-symbols:login" />
            Continue with Google
          </button>
        </div>
        <form @submit.prevent="userStore.login()">
          <div class="field">
            <label>Email</label>
            <input class="form-item" type="text" placeholder="Email address" />
          </div>
          <div class="field">
            <label>Password</label>
            <input class="form-item" type="text" placeholder="Password" />
          </div>
          <div class="field">
            <button class="primary button exit-modal">Continue</button>
          </div>
          <hr />
          <p>
            New to BizWorld?
            <a
              href="#register"
              class="exit-modal open-modal"
              data-target="register-modal"
              >Sign up</a
            >
          </p>
        </form>
      </div>
    </div>
  </Modal>
  <Lightbox id="lightbox1" class="dark-mode" />
  <CreateBusiness />
</template>
