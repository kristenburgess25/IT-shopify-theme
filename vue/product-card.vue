<template>
  <div class="product-card">
    <div
      :style="{ 'background-image': 'url(' + product.imageUrl + ')' }"
      class="product-image"
      @click="goToPDP(product.productUrl)"
    >
      <!-- <img :src="product.imageUrl" /> -->
    </div>
      <span v-if="product.productFlag == 'Most Popular'" class="most-popular-upsell most-popular-upsell-text show-most-popular ">  
      </span>
      <span v-if="product.productFlag == 'New'" class="most-popular-upsell most-popular-upsell-text show-most-popular product-new-flag">  
      </span>
    <h4 class="product-card-title">{{ product.title }}</h4>
    <div v-if="product.variants[0].sku != null">
      <div class="list-view-item" data-product-stars>
        <!-- TrustBox widget - Product Mini Multisource -->
        <div class="trustpilot-widget" data-locale="en-US" data-template-id="577258fb31f02306e4e3aaf9" data-businessunit-id="5df96c4c7890b800016789c7" data-style-height="18px" data-style-width="100%" data-theme="light" data-tags="SelectedReview" :data-sku="product.variants[0].sku" data-star-color="#0AA9FF" data-font-family="Open Sans" data-text-color="#232D37" data-no-reviews="show" data-scroll-to-list="false">
        </div>
        <!-- End TrustBox widget -->
      </div>
    </div>

    <!-- <p class="product-card-rating"> 5 stars </p> -->
    <div class="product-text-content">
      <p>{{ product.productDescriptionShort }}</p>
      <p>{{ product.biomarkerCount }}</p>
      <p v-if="product.bloodTestIncluded != null">
        {{
          product.bloodTestIncluded
            ? "Blood Test Included"
            : "Blood Test NOT Included"
        }}
      </p>
      <p v-if="product.dnaTestIncluded != null">
        {{
          product.dnaTestIncluded
            ? "DNA Test Included"
            : "DNA Test NOT Included"
        }}
      </p>
    </div>
    <h4>${{ product.variants[0].price.toString().slice(0, -2) }}</h4>
    <button v-if="addToCartBtn" @click="addToCart(product)" class="button button--primary">
      Add to cart
    </button>
    <button v-if="selectOptionsBtn" @click="goToPDP(product.productUrl)" class="button button--primary">
      Select Options
    </button>
    <a class="product-card-details-btn" :href="product.productUrl">
      View Details
    </a>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "product-card",
  props: {
    product: Object,
  },
  data() {
    return {
      selected: "",
      addToCartBtn: false,
      selectOptionsBtn: false,
    };
  },

  computed: mapState({
    shapedProducts: (state) => state.shapedProducts,
  }),
  methods: {
    setActive(selected, index) {
      this.activeIndex = index;
      this.selectedFilter = selected;
      this.setFilter(selected);
    },
    goToPDP(productUrl) {
      window.location.href = productUrl;
    },
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
          window.location.href= "/cart"
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
  },
  created() {
    if (this.product.variants.length > 1) {
      this.selectOptionsBtn = true;
    } else if (this.product.variants.length == 1) {
      this.addToCartBtn = true;
    }
  },
  mounted() {},
};
</script>
