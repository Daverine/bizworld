<script lang="ts" setup>
const formData = ref({
  create1: {
    bizName: '',
    bizCart: '',
  },
  create2: {
    physicalLocation: '',
  },
  create3: {
    country: '',
    state: '',
    city: '',
    lga: '',
    street: '',
    postal: '',
  },
  create4: {
    map: '',
  },
  create5: {
    tel: '',
    email: '',
  },
  create7: {
    hours: [
      { day: 'Sunday', avail: false, hours: ['', ''] },
      { day: 'Monday', avail: false, hours: ['', ''] },
      { day: 'Tuesday', avail: false, hours: ['', ''] },
      { day: 'Wednesday', avail: false, hours: ['', ''] },
      { day: 'Thursday', avail: false, hours: ['', ''] },
      { day: 'Friday', avail: false, hours: ['', ''] },
      { day: 'Saturday', avail: false, hours: ['', ''] },
    ],
  },
  create8: {
    desc: '',
  },
  create9: {},
});
const currentTab = ref('create1');
const nextTab = (e: Event) => {
  const currentIndex = Object.keys(formData.value).indexOf(currentTab.value);
  if (currentIndex < Object.keys(formData.value).length - 1) {
    currentTab.value = Object.keys(formData.value)[currentIndex + 1];
  }
};
const prevTab = (e: Event) => {
  const currentIndex = Object.keys(formData.value).indexOf(currentTab.value);
  if (currentIndex > 0) {
    currentTab.value = Object.keys(formData.value)[currentIndex - 1];
  }
};
</script>

<template>
  <Modal id="create-biz" :options="{ closeOnWrapperClick: false }">
    <div class="dialog self-scroll" style="height: 100%">
      <div class="header flexbox guttered">
        <div class="bold truncate">Create business profile</div>
        <button
          class="circular flat button as-text exit-modal"
          style="margin-left: auto"
        >
          <Icon name="material-symbols:close-rounded" />
        </button>
      </div>
      <div class="content">
        <div
          class="create1 tab-page"
          :class="currentTab === 'create1' ? 'active' : ''"
        >
          <h6 class="text-center">Build Your Online Business Presence</h6>
          <p class="text-center">
            Follow and complete this form to create your Bizworld business page.
          </p>
          <div class="field">
            <label>Business name</label>
            <input
              v-model="formData.create1.bizName"
              type="text"
              class="form-item"
            />
          </div>
          <div class="field">
            <label>Industry/Category</label>
            <input
              v-model="formData.create1.bizCart"
              type="text"
              class="form-item"
            />
            <div class="supp-text">
              You can change or add more categories later.
            </div>
          </div>
        </div>
        <div
          class="create2 tab-page"
          :class="currentTab === 'create2' ? 'active' : ''"
        >
          <h6 class="text-center">Do You Have a Physical Location?</h6>
          <p>
            Provide your store or office address if you'd like customers to
            visit you. This information will be displayed on your BizWorld
            profile and used in distance-based search results.
          </p>
          <div class="field">
            <fieldset>
              <legend>Do you have a physical location?</legend>
              <label>
                <input
                  v-model="formData.create2.physicalLocation"
                  value="yes"
                  type="radio"
                  class="form-item"
                />
                Yes
              </label>
              <label>
                <input
                  v-model="formData.create2.physicalLocation"
                  value="no"
                  type="radio"
                  class="form-item"
                />
                No
              </label>
            </fieldset>
          </div>
        </div>
        <div
          class="create3 tab-page"
          :class="currentTab === 'create3' ? 'active' : ''"
        >
          <h6 class="text-center">What is the address?</h6>
          <div class="field">
            <label>Country</label>
            <Dropdown v-model="formData.create3.country" class="select search">
              <div class="drop menu">
                <div class="item">Nigeria</div>
              </div>
            </Dropdown>
          </div>
          <div class="field">
            <label>State</label>
            <Dropdown
              v-model="formData.create3.state"
              :options="{ fluidMinWidth: true }"
              class="multiple search select"
            >
              <div class="drop menu">
                <div class="item">Ogun</div>
                <div class="item">Osun</div>
              </div>
            </Dropdown>
          </div>
          <div class="field">
            <label>City</label>
            <input
              v-model="formData.create3.city"
              type="text"
              class="form-item"
            />
          </div>
          <div class="field">
            <label>Street address</label>
            <input
              v-model="formData.create3.street"
              type="text"
              class="form-item"
            />
          </div>
          <div class="field">
            <label>Postal code</label>
            <input
              v-model="formData.create3.postal"
              type="number"
              class="form-item"
            />
          </div>
        </div>
        <div
          class="create4 tab-page"
          :class="currentTab === 'create4' ? 'active' : ''"
        >
          <h6 class="text-center">Confirm Your Business Location</h6>
          <p>We need your exact business address. Please:</p>
          <ol>
            <li>
              Go to
              <NuxtLink to="https://map.google.com" external target="_blank"
                >Google Maps</NuxtLink
              >.
            </li>
            <li>
              Find your location and precisely adjust the map marker to your
              business's spot by dragging and zooming.
            </li>
            <li>
              Copy the generated address and paste it into the field below.
            </li>
          </ol>
          <div class="field">
            <label>Map URL</label>
            <input
              v-model="formData.create4.map"
              type="url"
              class="form-item"
            />
          </div>
        </div>
        <div
          class="create5 tab-page"
          :class="currentTab === 'create5' ? 'active' : ''"
        >
          <h6 class="text-center">Add Contact Information</h6>
          <p>
            Help customers connect with you easily! Add at least a phone number
            or email address. This information will be prominently displayed on
            your Business Profile.
          </p>
          <div class="field">
            <label>Phone number</label>
            <input
              v-model="formData.create5.tel"
              type="tel"
              class="form-item"
            />
          </div>
          <div class="field">
            <label>Email</label>
            <input
              v-model="formData.create5.email"
              type="email"
              class="form-item"
            />
          </div>
        </div>
        <div
          class="create7 tab-page"
          :class="currentTab === 'create7' ? 'active' : ''"
        >
          <h6 class="text-center">Set Your Business Hours</h6>
          <p>
            Enter your regular business hours so customers know when to reach
            you.
          </p>
          <div v-for="day in formData.create7.hours" class="field">
            <label class="flexbox flex-separate">
              {{ day.day }}
              <input
                v-model="day.avail"
                type="checkbox"
                class="form-item switch"
              />
            </label>
            <div v-if="day.avail" class="flexbox flex-separate align-center">
              <input
                v-model="day.hours[0]"
                type="time"
                class="compact form-item"
              />
              <Icon name="material-symbols:arrow-range-rounded" />
              <input
                v-model="day.hours[1]"
                type="time"
                class="compact form-item"
              />
            </div>
          </div>
        </div>
        <div
          class="create8 tab-page"
          :class="currentTab === 'create8' ? 'active' : ''"
        >
          <h6 class="text-center">Add Business Description</h6>
          <p>
            Tell customers about your business. This description will appear on
            your Business Profile and help them understand what you offer.
          </p>
          <div class="field">
            <label>Business description</label>
            <textarea
              v-model="formData.create8.desc"
              class="form-item"
              placeholder="What does your business do?"
            ></textarea>
          </div>
        </div>
        <div
          class="create9 tab-page"
          :class="currentTab === 'create9' ? 'active' : ''"
        >
          <h6 class="text-center">Add Your Business Logo</h6>
          <p>
            Upload your business logo here. It will be prominently displayed on
            your Business Profile.
          </p>
          <div class="field">
            <label>Business logo</label>
            <input type="file" class="form-item" />
          </div>
        </div>
      </div>
      <div class="footer">
        <div v-if="currentTab === 'create1'" class="flexbox flex-column">
          <p class="text-center">
            By continuing, you agree to our <a href="">Terms of Service</a> and
            <a href="">Privacy Policy</a>.
          </p>
          <button class="primary button" @click="nextTab">Continue</button>
        </div>
        <div v-else class="flexbox flex-separate align-center guttered">
          <span class="text-muted">
            {{ Object.keys(formData).indexOf(currentTab) + 1 }} of
            {{ Object.keys(formData).length }}
          </span>
          <div class="flexbox guttered">
            <button class="flat button" @click="prevTab">Previous</button>
            <button
              v-if="currentTab === Object.keys(formData).pop()"
              class="primary button exit-modal"
            >
              Finish
            </button>
            <button v-else class="primary button" @click="nextTab">Next</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style></style>
