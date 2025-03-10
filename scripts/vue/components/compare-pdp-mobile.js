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
import CompareProducts from './compareTablesMobile/products';

var __script__ = {
  name: 'compare-pdp-mobile',
  components: {
    'compare-products': CompareProducts
  },
  props: {
    settings: Object,
    blocks: Array,
    allProducts: Array,
    productsWithBiomarkers: Array,
    allBiomarkers: Array,
    product: Array
    // mobileProduct: Object,
  },
  data() {
    return {
      selectedFilter: '',
      activeIndex: '',
      productSet: '',
      mobileProduct: ''
    };
  },

  computed: mapState({
    kbProducts: state => state.kbProducts,
    shopifyProducts: state => state.shopifyProducts,
    shapedProducts: state => state.shapedProducts,
    comparisonTablePage: state => state.comparisonTablePage,
    comparisonTableProducts: state => state.comparisonTableProducts,
    mobileProductOne: state => state.mobileProductOne
  }),

  methods: {
    changeProductMobile(column) {
      this.productSet = [this.mobileProduct];
    }
  },
  created() {
    this.productSet = this.product;
  },
  mounted() {},
  updated() {}
};

var render = function () {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;
  return _c('div', {
    staticClass: "compare-products compare-mobile"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mobileProduct,
      expression: "mobileProduct"
    }],
    on: {
      "change": [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.mobileProduct = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, function ($event) {
        return _vm.changeProductMobile();
      }]
    }
  }, [_c('option', {
    attrs: {
      "disabled": "",
      "value": ""
    }
  }, [_vm._v("Select plan")]), _vm._v(" "), _vm._l(_vm.comparisonTableProducts, function (product, i) {
    return _c('option', {
      key: i,
      domProps: {
        "value": product
      }
    }, [_c('div', [_vm._v("\n        " + _vm._s(product.title) + "\n        ")])]);
  })], 2), _vm._v(" "), _c('table', {
    staticClass: "comparison-table-mobile comparison-table-mobile-main"
  }, [_vm.productSet ? _c('compare-products', {
    attrs: {
      "productSet": this.productSet
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "top-compare-table"
  }, [_c('tr', _vm._l(_vm.productSet, function (product, i) {
    return _c('td', {
      key: i
    }, [_c('div', [_vm._v(_vm._s(product.bloodTestIncluded ? "Includes blood test" : ""))])]);
  }), 0), _vm._v(" "), _c('tr', _vm._l(_vm.productSet, function (product, i) {
    return _c('td', {
      key: i
    }, [_c('div', [_vm._v(_vm._s(product.uploadPastResults ? "Upload past results" : ""))])]);
  }), 0), _vm._v(" "), _c('tr', _vm._l(_vm.productSet, function (product, i) {
    return _c('td', {
      key: i
    }, [_c('div', [_vm._v(_vm._s(product.availability))])]);
  }), 0), _vm._v(" "), _c('tr', _vm._l(_vm.productSet, function (product, i) {
    return _c('td', {
      key: i
    }, [_c('div', [_vm._v(_vm._s(product.biomarkerCount))])]);
  }), 0)])], 1)]);
};
var staticRenderFns = [];
var __template__ = { render: render, staticRenderFns: staticRenderFns };

export default Object.assign({}, __script__, __template__);