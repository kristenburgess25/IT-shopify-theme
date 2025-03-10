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

import { mapState, mapMutations } from 'vuex';
import productCard from './product-card';

var __script__ = {
  name: 'home-page',
  components: {
    productCard
  },
  props: {
    settings: Object,
    blocks: Array,
    allProducts: Array,
    productsWithBiomarkers: Array,
    allBiomarkers: Array
  },
  data() {
    return {
      selectedFilter: '',
      activeIndex: '',
      filteredProductSet: [],
      goalFilters: '',
      otherFilters: '',
      mobileFilter: false
    };
  },

  computed: mapState({
    kbProducts: state => state.kbProducts,
    shopifyProducts: state => state.shopifyProducts,
    overallHealthFilter: state => state.categories.overallHealth,
    healthyAgingFilter: state => state.categories.healthyAging,
    shapedProducts: state => state.shapedProducts
  }),

  methods: {
    openMobileFilter(bool, e) {
      e.stopPropagation();
      this.mobileFilter = bool;
    },
    handleClick(cta) {
      console.log('hit cta click');
      if (cta == "compare") {
        window.location.href = this.settings.compare_plans_cta_url;
      }

      if (cta == "gift") {
        window.location.href = this.settings.gift_card_cta_url;
      }
    },
    setAllFilters() {
      let goalFilters = this.settings.goalFilters.split(',');
      let otherFilters = this.settings.otherFilters.split(',');
      this.goalFilters = goalFilters;
      this.otherFilters = otherFilters;
    },
    setBiomarkers() {
      let biomarkerCategories = [];

      this.allBiomarkers.forEach(marker => {
        if (marker.markers) {
          console.log('marker title', marker.title);
          console.log('markers', marker.markers);
          let markersArray = marker.markers[0].split('|');
          console.log('markers', markersArray);

          let biomarker = {
            header: marker.title,
            markers: markersArray
          };

          biomarkerCategories.push(biomarker);
        }
      });
      console.log('biomarker categories', biomarkerCategories);
    },
    setActive(selected, index) {
      this.activeIndex = index;
      this.selectedFilter = selected;
      this.setFilter(selected);
    },
    setFilter(selected) {
      console.log('selected filter', selected);
      if (selected.trim() == "All") {
        this.selectedFilter = '';
      } else this.selectedFilter = selected;

      if (selected.trim() == "Price") {
        let filteredByPrice = this.shapedProducts.sort((a, b) => parseFloat(b.price - a.price));
        return this.filteredProductSet = filteredByPrice;
      } else this.setFilteredProducts();
    },
    setFilteredProducts() {
      let allProducts = this.shapedProducts;
      let filteredProducts = [];

      allProducts.forEach(product => {
        let cats = product.categories;

        cats.forEach(cat => {
          let catString = cat.trim().toLowerCase();
          let filterString = this.selectedFilter.trim().toLowerCase();

          if (catString == filterString) {
            console.log('WE HAVE A GD MATCH', catString, filterString);
            filteredProducts.push(product);
          }
        });
      });

      console.log('matching filtered products', filteredProducts);
      this.filteredProductSet = filteredProducts;
    }

  },
  created() {
    console.log('VUE APP WAS CREATED!!!! ');
    let theProducts = this.productsWithBiomarkers;

    this.$store.commit("setAllProducts", theProducts);
  },
  mounted() {
    console.log('VUE APP WAS MOUNTED!!!');
    console.log('biomarkers in vue???', this.allBiomarkers);
    this.$store.dispatch("setProductData");
    this.setAllFilters();
    this.setBiomarkers();
  }
};

var render = function () {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;
  return _c('div', {
    staticClass: "home-page-wrapper"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.mobileFilter,
      expression: "mobileFilter"
    }],
    staticClass: "filters-container filter-mobile"
  }, [_c('div', {
    staticClass: "filter-btn-container"
  }, [_c('button', {
    staticClass: "filter-btn-container mobile-filter-x",
    on: {
      "click": function ($event) {
        return _vm.openMobileFilter(false, $event);
      }
    }
  }, [_vm._v("X")])]), _vm._v(" "), _c('p', {
    staticClass: "list-header"
  }, [_vm._v("Filter Plans")]), _vm._v(" "), _c('ul', {
    attrs: {
      "id": "filter-by-goal"
    }
  }, _vm._l(_vm.goalFilters, function (filter, index) {
    return _c('li', {
      key: filter,
      class: {
        'active': _vm.activeIndex === index
      },
      on: {
        "click": function ($event) {
          return _vm.setActive(filter, index);
        }
      }
    }, [_vm._v(" \n            " + _vm._s(filter) + " \n          ")]);
  }), 0), _vm._v(" "), _c('br')]), _vm._v(" "), _c('div', {
    staticClass: "filter-btn-container"
  }, [_c('button', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.mobileFilter,
      expression: "!mobileFilter"
    }],
    staticClass: "filter-btn",
    on: {
      "click": function ($event) {
        return _vm.openMobileFilter(true, $event);
      }
    }
  }, [_vm._v("\n      Filter Plans \n    ")])]), _vm._v(" "), _c('div', {
    staticClass: "subscription"
  }, [_c('div', {
    staticClass: "filters-container"
  }, [_c('p', {
    staticClass: "list-header"
  }, [_vm._v("Filter Plans ")]), _vm._v(" "), _c('ul', {
    attrs: {
      "id": "filter-by-goal"
    }
  }, _vm._l(_vm.goalFilters, function (filter, index) {
    return _c('li', {
      key: filter,
      class: {
        'active': _vm.activeIndex === index
      },
      on: {
        "click": function ($event) {
          return _vm.setActive(filter, index);
        }
      }
    }, [_vm._v(" \n            " + _vm._s(filter) + " \n          ")]);
  }), 0), _vm._v(" "), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "gift-card-cta-container"
  }, [_c('h4', [_vm._v("\n          " + _vm._s(_vm.settings.gift_card_cta_text_main) + "\n        ")]), _vm._v(" "), _c('p', [_vm._v(" " + _vm._s(_vm.settings.gift_card_cta_subheading) + " ")]), _vm._v(" "), _c('button', {
    staticClass: "button button--bright",
    on: {
      "click": function ($event) {
        return _vm.handleClick('gift');
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.settings.gift_card_cta_button_text) + "\n        ")])]), _vm._v(" "), _c('div', {
    staticClass: "compare-plans-cta-container"
  }, [_c('h4', [_vm._v("\n          " + _vm._s(_vm.settings.compare_plans_cta_text) + "\n        ")]), _vm._v(" "), _c('button', {
    staticClass: "button button--primary-inverse",
    on: {
      "click": function ($event) {
        return _vm.handleClick('compare');
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.settings.compare_plans_cta_button_text) + "\n        ")])])]), _vm._v(" "), _vm.shapedProducts ? _c('div', {
    attrs: {
      "id": "home-cards-container"
    }
  }, [_vm.selectedFilter ? _c('div', {
    attrs: {
      "id": "shop-all-product-container"
    }
  }, _vm._l(this.filteredProductSet, function (product) {
    return _c('div', {
      key: product.id
    }, [_c('product-card', {
      attrs: {
        "product": product
      }
    })], 1);
  }), 0) : _c('div', {
    attrs: {
      "id": "shop-all-product-container"
    }
  }, _vm._l(this.shapedProducts, function (product) {
    return _c('div', {
      key: product.id
    }, [_c('product-card', {
      attrs: {
        "product": product
      }
    })], 1);
  }), 0)]) : _vm._e()])]);
};
var staticRenderFns = [];
var __template__ = { render: render, staticRenderFns: staticRenderFns };

export default Object.assign({}, __script__, __template__);