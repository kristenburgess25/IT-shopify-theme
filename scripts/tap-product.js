/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 */
import { getUrlWithVariant, ProductForm } from "@shopify/theme-product-form";
import { formatMoney } from "@shopify/theme-currency";
import { load, register } from "@shopify/theme-sections";
import { forceFocus } from "@shopify/theme-a11y";
import Swiper, { Navigation } from "swiper";
import MicroModal from "micromodal";
import { createPopper } from "@popperjs/core";
Swiper.use([Navigation]);
import "./theme/components/faq";

const classes = {
  hide: "hide",
};

const keyboardKeys = {
  ENTER: 13,
};

const selectors = {
  submitButton: "[data-submit-button]",
  submitButtonText: "[data-submit-button-text]",
  comparePrice: "[data-compare-price]",
  comparePriceText: "[data-compare-text]",
  priceWrapper: "[data-price-wrapper]",
  imageWrapper: "[data-product-image-wrapper]",
  visibleImageWrapper: `[data-product-image-wrapper]:not(.${classes.hide})`,
  imageWrapperById: (id) => `${selectors.imageWrapper}[data-image-id='${id}']`,
  productForm: "[data-product-form]",
  productPrice: "[data-product-price]",
  productSelectorWrapper: ".selector-wrapper",
  productSelect: "select[name='options[Product]']",
  bloodDrawSelect: "select[name='options[Blood Draw]']",
  bloodDrawOption: "[data-option-value='Blood draw in lab']",
  bloodDrawLocation: "[data-blood-draw-location]",
  productCustomSelect: ".product-form__custom-select",
  thumbnail: "[data-product-single-thumbnail]",
  thumbnailById: (id) => `[data-thumbnail-id='${id}']`,
  thumbnailBySwipeId: (id) => `[data-slider-item-link='${id}']`,
  thumbnailActive: "[data-product-single-thumbnail][aria-current]",
  thumbnailSwipeActive: "[data-product-single-thumbnail].active-thumb",
  labBloodDraw: "Blood draw in lab",
  analysisOnly: "analysis only",
  includeBloodTest: "include blood test",
  showClass: "show",
  minimumMarkersBlock: "[data-min-markers-block]",
  minimumMarker: "[data-min-marker]",
  bloodDrawState: "bloodDraw-state",
  bloodDrawCountry: "bloodDraw-country",
};

const swiper = new Swiper(".swiper-container", {
  slidesPerView: 1.1,
  spaceBetween: 10,
  centeredSlides: true,
  breakpoints: {
    768: {
      spaceBetween: 0,
      slidesPerView: 1,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    afterInit: function(swiper) {
      if (document.querySelector("[data-slider-item-link]")) {
        document
          .querySelector(`[data-slider-slide-index="${swiper.activeIndex}"]`)
          .querySelector("[data-slider-item-link]")
          .classList.add("active-thumb");
      }
    },
  },
});
swiper.on("slideChange", function() {
  var previousThumb = document.querySelector(
    `[data-slider-slide-index="${swiper.previousIndex}"]`
  );
  var newThumb = document.querySelector(
    `[data-slider-slide-index="${swiper.activeIndex}"]`
  );
  newThumb
    .querySelector("[data-slider-item-link]")
    .classList.add("active-thumb");

  if (!previousThumb) {
    return;
  }
  previousThumb
    .querySelector("[data-slider-item-link]")
    .classList.remove("active-thumb");
});

register("product", {
  async onLoad() {
    const productFormElement = document.querySelector(selectors.productForm);

    if (productFormElement !== null) {
      this.product = await this.getProductJson(
        productFormElement.dataset.productHandle
      );
      this.productForm = new ProductForm(productFormElement, this.product, {
        onOptionChange: this.onFormOptionChange.bind(this),
      });
    }

    this.onThumbnailClick = this.onThumbnailClick.bind(this);
    this.onThumbnailKeyup = this.onThumbnailKeyup.bind(this);

    this.container.addEventListener("click", this.onThumbnailClick);
    this.container.addEventListener("keyup", this.onThumbnailKeyup);
  },

  onUnload() {
    this.productForm.destroy();
    this.removeEventListener("click", this.onThumbnailClick);
    this.removeEventListener("keyup", this.onThumbnailKeyup);
  },

  getProductJson(handle) {
    return fetch(`/products/${handle}.js`).then((response) => {
      return response.json();
    });
  },

  onFormOptionChange(event) {
    const variant = event.dataset.variant;

    this.renderImages(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);

    this.updateBrowserHistory(variant);
    this.variantSpecificMessages(variant);
  },

  onThumbnailClick(event) {
    const thumbnail = event.target.closest(selectors.thumbnail);

    if (!thumbnail) {
      return;
    }

    event.preventDefault();

    const swipeID = thumbnail.dataset.sliderSlideIndex;
    swiper.slideTo(swipeID);
    this.renderActiveSwipeThumbnail(swipeID);

    // this.renderFeaturedImage(thumbnail.dataset.thumbnailId);
    // this.renderActiveThumbnail(thumbnail.dataset.thumbnailId);
  },

  onThumbnailKeyup(event) {
    if (
      event.keyCode !== keyboardKeys.ENTER ||
      !event.target.closest(selectors.thumbnail)
    ) {
      return;
    }

    const visibleFeaturedImageWrapper = this.container.querySelector(
      selectors.visibleImageWrapper
    );

    forceFocus(visibleFeaturedImageWrapper);
  },

  renderSubmitButton(variant) {
    const submitButton = this.container.querySelector(selectors.submitButton);
    const submitButtonText = this.container.querySelector(
      selectors.submitButtonText
    );

    if (!variant) {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.unavailable;
    } else if (variant.available) {
      submitButton.disabled = false;
      submitButtonText.innerText = theme.strings.addToCart;
    } else {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.soldOut;
    }
  },

  renderImages(variant) {
    if (!variant || variant.featured_image === null) {
      return;
    }

    this.renderFeaturedImage(variant.featured_image.id);
    this.renderActiveThumbnail(variant.featured_image.id);
  },

  renderPrice(variant) {
    const priceElement = this.container.querySelector(selectors.productPrice);
    const priceWrapperElement = this.container.querySelector(
      selectors.priceWrapper
    );

    priceWrapperElement.classList.toggle(classes.hide, !variant);

    if (variant) {
      priceElement.innerText = formatMoney(variant.price, theme.moneyFormat);

      getMoreProducts(formatMoney(variant.price, theme.moneyFormat));
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const comparePriceElement = this.container.querySelector(
      selectors.comparePrice
    );
    const compareTextElement = this.container.querySelector(
      selectors.comparePriceText
    );

    if (!comparePriceElement || !compareTextElement) {
      return;
    }

    if (variant.compare_at_price > variant.price) {
      comparePriceElement.innerText = formatMoney(
        variant.compare_at_price,
        theme.moneyFormat
      );
      compareTextElement.classList.remove(classes.hide);
      comparePriceElement.classList.remove(classes.hide);
    } else {
      comparePriceElement.innerText = "";
      compareTextElement.classList.add(classes.hide);
      comparePriceElement.classList.add(classes.hide);
    }
  },

  renderActiveThumbnail(id) {
    const activeThumbnail = this.container.querySelector(
      selectors.thumbnailById(id)
    );
    const inactiveThumbnail = this.container.querySelector(
      selectors.thumbnailActive
    );

    if (activeThumbnail === inactiveThumbnail) {
      return;
    }
    if (inactiveThumbnail !== null) {
      inactiveThumbnail.removeAttribute("aria-current");
      activeThumbnail.setAttribute("aria-current", true);
    }
  },

  renderActiveSwipeThumbnail(id) {
    const activeThumbnail = this.container.querySelector(
      selectors.thumbnailBySwipeId(id)
    );
    const inactiveThumbnail = this.container.querySelector(
      selectors.thumbnailSwipeActive
    );

    if (activeThumbnail === inactiveThumbnail) {
      return;
    }
    if (inactiveThumbnail !== null) {
      inactiveThumbnail.classList.remove("active-thumb");
      activeThumbnail.classList.add("active-thumb");
    }
  },

  renderFeaturedImage(id) {
    const activeImage = this.container.querySelector(
      selectors.visibleImageWrapper
    );
    const inactiveImage = this.container.querySelector(
      selectors.imageWrapperById(id)
    );

    activeImage.classList.add(classes.hide);
    inactiveImage.classList.remove(classes.hide);
  },

  updateBrowserHistory(variant) {
    const enableHistoryState = this.productForm.element.dataset
      .enableHistoryState;

    if (!variant || enableHistoryState !== "true") {
      return;
    }

    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({ path: url }, "", url);
  },

  variantSpecificMessages(variant) {
    if (!variant) {
      return;
    }
    let allVariantMessages = document.querySelectorAll(
      ".info-message__variant-specific"
    );
    allVariantMessages.forEach(function(i) {
      i.style.display = "none";
    });
    let variantMessage = document.querySelector(
      "[data-variant-id='" + variant.id + "']"
    );
    if (!variantMessage) {
      return;
    }
    variantMessage.style.display = "grid";
  },
});

load("*");

//  DOCUMENT READY
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[data-product-details]").forEach((element) => {
    var content = document.getElementById(element.dataset.toggle);
    var height;
    if (content.classList.contains("expanded")) {
      content.style.height = "auto";
      height = content.clientHeight + 10 + "px";
      content.style.height = height;
    }

    element.addEventListener("click", function(e) {
      productDetails(e.target, content, height);
    });
  });

  productVariants();
  getMoreProducts();
  productDiscountData();
});

window.addEventListener("resize", function() {
  document.querySelectorAll("[data-product-details]").forEach((element) => {
    var content = document.getElementById(element.dataset.toggle);
    var height;
    if (content.classList.contains("expanded")) {
      content.style.height = "auto";
      height = content.clientHeight + 10 + "px";
      content.style.height = height;
    }
  });
});

function productDiscountData() {
  if (product_discounts.length < 1) {
    return;
  }
  for (var i = 0; i < product_discounts.length; i++) {
    var save_up_to = 0;

    if (parseInt(product_discounts[i].percent) > save_up_to) {
      save_up_to = parseInt(product_discounts[i].percent);
    }

    if (save_up_to == 0) {
      continue;
    }

    document.querySelector(
      "[data-multiunit-discount-message] button"
    ).innerHTML = "save up to " + save_up_to + "%";

    // grab the discount for quantity of 2
    var buy_two_index = product_discounts.find(function(discount, index) {
      if (discount.quantity == 2) {
        return true;
      }
    });

    //grab the discount for quantity of 4
    var buy_four_index = product_discounts.find(function(discount, index) {
      if (discount.quantity == 4) {
        return true;
      }
    });

    // find the popover
    var getModal = document.querySelector("#popover-0-0");

    // fill in numbers for buy 2
    if (buy_two_index) {
      getModal.querySelector("[data-buy-more-modal-value-1]").innerHTML =
        buy_two_index.value;
      getModal.querySelector(
        "[data-buy-more-modal-percent-1]"
      ).innerHTML = parseInt(buy_two_index.percent);
    }

    // fill in numbers for buy 4
    if (buy_four_index) {
      getModal.querySelector("[data-buy-more-modal-value-2]").innerHTML =
        buy_four_index.value;
      getModal.querySelector(
        "[data-buy-more-modal-percent-2]"
      ).innerHTML = parseInt(buy_four_index.percent);
    }
  }
}

document.querySelectorAll("[data-popper-trigger]").forEach(function(trigger) {
  trigger.addEventListener("click", function(e) {
    e.preventDefault();
    var tooltip = this.getAttribute("data-popper-controls");

    handlePopover(e.target, tooltip);
  });
});

function handlePopover(trigger, popover_id) {
  var tooltip = document.querySelector(popover_id);

  var instance = createPopper(trigger, tooltip, {
    position: "bottom",
  });
  document
    .querySelector("#popover-overlay")
    .setAttribute("aria-hidden", "false");
  tooltip.setAttribute("data-show", "");
  instance.setOptions({ placement: "bottom" });

  document
    .querySelector("#popover-overlay")
    .addEventListener("click", function() {
      destroyPopover(tooltip, instance);
    });
}
function destroyPopover(tooltip, instance) {
  tooltip.removeAttribute("data-show");
  document
    .querySelector("#popover-overlay")
    .setAttribute("aria-hidden", "true");
  instance.destroy();
}

// Accordions for product details
function productDetails(el, content, height) {
  // expand or collapse the options on clicked

  if (!content.classList.contains("expanded")) {
    content.classList.add("expanded");
    el.classList.add("expanded");

    content.style.height = "auto";
    height = content.clientHeight + "px";
    content.style.height = "0px";

    setTimeout(function() {
      content.style.height = height;
    }, 0);
  } else {
    content.style.height = "0px";
    el.classList.remove("expanded");
    content.addEventListener(
      "transitionend",
      function() {
        content.classList.remove("expanded");
      },
      {
        once: true,
      }
    );
  }
}

function productVariants() {
  const container = document.querySelector(selectors.productForm);
  const defaultFormOptions = container.querySelectorAll(
    selectors.productSelectorWrapper
  );
  const productOption = container.querySelector(selectors.productSelect);
  const bloodDraw = container.querySelector(selectors.bloodDrawSelect);

  const bloodDrawState = container.querySelector(selectors.bloodDrawState);
  const bloodDrawCountry = container.querySelector(selectors.bloodDrawCountry);

  if (!productOption && !bloodDraw) {
    return;
  }

  // check for Analysis Only on load
  if (productOption) {
    if (productOption.value.toLowerCase() == selectors.analysisOnly) {
      hideBloodDraw();
      toggleBiomarkers(selectors.showClass);
    } else {
      showBloodDraw();
      toggleBiomarkers();
    }
  } else {
    showBloodDraw();
    toggleBiomarkers();
  }

  if (bloodDraw) {
    var countrySelect = new Shopify.CountryProvinceSelector(
      "bloodDraw-country",
      "bloodDraw-state",
      {
        hideElement: "address_province_container_new",
      }
    );
  }

  // handle product option buttons
  defaultFormOptions.forEach((el) => {
    if (el.querySelector("select").length) {
      var selectContainer = el.querySelector("select");

      var optionContainer = el.querySelector(".product-form__custom-select");

      if (!optionContainer) {
        return;
      }

      var optionButtons = optionContainer.querySelectorAll("button");

      optionButtons.forEach((opt) => {
        opt.addEventListener("click", (e) => {
          e.preventDefault();
          if (optionContainer.querySelector("button.selected") != null) {
            optionContainer
              .querySelector("button.selected")
              .classList.remove("selected");
          }
          e.target.classList.add("selected");

          selectContainer.value = e.target.dataset.optionValue;
          selectContainer.dispatchEvent(new Event("change"));

          if (selectContainer.value.toLowerCase() == selectors.analysisOnly) {
            hideBloodDraw();
            toggleBiomarkers("show");
          }
          if (
            selectContainer.value.toLowerCase() == selectors.includeBloodTest
          ) {
            showBloodDraw();
            toggleBiomarkers();
          }
        });
      });
    }
  });

  if (!productOption) {
    return;
  }

  // check for Analysis Only on load
  if (productOption.value.toLowerCase() == "analysis only") {
    hideBloodDraw();
    toggleBiomarkers("show");
  } else {
    showBloodDraw();
    toggleBiomarkers();
  }

  function hideBloodDraw() {
    bloodDraw.value = "None";
    bloodDraw.dispatchEvent(new Event("change"));
    bloodDraw.closest(selectors.productSelectorWrapper).style.display = "none";
    container.querySelector(selectors.bloodDrawLocation).style.display = "none";

    document
      .querySelectorAll(".info-message__blood-draw-type")
      .forEach(function(i) {
        i.style.display = "none";
      });
  }

  function showBloodDraw() {
    bloodDraw.value = "Blood draw in lab";
    bloodDraw.dispatchEvent(new Event("change"));
    bloodDraw.closest(selectors.productSelectorWrapper).style.display = "block";
    container.querySelector(selectors.bloodDrawLocation).style.display = "flex";
    if (
      bloodDraw
        .closest(selectors.productSelectorWrapper)
        .querySelector("button.selected") != null
    ) {
      bloodDraw
        .closest(selectors.productSelectorWrapper)
        .querySelector("button.selected")
        .classList.remove("selected");
    }
    bloodDraw
      .closest(selectors.productSelectorWrapper)
      .querySelector(selectors.bloodDrawOption)
      .classList.add("selected");

    document
      .querySelectorAll(".info-message__blood-draw-type")
      .forEach(function(i) {
        i.removeAttribute("style");
      });
  }

  function toggleBiomarkers(n) {
    if (document.querySelector(selectors.minimumMarkersBlock)) {
      if (n == "show") {
        document.querySelectorAll(selectors.minimumMarker).forEach(function(m) {
          m.style.display = "none";
        });
        document
          .querySelectorAll(selectors.minimumMarkersBlock)
          .forEach(function(m) {
            m.style.display = "block";
          });
      } else {
        document.querySelectorAll(selectors.minimumMarker).forEach(function(m) {
          m.style.display = "block";
        });

        document
          .querySelectorAll(selectors.minimumMarkersBlock)
          .forEach(function(m) {
            m.style.display = "none";
          });
      }
    }
  }
}
document
  .querySelector("[data-quantity-input")
  .addEventListener("change", function(e) {
    if (this.value > 10) {
      MicroModal.show("quantity-modal");
    }
  });
document
  .querySelector("[data-us-blood-draw]")
  .addEventListener("click", function(e) {
    e.preventDefault();
    MicroModal.show("us-blood-modal");
  });
document
  .querySelector("[data-canada-blood-draw]")
  .addEventListener("click", function(e) {
    e.preventDefault();
    MicroModal.show("can-blood-modal");
  });

// populate country selection
if (document.querySelector("select[name='properties[Country]'")) {
  let allCountries = document.querySelector("#all_countries");
  available_countries.forEach((country) => {
    let findCountryOption = allCountries.querySelector(
      "[value='" + country + "']"
    );

    if (findCountryOption) {
      document
        .querySelector("select[name='properties[Country]'")
        .appendChild(findCountryOption);
    }
  });
}

// LOCATION SELECTION
Shopify.CountryProvinceSelector = function(
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  this.countryEl.addEventListener("change", this.countryHandler.bind(this));
  this.provinceEl.addEventListener("change", this.provinceHandler.bind(this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    const value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    const value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  disableLabDraw: function(e) {
    const container = document.querySelector("[data-product-form]");
    const bloodDraw = container.querySelector(
      "select[name='options[Blood Draw]']"
    );
    bloodDraw.value = "Mobile blood draw";
    bloodDraw.dispatchEvent(new Event("change"));
    bloodDraw
      .closest(".selector-wrapper")
      .querySelector("[data-option-value='Blood draw in lab']")
      .classList.remove("selected");
    bloodDraw
      .closest(".selector-wrapper")
      .querySelector("[data-option-value='Blood draw in lab']").disabled = true;
    bloodDraw
      .closest(".selector-wrapper")
      .querySelector("[data-option-value='Mobile blood draw']")
      .classList.add("selected");
  },

  enableLabDraw: function(e) {
    const container = document.querySelector("[data-product-form]");
    const bloodDraw = container.querySelector(
      "select[name='options[Blood Draw]']"
    );
    bloodDraw
      .closest(".selector-wrapper")
      .querySelector(
        "[data-option-value='Blood draw in lab']"
      ).disabled = false;
  },

  countryHandler: function(e) {
    const opt = this.countryEl.options[this.countryEl.selectedIndex];
    const raw = opt.getAttribute("data-provinces");
    const provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      this.setOptions(this.provinceEl, provinces);
      if (this.provinceContainer) {
        this.provinceContainer.style.display = "";
      }
    }

    if (opt.text == "Canada") {
      MicroModal.show("can-blood-modal");
      this.disableLabDraw();
      document.querySelector(".info-message__us").classList.add("hide");
      document.querySelector(".info-message__canada").classList.remove("hide");
    } else {
      this.enableLabDraw();
      document.querySelector(".info-message__canada").classList.add("hide");
      document.querySelector(".info-message__us").classList.remove("hide");
    }
    if (opt.text == "United States") {
      document.querySelector("[data-state-label]").style.display = "block";
      document.querySelector("[data-province-label]").style.display = "none";
    } else {
      document.querySelector("[data-state-label]").style.display = "none";
      document.querySelector("[data-province-label]").style.display = "block";
    }
  },

  provinceHandler: function(e) {
    if (
      RESTRICTED_STATES.includes(e.target.options[e.target.selectedIndex].text)
    ) {
      MicroModal.show("us-blood-modal");
      this.disableLabDraw();
    } else {
      this.enableLabDraw();
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (let i = 0, count = values.length; i < values.length; i++) {
      const opt = document.createElement("option");
      opt.value = values[i][0];
      opt.innerHTML = values[i][1];
      selector.appendChild(opt);
    }
  },
};

Shopify.setSelectorByValue = function(selector, value) {
  for (let i = 0, count = selector.options.length; i < count; i++) {
    const option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

function getMoreProducts(x) {
  var container = document.querySelector(
    "#shopify-section-pdp-get-more-bundle"
  );
  if (!container) {
    return;
  }

  var currentPrice = 0;
  if (x) {
    currentPrice = x.replace(/\$/g, "");
  } else {
    currentPrice = parseInt(
      container.querySelector(".product-card[data-current-product]").dataset
        .productPrice
    );
  }
  var totalPrice = parseInt(currentPrice);
  container
    .querySelectorAll(".product-card[data-product-id]")
    .forEach(function(prod) {
      totalPrice = totalPrice + parseInt(prod.dataset.productPrice);
    });
  container.querySelector(".get-more-with__price-column--price").innerHTML =
    "$" + totalPrice;
}

if (document.querySelector("#getMoreProductsCart")) {
  document
    .querySelector("#getMoreProductsCart")
    .addEventListener("click", function(e) {
      e.preventDefault();

      var cartText = e.target.innerText;
      e.target.innerHTML = "Loading...";
      e.target.setAttribute("disabled", "disabled");

      //get the form data for the current product
      let addToCartForm = document.querySelector('form[action="/cart/add"]');
      let formData = new FormData(addToCartForm);
      var currentProductForm = {
        properties: {},
      };
      for (var key of formData.keys()) {
        if (key.includes("properties")) {
          currentProductForm["properties"][
            key.match(/\[(.*?)\]/)[1]
          ] = formData.get(key);
        } else {
          currentProductForm[key] = formData.get(key);
        }
      }
      let productItems = {
        items: [],
      };
      productItems["items"].push(currentProductForm);
      // get the ids of any additional products
      var container = e.target.closest("#shopify-section-pdp-get-more-bundle");
      container
        .querySelectorAll(".product-card[data-product-id]")
        .forEach(function(el) {
          productItems["items"].push({
            id: el.dataset.productId,
            quantity: 1,
          });
        });
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productItems),
      })
        .then((response) => {
          if (!response.ok) {
            e.target.innerHTML = cartText;
            e.target.removeAttribute("disabled");
          } else {
            window.location.href = "/cart";
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}
