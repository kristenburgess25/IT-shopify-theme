<template>
  <div class="compare-products compare-mobile">
      <select v-on:change="changeProductMobile()" v-model="mobileProduct" >
        <option disabled value="">Select plan</option>
        <option  v-for="(product, i) in comparisonTableProducts" :key="i" :value="product">
          <div>
          {{ product.title }}
          </div>
        </option>
      </select>

    <table class="comparison-table-mobile comparison-table-mobile-main">
      <compare-products v-if="productSet" :productSet="this.productSet"/>
      <!-- <tr>
        <th>Reviews</th>
        <td v-for="(product,i) in productSet" :key="i"> {{product.productStarRating}} </td>
      </tr> -->
      <div class="top-compare-table">
      <tr>
        <td v-for="(product,i) in productSet" :key="i"><div>{{ product.bloodTestIncluded ? "Includes blood test" : "" }}</div>
        </td>
      </tr>
      <!-- <tr>
        <td v-for="(product,i) in productSet" :key="i"><div>{{ product.dnaTestIncluded ? "Includes DNA test" : "" }}</div></td>
      </tr> -->
      <tr>
        <td v-for="(product,i) in productSet" :key="i"><div>{{ product.uploadPastResults ? "Upload past results" : "" }}</div></td>
      </tr>
      <tr>
        <td v-for="(product,i) in productSet" :key="i"><div>{{ product.availability }}</div></td>
      </tr>
      <tr>
        <td v-for="(product,i) in productSet" :key="i"><div>{{ product.biomarkerCount }}</div></td>
      </tr>
      </div>
    </table>
   <hr class="solid">
   <div class="h3 comparison-table-mobile__title">Biomarkers</div>
    <energy-metabolism  :productSet="productSet" />
    <bone-muscle :productSet="productSet"  />
    <strength-endurance  :productSet="productSet" />
    <cognition :productSet="productSet"/>
    <oxygen-blood :productSet="productSet"/>
    <electrolytes-fluid :productSet="productSet" :key="productSet.title" />
    <inflammation :productSet="productSet" :key="productSet.title" />
    <liver-toxicity :productSet="productSet" :key="productSet.title" />
    <div v-if="this.mobileProductOne"> </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CompareProducts from './compareTablesMobile/products'
import EnergyMetabolism from './compareTablesMobile/energy-metabolism'
import StrengthEndurance from './compareTablesMobile/strength-endurance'
import BoneMuscle from './compareTablesMobile/bone-muscle'
import Cognition from './compareTablesMobile/cognition'
import OxygenBlood from './compareTablesMobile/oxygen-blood'
import ElectrolytesFluid from './compareTablesMobile/electrolytes-fluid'
import Inflammation from './compareTablesMobile/inflammation'
import LiverToxicity from './compareTablesMobile/liver-toxicity'


export default {
name: 'compare-mobile',
components: {
      'energy-metabolism': EnergyMetabolism,
      'compare-products': CompareProducts,
      'strength-endurance': StrengthEndurance, 
      'bone-muscle': BoneMuscle,
      'cognition': Cognition,
      'oxygen-blood': OxygenBlood,
      'electrolytes-fluid': ElectrolytesFluid,
      'inflammation': Inflammation,
      'liver-toxicity': LiverToxicity
  },
  props: {
    settings: Object,
    blocks: Array,
    allProducts: Array,
    productsWithBiomarkers: Array,
    allBiomarkers: Array,
    product: Array,
  },
  data() {
    return {
      selectedFilter: '',
      activeIndex: '',
      productSet: '',
      mobileProduct: '',
    };
  },

  computed: mapState({
    kbProducts: (state) => state.kbProducts,
    shopifyProducts: (state) => state.shopifyProducts,
    shapedProducts: (state) => state.shapedProducts,
    comparisonTablePage: (state) => state.comparisonTablePage,
    comparisonTableProducts: (state) => state.comparisonTableProducts,
    mobileProductOne: (state) => state.mobileProductOne
  }),

  methods: {
    changeProductMobile(column) {
      this.productSet = [this.mobileProduct]
    }
  },
  created() {
    this.productSet = this.product
  },
  mounted() {
  },
  updated() {
  }
};
</script>
