<script setup>
definePageMeta({ name: 'manage-biz-overview', layout: 'common', auth: false });
</script>
<template>
  <main class="flexible container-md padded">
    <header
      v-scrollPin="{ notifyStuckState: true, top: 63 }"
      class="scrollpin z-level-1 pin-top-blend surface-bg"
      style="margin-bottom: 1rem"
    >
      <div
        class="p-h3 lined heading h3 0-margined align-end flexbox guttered flex-separate"
      >
        Overview
      </div>
    </header>
    <section class="body-sec">
      <section>
        <div class="heading small">Progress summary</div>
        <div class="flexbox lg-guttered flex-pad-content flex-wrap">
          <div class="sum-item">
            <header class="flexbox sm-guttered flex-nowrap">
              <Icon name="material-symbols:person-outline-rounded" />
              Max Visitors
              <Icon name="material-symbols:info-outline-rounded" />
            </header>
            <div class="h2 content">1024</div>
          </div>
          <div class="sum-item">
            <header class="flexbox sm-guttered flex-nowrap">
              <Icon name="material-symbols:groups-outline-rounded" />
              Post Engagement
              <Icon name="material-symbols:info-outline-rounded" />
            </header>
            <div class="h2 content">200</div>
          </div>
          <div class="sum-item">
            <header class="flexbox sm-guttered flex-nowrap">
              <Icon name="material-symbols:reviews-outline-rounded" />
              Page Reviews
              <Icon name="material-symbols:info-outline-rounded" />
            </header>
            <div class="h2 content">20</div>
          </div>
        </div>
      </section>
      <section>
        <div class="heading small">Earned barge</div>
        <div
          class="flexbox lg-guttered flex-pad-content flex-wrap align-center"
          style="margin-bottom: 1rem"
        >
          <div class="flexbox flex-column align-center guttered">
            <Badges name="verified" style="font-size: 4rem" />
            <div class="semibold">Verified</div>
          </div>
          <div class="flexbox flex-column align-center guttered">
            <Badges name="escrow" style="font-size: 4rem" />
            <div class="semibold">Trade Assurance</div>
          </div>
          <div class="flexbox flex-column align-center guttered">
            <Badges name="5years" style="font-size: 4rem" />
            <div class="semibold">Sustainable</div>
          </div>
        </div>
        <div class="text-center">
          <div class="b-margined-sm">
            Badges boost customers' trust in your business. You can learn more
            about what each of our badges means and how to earn them.
          </div>
          <button class="button">Learn more</button>
        </div>
      </section>
      <section>
        <div class="heading small">Your service plan</div>
        <div class="note">
          <img
            src="/images/basic.webp"
            alt="Bizworld basic plan"
            style="width: 100px; height: 100px"
          />
          <div class="flexible" style="min-width: 60%">
            <p>
              Bizworld basic plan enable you to create a maximum of one
              microsite on our platform and also enables you to post a maximum
              of 10 products and services.
            </p>
          </div>
        </div>
        <div class="text-center">
          <div class="b-margined-sm">See all our available market plan.</div>
          <button class="button open-modal" data-target="marketplan">
            Market plans
          </button>
          <LimbModal id="marketplan">
            <div class="dialog self-scroll padded">
              <div class="note">
                <img
                  src="/images/premium.webp"
                  alt="Bizworld premium plan"
                  style="width: 100px; height: 100px"
                />
                <div class="flexible" style="min-width: 60%">
                  <p>
                    Bizworld free plan enable you to create a maximum of one
                    microsite for free on our platform and also enables you to
                    post a maximum of 10 products and services.
                  </p>
                </div>
              </div>
              <div class="note">
                <img
                  src="/images/elite.webp"
                  alt="Bizworld elite plan"
                  style="width: 100px; height: 100px"
                />
                <div class="flexible" style="min-width: 60%">
                  <p>
                    Bizworld free plan enable you to create a maximum of one
                    microsite free of charge on our platform and also enables
                    you to post a maximum of 50 products and services. This
                    offer will do for small business.
                  </p>
                </div>
              </div>
              <div class="note">
                <img
                  src="/images/enterprise.webp"
                  alt="Bizworld enterprise plan"
                  style="width: 100px; height: 100px"
                />
                <div class="flexible" style="min-width: 60%">
                  <p>
                    Bizworld free plan enable you to create a maximum of one
                    microsite free of charge on our platform and also enables
                    you to post a maximum of 50 products and services. This
                    offer will do for small business.
                  </p>
                </div>
              </div>
            </div>
          </LimbModal>
        </div>
      </section>
      <section>
        <div class="heading small">Business tools</div>
        <div class="grid menu 2-cols app-items rounded">
          <NavMenuManagement />
        </div>
      </section>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.body-sec {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.sum-item {
  background-color: var(--surface-v3);
  padding: 0.75em;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  border-radius: var(--default-radius);
}
</style>
