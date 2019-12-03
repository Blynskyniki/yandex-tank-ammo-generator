export default {
  name: 'Ammo1',
  host: 'i-dev.api.qq.com',
  data: [
    {
      method: 'post',
      headers:{
        'auth':'true'
      },
      tag:'supertest',
      body: {
        filters: {},

        size: 24,
        page: 1,
      },
      path: '/ecommerce/goods/eshop/catalog',
    },
    { method: 'GET', path: '/catalog/zhenshchinam/zhenskaya-obuv/?opt=all', body: null },
  ],
};
