<script setup>
definePageMeta({ layout: 'details' });
const route = useRoute();
const items = ref([
  {
    type: 'product',
    id: 'prod123343',
    title:
      'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
    price: 100000,
    media: [
      {
        type: 'pic',
        url: '/images/product.jpeg',
        thumbnail: '/images/product.jpeg',
      },
      {
        type: 'pic',
        url: '/images/product.jpeg',
        thumbnail: '/images/product.jpeg',
      },
      {
        type: 'pic',
        url: '/images/product.jpeg',
        thumbnail: '/images/product.jpeg',
      },
    ],
    overview:
      'This product is suitable for office use and it also presentable. It has a long lasting battery and its capable of handling comming computer daily tasks.',
    specification: {
      Type: 'Laptop',
      Condition: 'Used',
      Brand: 'Dell',
      Model: 'Inspiron 5050',
      Processor: 'Intel Corel i5 5th Generation',
      RAM: '8gb DDR3',
      Storage: '256gb SSD M.2',
      'Display Size': '15.6"',
      Graphics: 'Intel Graphics 3000 (64mb)',
    },
    productOptions: {
      optionType: 'RAM/ROM',
      options: [
        {
          label: '4GB / 64GB',
          media: undefined,
          price: 100000,
          subOptions: {
            optionType: 'Color',
            options: [
              {
                label: 'Yellow',
                price: 100000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
              {
                label: 'Reflective Blue',
                price: 100000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
              {
                label: 'Silver',
                price: 100000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
            ],
          },
        },
        {
          label: '4GB / 128GB',
          media: undefined,
          price: 120000,
          subOptions: {
            optionType: 'Color',
            options: [
              {
                label: 'Black',
                price: 120000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
              {
                label: 'Reflective Blue',
                price: 120000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
              {
                label: 'Moon Gray',
                price: 120000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
            ],
          },
        },
        {
          label: '6GB / 128GB',
          media: undefined,
          price: 150000,
          subOptions: {
            optionType: 'Color',
            options: [
              {
                label: 'Black',
                price: 150000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
              {
                label: 'Reflective Blue',
                price: 150000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
              {
                label: 'Moon Gray',
                price: 150000,
                media: {
                  pic: '/images/product.jpeg',
                  thumbnail: '/images/product.jpeg',
                },
              },
            ],
          },
        },
      ],
    },
    reviews: [
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 3,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 3,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 2,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 2,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 2,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
      {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
    ],
    bizData: {
      logo: '/images/logo-sq.png',
      bizName: 'Emmadave Computer Technology Services',
      bizUrl: 'https://www.edtech.com',
      mainCategory: 'Computer repair services',
      contacts: {
        tel: '08157483233',
        email: 'contact_us@edtech.com',
      },
      verified: true,
      rating: {
        rate: 3.5,
        raters: 30,
      },
      location: {
        address: '3 Nepal road, beside Igbagboyemi Pharmacy, Isabo 111102',
        city: 'Abeokuta',
        state: 'Ogun State',
        url: 'https://goo.gl/maps/y9ExQLSq37FL6EHm6',
      },
    },
  },
]);
</script>

<template>
  <Title>BizWorld | Shopping Cart</Title>
  <main
    class="grid-layout"
    style="padding-top: 1rem; background-color: var(--surface-v1)"
  >
    <div class="page-cont">
      <section class="page-sec1">
        <h3>Shopping Cart</h3>
        <table class="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" class="form-item" />
              </th>
              <th>Details</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td>
                <input type="checkbox" class="form-item" />
              </td>
              <td>
                <div class="heading truncate" style="--line-clamp: 2;">{{ item.title }}</div>
                <div class="truncate">Sold by: {{ item.bizData.bizName }}</div>
              </td>
              <td></td>
              <td>₦{{ item.price.toLocaleString() }}</td>
              <td class="text-center">
                <button class="flat icon button">
                  <Icon name="material-symbols:delete-outline-rounded" />
                </button>
                <button class="flat button">Move to whishlist</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="page-sec2">
        <div class="heading">Summary</div>
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-cont {
  display: grid;
  grid-template-columns: 1fr 24rem;
  gap: 2rem;
  align-items: start;
  min-height: 80vh;

  .page-sec1,
  .page-sec2 {
    padding: 1rem;
    background-color: var(--surface);
    border-radius: 0.5rem;
  }
}
</style>
