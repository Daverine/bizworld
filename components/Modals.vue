<script setup>
const searchStore = useSearchStore();
const userStore = useUserStore();
const sDetails = ref(false);

function popupSubmitSearch(e) {
  e.currentTarget.closest('.modal').dispatchEvent(new CustomEvent('plconsole', { detail: 'close panel' }));
  searchStore.triggerSearch();
}
function getScDetails(md, settings) {
  let caller = settings.caller;
  if (caller.getAttribute('data-target') !== 'sc-details' && caller.getAttribute('href') !== '#sc-details') return;

  let
    sctype = caller.getAttribute('data-type'), // might not be needed soon.
    scid = caller.getAttribute('data-id')
    ;
  if (sctype === 'business') {
    sDetails.value = {
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
    }
  }
  else if (sctype === 'product') {
    sDetails.value = {
      "type": "product",
      "title": "Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery",
      "price": "N100,000",
      "currency": "Naira",
      "negotiable": true,
      "media": [['pic', '/images/product.jpeg'], ['pic', '/images/product.jpeg'], ['pic', '/images/product.jpeg']],
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
    }
  }
  else if (sctype === 'service') {
    sDetails.value = {
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
    }
  }
}
</script>
<template>
  <Modal id="search-modal">
    <div class="dialog self-scroll">
      <div class="header flexbox guttered">
        <div class="bold truncate">
          Make your business search here ...
        </div>
        <button class="circular flat button as-text exit-modal" style="margin-left: auto;">
          <SvgIcon name="close" />
        </button>
      </div>
      <div class="content">
        <form @submit.prevent="popupSubmitSearch">
          <label class="input fluid" style="font-size: 1.125rem">
            <SvgIcon name="search" class="xhover" />
            <input v-model="searchStore.searchBox" type="search" placeholder="Your search here." class="subject"
              md-autofocus>
            <button type="button" title="Scan QR" class="icon open-modal exit-modal" data-target="scanqr-modal">
              <SvgIcon name="qr_code_scanner" />
            </button>
            <button type="button" title="Search location is set to Nigeria. Click to change it." class="icon open-modal"
              data-target="">
              <SvgIcon name="location_on" />
            </button>
          </label>
          <div class="flexbox equal-cols" style="gap: 1rem; margin: 1rem auto 0px; max-width: 300px;">
            <div class="col">
              <button type="submit" class="fluid button">
                <SvgIcon name="search" class="lead" /> SEARCH
              </button>
            </div>
            <div class="col">
              <button type="button" class="fluid button open-modal exit-modal" data-target="explore-modal">
                EXPLORE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Modal>
  <Modal id="scanqr-modal">
    <div class="dialog self-scroll">
      <div class="header flexbox guttered">
        <div class="bold truncate">
          Scan Business QR
        </div>
        <button class="circular flat button as-text exit-modal" style="margin-left: auto;">
          <SvgIcon name="close" />
        </button>
      </div>
      <div class="content">
        <div class="centered d-flex justify-center align-center" style="flex-flow: row wrap; min-height: 150px;">
          <svg width="59" height="45" viewBox="0 0 59 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40.3332 13.747L1.58323 13.747L1.58323 43.4553L40.3332 43.4553L40.3332 13.747Z" class="ArIAXb">
            </path>
            <path d="M40.3332 13.747L17.0832 13.747L17.0832 33.122L40.3332 33.122L40.3332 13.747Z" class="qOFLsb">
            </path>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0.614479 12.7783L6.74988 12.7783L6.74988 14.7158L2.55198 14.7158L2.55198 18.9137L0.614479 18.9137L0.614479 12.7783Z"
              fill="#BDC1C6"></path>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M39.3644 42.4866L39.3644 38.2887L41.3019 38.2887L41.3019 44.4241L35.1665 44.4241L35.1665 42.4866L39.3644 42.4866Z"
              fill="#BDC1C6"></path>
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0.614479 38.2887L2.55198 38.2887L2.55198 42.4866L6.74987 42.4866L6.74987 44.4241L0.614479 44.4241L0.614479 38.2887Z"
              fill="#BDC1C6"></path>
            <path d="M19.6665 30.2531H58.4165L58.4165 0.544722H19.6665L19.6665 30.2531Z" fill="#AECBFA"></path>
            <path
              d="M19.6665 21.8429L19.6665 30.2525L58.4168 30.2525L58.4168 19.7406L49.6667 12.4069C48.6234 11.5342 47.2931 11.0699 45.9272 11.1018C44.5614 11.1337 43.2547 11.6596 42.2542 12.5801L33.4166 20.7918L28.4166 17.2548C27.7332 16.7781 26.9013 16.5563 26.0684 16.6288C25.2354 16.7012 24.4554 17.0632 23.8666 17.6505L19.6665 21.8429Z"
              fill="#669DF6"></path>
            <path
              d="M30.0056 12.9386C31.7315 12.9386 33.1306 11.5395 33.1306 9.8136C33.1306 8.08773 31.7315 6.68863 30.0056 6.68863C28.2798 6.68863 26.8807 8.08773 26.8807 9.8136C26.8807 11.5395 28.2798 12.9386 30.0056 12.9386Z"
              fill="#E8F0FE"></path>
          </svg>
          <div class="fluid centered faint-text-v1 semibold">Drag a business QR image here.</div>
        </div>
        <div class="no-spacing divider">OR</div>
        <div class="centered" style="padding: 2em;">
          <button class="primary button">Upload QR image</button>
        </div>
      </div>
    </div>
  </Modal>
  <Modal id="sc-details" :options="{ controller: getScDetails, complete: function () { sDetails = false; } }">
    <ScDetails :details="sDetails" />
  </Modal>
  <Modal id="explore-modal">
    <Explore />
  </Modal>
  <Modal id="create-post">
    <div class="dialog">
      <div class="header flexbox guttered">
        <div class="bold truncate">
          Create post
        </div>
        <button class="circular flat button as-text exit-modal" style="margin-left: auto;">
          <SvgIcon name="close" />
        </button>
      </div>
      <div class="content">
        <div class="field">
          <label>Post as:</label>
          <Dropdown class="selection" style="display: flex; align-items: center;">
            <template #trailing>
              <SvgIcon name="expand_more" class="trailing" />
            </template>
            <div class="drop menu">
              <div class="active item">
                <div class="lead avatar circular image mini" style="flex: 0 0 auto; background-color: #999;"></div>
                <div style="flex: 1 1 auto;">
                  <div class="text text-left">
                    <div class="semibold" style="font-size: 1.125em; line-height: 1.25;">Ayoola Folorunso</div>
                    <div class="small faint-text-v1">Personal Account</div>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="lead avatar circular image mini" style="flex: 0 0 auto; background-color: #999;"></div>
                <div style="flex: 1 1 auto;">
                  <div class="text text-left">
                    <div class="semibold" style="font-size: 1.125em; line-height: 1.25;">Emmadave Computers</div>
                    <div class="small faint-text-v1">Business Account</div>
                  </div>
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
        <form @submit.prevent="">
          <div class="field">
            <textarea placeholder="What did you want to post?" class="form-item huge transparent"></textarea>
          </div>
          <div class="field">
            <div class="compact icon-bar r-aligned menu" style="border-radius: var(--default-radius);">
              <div class="item">
                <SvgIcon name="mood" />
              </div>
              <div class="item">
                <SvgIcon name="add_image" />
              </div>
              <div class="item">
                <SvgIcon name="attach_file_add" />
              </div>
            </div>
          </div>
          <div class="field">
            <button class="fluid primary button">Post</button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
  <template v-if="!userStore.auth">
    <Modal id="register-modal">
      <div class="dialog">
        <div class="header flexbox guttered">
          <div class="bold truncate">
            Join BizWorld
          </div>
          <button class="circular flat button as-text exit-modal" style="margin-left: auto;">
            <SvgIcon name="close" />
          </button>
        </div>
        <div class="content">
          <div class="field">
            <button class="fluid button">
              <SvgIcon name="login" />
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
            <div class="field">
              <p>By signing up, you agree to our <a href="#">terms of use</a> & <a href="#">privacy policy</a></p>
              <button class="fluid primary button">Create Account</button>
            </div>
            <hr />
            <div class="field centered">
              <p>Already have an account? <a href="#login" class="exit-modal open-modal"
                  data-target="login-modal">Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </Modal>
    <Modal id="login-modal">
      <div class="dialog">
        <div class="header flexbox guttered">
          <div class="bold truncate">
            Login to BizWorld
          </div>
          <button class="circular flat button as-text exit-modal" style="margin-left: auto;">
            <SvgIcon name="close" />
          </button>
        </div>
        <div class="content">
          <div class="field">
            <button class="fluid button">
              <SvgIcon name="login" />
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
              <button class="fluid primary button">Continue</button>
            </div>
            <hr />
            <div class="field centered">
              <p>New to BizWorld? <a href="#register" class="exit-modal open-modal" data-target="register-modal">Sign
                  up</a></p>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </template>
  <Lightbox id="lightbox1" class="dark-mode" />
</template>