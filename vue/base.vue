<template>
  <div class="home-page-wrapper">
      <div v-show="mobileFilter" class="filters-container filter-mobile">
        <div class="filter-btn-container">
          <button v-on:click="openMobileFilter(false, $event)" class="filter-btn-container mobile-filter-x">X</button>
        </div>
        <p class="list-header">Filter Plans</p>
        <ul id="filter-by-goal">
            <li 
              v-for="(filter, index) in goalFilters"
              :key="filter" 
              :class="{ 'active': activeIndex === index }"
              @click="setActive(filter, index)"
            > 
              {{ filter }} 
            </li>
        </ul>
        <br /> 
      </div>

    <div class="filter-btn-container"> 
      <button v-show="!mobileFilter" v-on:click="openMobileFilter(true, $event)" class="filter-btn">
        Filter Plans 
      </button>
    </div>
    <div class="subscription">
      
      <!-- /// FILTER COLUMN DESKTOP /// -->
      <div class="filters-container">
        <p class="list-header">Filter Plans </p>
        <ul id="filter-by-goal">
            <li 
              v-for="(filter, index) in goalFilters"
              :key="filter" 
              :class="{ 'active': activeIndex === index }"
              @click="setActive(filter, index)"
            > 
              {{ filter }} 
            </li>
        </ul>
        <br /> 
        <!-- <p class="list-header">Other filters </p>
        <ul id="filter-by-goal">
            <li 
              v-for="filter in otherFilters" 
              :key="filter" 
              :class="{ 'active': activeIndex === index }"
              @click="setActive(filter, index)"
            > 
              {{ filter }}
            </li>
        </ul> -->
        <div class="gift-card-cta-container">
          <h4>
            {{ settings.gift_card_cta_text_main}}
          </h4>
          <p> {{ settings.gift_card_cta_subheading}} </p>
          <button class="button button--bright" @click="handleClick('gift')">
          {{ settings.gift_card_cta_button_text}}
          </button>
        </div>

        <div class="compare-plans-cta-container">
          <h4>
            {{ settings.compare_plans_cta_text }}
          </h4>
          <button class="button button--primary-inverse" @click="handleClick('compare')">
            {{ settings.compare_plans_cta_button_text}}
          </button>
        </div>
      </div>

      <div v-if="shapedProducts" id="home-cards-container">
        <div id="shop-all-product-container" v-if="selectedFilter">
          <div v-for="product in this.filteredProductSet" :key="product.id"> 
            <product-card :product="product" />
          </div>
        </div>

          
        <div v-else id="shop-all-product-container">
          <div v-for="product in this.shapedProducts" :key="product.id"> 
            <product-card :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import productCard from './product-card'

export default {
  name: 'home-page',
  components: { 
    productCard 
  },
  props: {
    settings: Object,
    blocks: Array,
    allProducts: Array,
    productsWithBiomarkers: Array,
    allBiomarkers: Array,
  },
  data() {
    return {
      selectedFilter: '',
      activeIndex: '',
      filteredProductSet: [],
      goalFilters: '',
      otherFilters: '',
      mobileFilter: false, 
    };
  },

  computed: mapState({
    kbProducts: (state) => state.kbProducts,
    shopifyProducts: (state) => state.shopifyProducts,
    overallHealthFilter: (state) => state.categories.overallHealth,
    healthyAgingFilter: (state) => state.categories.healthyAging,
    shapedProducts: (state) => state.shapedProducts
  }),

  methods: {
    openMobileFilter(bool, e) {
      e.stopPropagation()
      this.mobileFilter = bool; 
    },
    handleClick(cta) {
      console.log('hit cta click')
      if(cta == "compare") {
        window.location.href = this.settings.compare_plans_cta_url
      }

      if(cta == "gift") {
        window.location.href = this.settings.gift_card_cta_url
      }
    },
    setAllFilters () {
      let goalFilters = this.settings.goalFilters.split(',') 
      let otherFilters = this.settings.otherFilters.split(',')
      this.goalFilters = goalFilters;
      this.otherFilters = otherFilters; 
    },
    setBiomarkers() {
      let biomarkerCategories = []

      this.allBiomarkers.forEach(marker => {
        if (marker.markers) {
          console.log('marker title', marker.title);
          console.log('markers', marker.markers)
          let markersArray = marker.markers[0].split('|')
          console.log('markers', markersArray)

        let biomarker = {
          header: marker.title,
          markers: markersArray,
        }

        biomarkerCategories.push(biomarker)
        }
      })
      console.log('biomarker categories', biomarkerCategories)
      

    },
    setActive(selected, index) { 
      this.activeIndex = index;
      this.selectedFilter = selected
      this.setFilter(selected)
    },
    setFilter(selected) {
      console.log('selected filter', selected)
      if(selected.trim() == "All") {
        this.selectedFilter = ''
      } else this.selectedFilter = selected

      if(selected.trim() == "Price") {
         let filteredByPrice = this.shapedProducts.sort((a, b) => parseFloat(b.price - a.price))
         return this.filteredProductSet = filteredByPrice
      } else this.setFilteredProducts()
    },
    setFilteredProducts() {
      let allProducts = this.shapedProducts
      let filteredProducts = []

      allProducts.forEach(product => {
        let cats = product.categories

        cats.forEach(cat => {
          let catString = cat.trim().toLowerCase()
          let filterString = this.selectedFilter.trim().toLowerCase()

          if(catString == filterString) {
            console.log('WE HAVE A GD MATCH', catString, filterString)
            filteredProducts.push(product)
          }
        })
      })

      console.log('matching filtered products', filteredProducts)
      this.filteredProductSet = filteredProducts;

    },

    //for some reason, getting build errors when trying to mapMutations...
    // ...mapMutations([
    //   'setAllProducts',
    // ]),
  },
  created() {
    console.log('VUE APP WAS CREATED!!!! ')
    let theProducts = this.productsWithBiomarkers

    this.$store.commit("setAllProducts", theProducts)
  },
  mounted() {
    console.log('VUE APP WAS MOUNTED!!!')
    console.log('biomarkers in vue???', this.allBiomarkers)
    this.$store.dispatch("setProductData")
    this.setAllFilters()
    this.setBiomarkers()
  },
};
</script>
