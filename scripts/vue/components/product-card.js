//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

import { mapState, mapMutations } from "vuex";

var __script__ = {
  name: "product-card",
  props: {
    product: Object
  },
  data() {
    return {
      selected: "",
      addToCartBtn: false,
      selectOptionsBtn: false
    };
  },

  computed: mapState({
    shapedProducts: state => state.shapedProducts
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
        properties: {}
      };
      formattedProducts.push(productForCart);

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "items": formattedProducts
        })
      }).then(cart => {
        cart.json().then(body => {
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
    }
  },
  created() {
    if (this.product.variants.length > 1) {
      this.selectOptionsBtn = true;
    } else if (this.product.variants.length == 1) {
      this.addToCartBtn = true;
    }
  },
  mounted() {}
};

var render = function () {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;
  return _c('div', {
    staticClass: "product-card"
  }, [_c('div', {
    staticClass: "product-image",
    style: {
      'background-image': 'url(' + _vm.product.imageUrl + ')'
    },
    on: {
      "click": function ($event) {
        return _vm.goToPDP(_vm.product.productUrl);
      }
    }
  }), _vm._v(" "), _vm.product.productFlag == 'Most Popular' ? _c('span', {
    staticClass: "most-popular-upsell most-popular-upsell-text show-most-popular "
  }) : _vm._e(), _vm._v(" "), _vm.product.productFlag == 'New' ? _c('span', {
    staticClass: "most-popular-upsell most-popular-upsell-text show-most-popular product-new-flag"
  }) : _vm._e(), _vm._v(" "), _c('h4', {
    staticClass: "product-card-title"
  }, [_vm._v(_vm._s(_vm.product.title))]), _vm._v(" "), _vm.product.variants[0].sku != null ? _c('div', [_c('div', {
    staticClass: "list-view-item",
    attrs: {
      "data-product-stars": ""
    }
  }, [_c('div', {
    staticClass: "trustpilot-widget",
    attrs: {
      "data-locale": "en-US",
      "data-template-id": "577258fb31f02306e4e3aaf9",
      "data-businessunit-id": "5df96c4c7890b800016789c7",
      "data-style-height": "18px",
      "data-style-width": "100%",
      "data-theme": "light",
      "data-tags": "SelectedReview",
      "data-sku": _vm.product.variants[0].sku,
      "data-star-color": "#0AA9FF",
      "data-font-family": "Open Sans",
      "data-text-color": "#232D37",
      "data-no-reviews": "show",
      "data-scroll-to-list": "false"
    }
  })])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "product-text-content"
  }, [_c('p', [_vm._v(_vm._s(_vm.product.productDescriptionShort))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.product.biomarkerCount))]), _vm._v(" "), _vm.product.bloodTestIncluded != null ? _c('p', [_vm._v("\n      " + _vm._s(_vm.product.bloodTestIncluded ? "Blood Test Included" : "Blood Test NOT Included") + "\n    ")]) : _vm._e(), _vm._v(" "), _vm.product.dnaTestIncluded != null ? _c('p', [_vm._v("\n      " + _vm._s(_vm.product.dnaTestIncluded ? "DNA Test Included" : "DNA Test NOT Included") + "\n    ")]) : _vm._e()]), _vm._v(" "), _c('h4', [_vm._v("$" + _vm._s(_vm.product.variants[0].price.toString().slice(0, -2)))]), _vm._v(" "), _vm.addToCartBtn ? _c('button', {
    staticClass: "button button--primary",
    on: {
      "click": function ($event) {
        return _vm.addToCart(_vm.product);
      }
    }
  }, [_vm._v("\n    Add to cart\n  ")]) : _vm._e(), _vm._v(" "), _vm.selectOptionsBtn ? _c('button', {
    staticClass: "button button--primary",
    on: {
      "click": function ($event) {
        return _vm.goToPDP(_vm.product.productUrl);
      }
    }
  }, [_vm._v("\n    Select Options\n  ")]) : _vm._e(), _vm._v(" "), _c('a', {
    staticClass: "product-card-details-btn",
    attrs: {
      "href": _vm.product.productUrl
    }
  }, [_vm._v("\n    View Details\n  ")])]);
};
var staticRenderFns = [];
var __template__ = { render: render, staticRenderFns: staticRenderFns };

export default Object.assign({}, __script__, __template__);