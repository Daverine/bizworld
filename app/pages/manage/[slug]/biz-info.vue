<script setup>
definePageMeta({ name: "manage-biz-info", layout: "common", auth: { only: "user" } });
</script>
<template>
  <main class="max-w-180 auto-contain">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 min-h-23 mb-4 pointer-none-only [&.is-stuck_.text-h3]:text-2xl"
    >
      <div
        class="lined heading text-h3 transition-[font-size] duration-200 flex gap-3 justify-between items-end bg-surface pin-top-blend m-0"
      >
        Business Information
        <button class="compact text-sm button">Edit</button>
      </div>
    </header>
    <section>
      <fieldset>
        <legend>About your business</legend>
        <div class="field">
          <label>Business name</label>
          <div>Emmadave Computer Technology Services</div>
        </div>
        <div class="field">
          <label>Business category</label>
          <div>Computer repair services</div>
        </div>
        <div class="field">
          <label>Description</label>
          <div>
            We offer technical services on laptop and desktop computers. We offer computer tech
            training; And we also do web development.
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Contact information</legend>
        <div class="field">
          <label>Telephone number</label>
          <div>08169673170</div>
        </div>
        <div class="field">
          <label>E-mail address</label>
          <div>folorunsodavid1@gmail.com</div>
        </div>
        <div class="field">
          <label>Social media</label>
          <div>
            <SvgIcon name="facebook" />
          </div>
          <div>
            <SvgIcon name="twitter" />
          </div>
          <div>
            <SvgIcon name="instagram" />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Locations and areas</legend>
        <div class="field">
          <label>Main location</label>
          <div>
            <p>3, Nepa Road, beside Igbagboyemi Pharmacy Isabo, 11102, Abeokuta, Nigeria.</p>
            <iframe
              class="google-maps"
              src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
            ></iframe>
          </div>
        </div>
        <div class="field">
          <label>Service area</label>
          <div class="text-center">
            <p>No other service area present.</p>
            <button class="compact button">Add</button>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Opening hours</legend>
        <table class="table">
          <tbody>
            <tr>
              <td>Sundays</td>
              <td>Closed</td>
            </tr>
            <tr>
              <td>Mondays</td>
              <td>9:00am - 5:00am</td>
            </tr>
            <tr>
              <td>Tuesdays</td>
              <td>9:00am - 5:00am</td>
            </tr>
            <tr>
              <td>Wednesdays</td>
              <td>9:00am - 5:00am</td>
            </tr>
            <tr>
              <td>Thursdays</td>
              <td>Closed</td>
            </tr>
            <tr>
              <td>Fridays</td>
              <td>9:00am - 5:00am</td>
            </tr>
            <tr>
              <td>Saturdays</td>
              <td>9:00am - 5:00am</td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </section>
  </main>
</template>
