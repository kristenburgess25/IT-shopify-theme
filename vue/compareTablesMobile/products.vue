<template>
  <div class="compare-products-slider">
    <div id="mobile-product-container">
      <div v-for="product in productSet" :key="product.id"> 
        <product-card :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import productCard from '../product-card-compare-tables'

export default {
name: 'compare-products',
components: {
  'product-card': productCard,
  },
  props: {
    settings: Object,
    blocks: Array,
    allProducts: Array, 
    productsWithBiomarkers: Array,
    allBiomarkers: Array,
    productSet: Array,
  },
  data() {
    return {
      selectedFilter: '',
      activeIndex: '',
      page: 0,
      addToCartBtn: false,
      selectOptionsBtn: false
    };
  },

  computed: mapState({
    kbProducts: (state) => state.kbProducts,
    shopifyProducts: (state) => state.shopifyProducts,
    shapedProducts: (state) => state.shapedProducts,
  }),

  methods: {
    addToCart(product) {
      let formattedProducts = [];
      let productForCart = {
        id: product.variantId,
        quantity: 1,
        properties: {},
      };
      formattedProducts.push(productForCart);

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "items": formattedProducts,
        }),
      }).then((cart) => {
        cart.json().then((body) => {
          console.log("CART SUCCE$$$$$$$$$", body);
          window.location.href = "/cart";
          // GA EVENT - COMMENT BACK IN AFTER MERGING MAIN
          // ga("send", {
          //     hitType: "event",
          //     eventCategory: "Added to Cart",
          //     eventAction: "click",
          //     eventLabel: "{{ product.title }}"
          // });
        });
      });
    },
    goToPDP(productUrl) {
      window.location.href = productUrl;
    },
  },
  created() {
    // if (this.product.variants.length > 1) {
    //   this.selectOptionsBtn = true;
    // } else if (this.product.variants.length == 1) {
    //   this.addToCartBtn = true;
    // }
  },
  mounted() {
    // this.setBiomarkerData()
  },
  beforeUpdate() {
    // this.setBiomarkerData()
  },
};
</script>
