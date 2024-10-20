<script setup>
const props = defineProps(['details']);
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
  <div v-if="details" class="dialog self-scroll full-screen sc-dialog" :data-type="details.type">
    <div class="header dm-header flexbox a-block" :class="{ active: activeFixedMenu }">
      <div class="content h6 semibold 0-margined truncate">{{ details.title }}</div>
      <button class="flat circular button trailing icon exit-modal">
        <SvgIcon name="close" />
      </button>
    </div>
    <div ref="dgContent" class="content 0-padding" @scroll="handleScroll">
      <div class="dm-display">
        <div class="dm-media">
          <Carousel class="dm-dps">
            <div v-for="slide in details.media" class="cs-slide">
              <img v-if="slide[0] === 'pic'" :src="slide[1]" class="image" />
            </div>
          </Carousel>
        </div>
      </div>
      <div style="padding: 1em 1.5em;">
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
              <span class="0-margined h6" style="font-weight: var(--bold-weight);">From &nbsp;</span>
              <span class="h5 bold 0-margined" style="color: var(--primary);">{{ details.price }}&nbsp;</span>
            </div>
          </div>
        </div>
        <hr ref="divider" />
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="overview" class="lead icon" />
          Service Details
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <p>We are deeply committed to crafting professional logo designs that align with your specific requirements.
          </p>

          <p>Our Pledge:</p>
          <ul>
            <li>You will retain complete ownership rights of the final designs.</li>
            <li>We ensure swift delivery, by your timeline. 1st round in 24-48 Hours. Followed by daily updates.</li>
            <li>You can take advantage of unlimited revisions until your desired design is achieved.</li>
          </ul>

          <p>Our Experience:</p>
          <ul>
            <li>As a top-rated freelancer, we maintain a flawless 100% job success rate.</li>
            <li>Our Upwork track record includes over 20,000 working hours across 10,000+ projects.</li>
            <li>With over 17 years of expertise in graphic design, we bring a wealth of experience to every project.
            </li>
          </ul>

          <p>Your satisfaction is our priority, and we look forward to the opportunity to collaborate on your design
            needs.</p>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="list_alt" class="lead icon" />
          Service Plans
          <i class="viewbox trailing icon">
            <SvgIcon name="chevron_left" class="n-view" />
            <SvgIcon name="expand_more" class="a-view" />
          </i>
        </div>
        <div class="collapsible">
          <div class="fillable-eq menu" v-tab>
            <label class="flex-column item active" data-tab="basic-tier">
              <input class="big form-item" type="radio" checked name="tier">
              <div>
                Basic <br>
                <span class="bold">$30</span>
              </div>
            </label>
            <label class="flex-column item" data-tab="standard-tier">
              <input class="big form-item" type="radio" name="tier">
              <div>
                Standard <br>
                <span class="bold">$30</span>
              </div>
            </label>
            <label class="flex-column item" data-tab="premium-tier">
              <input class="big form-item" type="radio" name="tier">
              <div>
                Premium <br>
                <span class="bold">$30</span>
              </div>
            </label>
          </div>
          <div class="tab-page" id="basic-tier">
            <table class=table>
              <tbody>
                <tr>
                  <td>Delivery Time</td>
                  <td>2 days</td>
                </tr>
                <tr>
                  <td>Number of Revisions</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>Number of Initial Concepts</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>Printable Resolution File</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Logo Transparency</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>3D Mockup</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Source Files</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Vector File</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-page" id="standard-tier">
            <table class=table>
              <tbody>
                <tr>
                  <td>Delivery Time</td>
                  <td>2 days</td>
                </tr>
                <tr>
                  <td>Number of Revisions</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td>Number of Initial Concepts</td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>Printable Resolution File</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Logo Transparency</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>3D Mockup</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Source Files</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Vector File</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-page" id="premium-tier">
            <table class=table>
              <tbody>
                <tr>
                  <td>Delivery Time</td>
                  <td>2 days</td>
                </tr>
                <tr>
                  <td>Number of Revisions</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Number of Initial Concepts</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>Printable Resolution File</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Logo Transparency</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>3D Mockup</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Source Files</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Vector File</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="security" class="lead icon" />
          Client's Protection
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
          <table class="table">
            <tbody>
              <tr>
                <td>Business Verification</td>
                <td>True</td>
              </tr>
              <tr>
                <td>Escrow Payment</td>
                <td>True</td>
              </tr>
              <tr>
                <td>Customer's Rating</td>
                <td>4.0/5.0 (30,498 raters)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-collapsible class="sub heading a-block active">
          <SvgIcon name="reviews" class="lead icon" />
          Reviews on this Service
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
              <Dropdown class="outlined small button">
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
          Service Manager Details
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
    <div class="footer auto-t-bordered flexbox" style="gap: 0.5em;">
      <button class="primary button"><SvgIcon name="chat" class="lead" /> Send Inquiry</button>
      <button class="secondary circular button">
        <SvgIcon name="call" />
      </button>
      <div style="display: flex; gap: 1em; margin-left: auto;">
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
</template>