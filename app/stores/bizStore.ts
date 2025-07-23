import { defineStore } from 'pinia';

export const useBizStore = defineStore('biz', {
  state: () => ({
    details: {
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
        map: 'https://goo.gl/maps/y9ExQLSq37FL6EHm6',
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
      hours: [
        false,
        ['8:30', '18:30'],
        ['8:30', '18:30'],
        ['15:30', '18:30'],
        ['8:30', '18:30'],
        false,
        ['8:30', '18:30'],
      ],
      template: {
        userid: 'e8e34',
        username: 'daverine',
        userpic: '/images/profile_pic.jpg',
        anonymous: false,
        timestamp: 1694061107318,
        rating: 4,
        review:
          'I enjoy my experience doing business with you guys. keep it up.',
      },
    },
    feeds: [
      {
        id: '20230701',
        text: 'Edtech on work. View profile number 1',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-05-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: '20230701',
        text: 'Edtech on work. View profile',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-02-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: '20230701',
        text: 'Edtech on work. View profile',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-06-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: '20230701',
        text: 'Edtech on work. View profile',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-01-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: '20230701',
        text: 'Edtech on work. View profile',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-05-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: '20230701',
        text: 'Edtech on work. View profile',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-05-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: '20230701',
        text: 'Edtech on work. View profile',
        media: [
          {
            type: 'pic',
            url: '/images/ads.jpg',
          },
        ],
        date: "2025-05-06T10:00:00.000Z",
        thumbsUp: 10,
        comments: [],
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
    ],
    products: [
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'prod39884',
        type: 'product',
        title:
          'Dell Inspiron 5050, Intel Core i5 5th Gen, 8gb RAM, 256gb SSD. Very clean and rugged laptop. Suitable for office use. Long lasting battery',
        media: '/images/product.jpeg',
        labels: ['used', '15.6'],
        price: 100000,
        rating: {
          rate: 3.5,
          raters: 340,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
    ],
    projects: [
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
      {
        id: 'ser39884',
        type: 'project',
        title:
          'Create, design and format a document in Word, Powerpoint, Excel and CorelDRAW',
        media: '/images/product.jpeg',
        price: 100000,
        duration: '2 days',
        rating: {
          rate: 4.6,
          raters: 3440,
        },
        bizDetails: {
          name: 'Emmadave Computer Technology Services',
          logo: '/images/logo-sq.png',
          category: 'Computer repair services',
          url: 'https://www.edtech.com',
          verified: true,
          location: {
            address: '3, Nepa road, beside Igbagboyemi Pharmacy, Isabo 111102',
            city: 'Abeokuta',
            state: 'Ogun state',
            map: 'https://goo.gl/mapsy9ExQLSq37FL6EHm6',
          },
        },
      },
    ],
  }),
  actions: {},
});
