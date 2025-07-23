interface item {
  type: string;
  id: string;
  title: string;
  price: number;
  media: string;
  productOptions: string[];
  quantity: number;
  delivery: string;
  bizData: {
    logo: string;
    bizName: string;
    bizUrl: string;
    mainCategory: string;
    contacts: { tel: string; email: string };
    verified: boolean;
    rating: { rate: number; raters: number };
    location: { address: string; city: string; state: string; url: string };
  };
  checked: boolean;
}
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [
      {
        type: 'product',
        id: 'prod1',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        price: 100000,
        media: '/images/product.jpeg',
        productOptions: ['4GB/64GB', 'Yellow'],
        quantity: 1,
        delivery: 'Self-pickup',
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
        checked: true,
      },
      {
        type: 'product',
        id: 'prod2',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        price: 100000,
        media: '/images/product.jpeg',
        productOptions: ['4GB/64GB', 'Yellow'],
        quantity: 1,
        delivery: 'Self-pickup',
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
        checked: true,
      },
      {
        type: 'product',
        id: 'prod3',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        price: 100000,
        media: '/images/product.jpeg',
        productOptions: ['4GB/64GB', 'Yellow'],
        quantity: 1,
        delivery: 'Self-pickup',
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
        checked: true,
      },
      {
        type: 'product',
        id: 'prod4',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        price: 100000,
        media: '/images/product.jpeg',
        productOptions: ['4GB/64GB', 'Yellow'],
        quantity: 1,
        delivery: 'Self-pickup',
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
        checked: true,
      },
      {
        type: 'product',
        id: 'prod5',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        price: 100000,
        media: '/images/product.jpeg',
        productOptions: ['4GB/64GB', 'Yellow'],
        quantity: 1,
        delivery: 'Self-pickup',
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
        checked: true,
      },
    ],
  }),
  actions: {
    removeFromCart(id: string) {
      console.log('removing item with id: ', id);
      this.items = this.items.filter((el) => el.id !== id);
    },
    addToCart(item: item) {
      this.items.push(item);
    },
  },
});
