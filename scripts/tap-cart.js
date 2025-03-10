import MicroModal from "micromodal";
import { createPopper } from "@popperjs/core";
import "./theme/components/faq";

let failObj = {
  state: false,
  country: false,
  quantity: false,
  variantId: 0,
  line: 0,
  url: "",
};

let checkCartContents = async function() {
  async function getCart() {
    const result = await fetch("/cart.json");

    if (result.status === 200) {
      return result.json();
    }

    throw new Error(
      `Failed to get request, Shopify returned ${result.status} ${result.statusText}`
    );
  }

  const cart = await getCart();

  cart.items.forEach((item, idx) => {
    // TODO: Fix the includes text to actually reflect the appropriate choice
    if (
      RESTRICTED_STATES.includes(item.properties["Province"]) &&
      item.variant_title.includes("Mobile")
    ) {
      failObj.state = true;
      failObj.variantId = item.variant_id;
      failObj.line = idx + 1;
      failObj.url = item.url;
    } else if (item.properties["Country"] == "Canada") {
      failObj.country = true;
      failObj.variantId = item.variant_id;
      failObj.line = idx + 1;
      failObj.url = item.url;
    } else if (item.quantity > 10) {
      failObj.quantity = true;
      failObj.variantId = item.variant_id;
      failObj.line = idx + 1;
    }
  });

  return failObj;
};

function setupRemoveBtnListener(btn, obj) {
  btn.addEventListener("click", function(e) {
    updateCartQuantity().then((value) => {
      value(obj.line, 0);
      setTimeout(() => {
        window.location.href = obj.url;
      }, 500);
    });
  });
}

function handleModalOptions(obj) {
  const addToCartModalBtn = document.querySelectorAll(".button.add");

  if (addToCartModalBtn.length) {
    addToCartModalBtn.forEach((button) => {
      setupRemoveBtnListener(button, obj);
    });
  } else if (addToCartModalBtn) {
    setupRemoveBtnListener(addToCartModalBtn, obj);
  }
}

// TODO: Finish fleshing out this section when we figure out what we want to do
function updateQty(obj) {
  const cartItems = document.querySelectorAll(".page-width tr.cart__row");
  if (cartItems.length) {
    const cartItem = cartItems[obj.line - 1];
    const qtyInputs = cartItem.querySelectorAll(".cart__qty-input");

    if (qtyInputs.length) {
      updateCartQuantity().then((value) => {
        value(obj.line, 10);
      });
    }
  }
}

let updateCartQuantity = async function() {
  async function updateItem(data) {
    const result = await fetch("/cart/change.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    return result.json();
  }

  let updateItemByLine = function(lineIdx, qty) {
    return updateItem({ line: lineIdx, quantity: qty });
  };

  return updateItemByLine;
};

function setupCheckout() {
  // get checkout button
  const checkoutBtn = document.querySelector("#checkout_btn");

  // listen for click event
  checkoutBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    checkCartContents().then((value) => {
      // check the above values to see if any fail, if so, return / prevent default. else, go to checkout
      if (value.state) {
        MicroModal.show("us-blood-modal");
        handleModalOptions(value);
      } else if (value.country) {
        MicroModal.show("can-blood-modal");
        handleModalOptions(value);
      } else if (value.quantity) {
        MicroModal.show("quantity-modal");
        // Commenting this out for now based on review call with IT team on 7/29
        // Ben and Slava don't want to put a strong limit of 10, just trigger the modal
        // We can revisit if needed! --Jackie
        // updateQty(value);
      } else {
        ga("send", {
          hitType: "event",
          eventCategory: "Checkout",
          eventAction: "click",
          eventLabel: "Checkout Started",
        });

        window.location.href = "/checkout";
      }
    });
  });
}

function cartProductData() {
  for (var i = 0; i < line_item_discounts.length; i++) {
    var product = line_item_discounts[i];
    var cart_item = document.querySelectorAll(
      "[data-cart-item-key*='" + product.variant_id + ":']"
    );
    if (!cart_item) {
      continue;
    }

    var discounts = product.discounts;
    var save_up_to = 0;
    for (var j = 0; j < discounts.length; j++) {
      if (parseInt(discounts[j].percent) > save_up_to) {
        save_up_to = parseInt(discounts[j].percent);
      }
    }

    if (save_up_to == 0) {
      continue;
    }

    cart_item.forEach(function(item) {
      item.querySelector("[data-multiunit-discount-message] button").innerHTML =
        "save up to " + save_up_to + "%";
    });

    // grab the discount for quantity of 2
    var buy_two_index = discounts.find(function(discount, index) {
      if (discount.quantity == 2) {
        return true;
      }
    });

    // grab the discount for quantity of 4
    var buy_four_index = discounts.find(function(discount, index) {
      if (discount.quantity == 4) {
        return true;
      }
    });

    // find the popover
    var getModal = document.querySelector(
      "#popover-" + product.variant_id + "-" + (i + 1)
    );

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

window.addEventListener("DOMContentLoaded", function() {
  setupCheckout();

  cartProductData();
});

// Inner Age Addon Modal
document
  .querySelectorAll("[data-innerage-addon-learn-more]")
  .forEach(function(innerAge) {
    innerAge.addEventListener("click", function(e) {
      e.preventDefault();
      var targetProduct = e.target.getAttribute("data-innerage-addon-product");
      var modal = document.querySelector("#inner-age-addon");
      // hide all contents of addon modal
      modal
        .querySelectorAll("[data-innerage-addon-content]")
        .forEach(function(content) {
          content.style.display = "none";
        });
      // show only corresponding message
      var innerAgeMessage = modal.querySelector(
        "[data-innerage-addon-product='" + targetProduct + "']"
      );
      if (innerAgeMessage) {
        modal.querySelector(
          "[data-innerage-addon-product='" + targetProduct + "']"
        ).style.display = "block";
      } else {
        modal.querySelector(
          "[data-innerage-addon-product='default']"
        ).style.display = "block";
      }

      // open modal
      MicroModal.show("inner-age-addon");
    });
  });

// Buy More and Save Popovers
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
    position: "bottom-end",
  });
  document
    .querySelector("#popover-overlay")
    .setAttribute("aria-hidden", "false");
  tooltip.setAttribute("data-show", "");
  instance.setOptions({ placement: "bottom-end" });

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

$( document ).ready(() => {
    $('.cart__row').each(function (i) {
      if ($(this).attr('data-cart-item-quantity') == '1') {

        $(this).each(function () {
          console.log('show');
          $('.show-info-1').hide();
        });
      }
    });
  });

// Inner Age Addon Add To Cart
document
  .querySelectorAll("[data-innerage-addon-add-to-cart]")
  .forEach(function(addInnerAge) {
    addInnerAge.addEventListener("click", function(e) {
      e.preventDefault();
      // find the current products option data using the cart index

      var productIndex = e.target.getAttribute(
        "data-innerage-addon-linked-product-index"
      );
      var itemCartIndex = parseInt(productIndex) + 2;

      var currentOptions = current_line_items[productIndex];
      var optionsCount = currentOptions.options.length;
      var findAddOn = currentOptions.options
        .map((option) => {
          return option.name;
        })
        .indexOf("AddOn");
      currentOptions.options[findAddOn].value = "InnerAge 2.0";

      var productVariants = product_json[productIndex].variants;
      // get the current product options from the page
      switch (optionsCount) {
        case 1:
          var newVariant = productVariants.find((variant) => {
            return variant.option1 == currentOptions.options[0].value;
          });
          break;
        case 2:
          var newVariant = productVariants.find((variant) => {
            return (
              variant.option1 == currentOptions.options[0].value &&
              variant.option2 == currentOptions.options[1].value
            );
          });
          break;
        case 3:
          var newVariant = productVariants.find((variant) => {
            return (
              variant.option1 == currentOptions.options[0].value &&
              variant.option2 == currentOptions.options[1].value &&
              variant.option3 == currentOptions.options[2].value
            );
          });
          break;
      }

      var currentProductId = currentOptions.variant;
      var newProductId = newVariant.id;

      var request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json;",
        },
        body: JSON.stringify({
          line: itemCartIndex,
          quantity: 0,
        }),
      };

      // get the current properties
      var addProduct = fetch("/cart.js")
        .then((response) => response.json())
        .then((response) => {
          let newData = {
            quantity: response.items[productIndex].quantity,
            properties: response.items[productIndex].properties,
            id: newProductId,
          };
          var addProduct = {
            method: "POST",
            headers: {
              "Content-Type": "application/json;",
            },
            body: JSON.stringify({
              quantity: response.items[productIndex].quantity,
              properties: response.items[productIndex].properties,
              id: newProductId,
            }),
          };
          return fetch("/cart/add.js", addProduct);
        })
        .then((response) => {
          if (response.ok) {
            ga("send", {
              hitType: "event",
              eventCategory: "Added to Cart",
              eventAction: "click",
              eventLabel: "InnerAge Added",
            });

            return fetch("/cart/change.js", request);
          } else {
            alert("Error!");
          }
        })
        .then((response) => {
          if (response && response.ok) {
            window.location.href = "/cart";
          } else {
            alert("Error!");
          }
        });

      //
      // .then((response) => {
      //   if (response.ok) {
      //     return fetch("/cart/change.js", request);
      //   }
      // })
      // .then((response) => {
      //   if (response.ok) {
      //     window.location.href = "/cart";
      //   }
      // });
    });
  });

function handleAddonProduct(changeData, addonProductData) {
  fetch("/cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changeData),
  })
    .then(function(response) {
      if (response.ok) {
        return fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addonProductData),
        });
      }
    })
    .then((response) => response.json())
    .then((response) => {
      fetch("/cart.js")
        .then((response) => response.json())
        .then((response) => {
          let newData = {
            quantity: response.items[productIndex].quantity,
            properties: response.items[productIndex].properties,
            id: newProductId,
          };
          var addProduct = {
            method: "POST",
            headers: {
              "Content-Type": "application/json;",
            },
            body: JSON.stringify({
              quantity: response.items[productIndex].quantity,
              properties: response.items[productIndex].properties,
              id: newProductId,
            }),
          };
          return fetch("/cart/add.js", addProduct);
        })
        .then((response) => {
          if (response.ok) {
            return fetch("/cart/change.js", request);
          } else {
            alert("Error!");
          }
        })
        .then((response) => {
          if (response && response.ok) {
            window.location.href = "/cart";
          } else {
            alert("Error!");
          }
        });
    });

}


$('.list-cart-item>li').each(function(i) {
  $('[id="' + this.id + '"]').slice(1).remove();
  });


$('.list-cart-item').each(function(){
    var liLength = $(this).find('.upsell-cart').length;
    var max = 1;        
    if (liLength > max) { 
      $(this).find('li:gt('+max+')').hide();
     

    }

});

$('.add-to-cart-btn').click(() => {
    let variantId = document.querySelector('.add-to-cart-btn');
    let formData = {
      'items': [{
        'id': variantId.dataset.id,
        'quantity': 1
      }]
    };

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });


$(document).on("click", ".upsell-modal", function () {
  var productId = $(this).data('title');
  var productPriceModal = $(this).data('price');
  var labVariant = $(this).data('lab');
  var labTitle = $(this).data('labtitle');
  var mobileVariant = $(this).data('mobile');
  var mobileTitle = $(this).data('mobiletitle');
  var productImage = $(this).data('image');
  var variantMobilePrice = $(this).data('variantprice'); 
  var product_handle = $(this).data('handle');
  var tagTitle = $(this).data('tagtitle');
  var dataSku = $(this).data('skuvariant');


$('.product-title').text(productId);
$('.product-price-modal').text(productPriceModal);
$('.modal-upsell-image').attr("src", productImage);
$('.blood-option').text(labTitle);
$('.blood-option').val(labVariant);
$('.mobile-option').text(mobileTitle); 
$('.mobile-option').val(mobileVariant);
$('.mobile-variant-price').text(variantMobilePrice);
$('.viewdetails').attr("href", "/products/" + product_handle);
$(".most-popular-upsell-text").addClass(tagTitle);
$('.trustpilot-widget' ).data('sku', dataSku);



$('.mobile-box-option').click(function() {
  $(this).addClass('selected');
  $('.blood-box-option').removeClass('selected');
  $('.mobile-option').attr('selected', '');  
  const priceClickVariant = document.querySelector('.mobile-variant-price');
  const totalVariant = document.querySelector('.product-price-modal');
  totalVariant.textContent=priceClickVariant.textContent;
});

$("#address_country_new").change(function(){
  var selectedCountry = $(this).children("option:selected").val();
  console.log("You have selected the country - " + selectedCountry);
if(selectedCountry == 'Canada'){
  $('.info-message__inner').text(`Users in Canada are required to use our mobile phlebotomy option, called mobile blood draw. For an additional fee, a registered phlebotomist will travel to your home or office to draw blood.`);
  $('.blood-box-option').removeClass('selected');
  $('.mobile-box-option').addClass('selected');
  $('.blood-box-option').addClass('dis');
  $('.mobile-option').attr('selected', ''); 
} else {
  $('.info-message__inner').text(`Available in New York, New Jersey, and Rhode Island only through mobile blood draw`);};
});

$("#address_province_new").change(function(){
  var selectedProvince = $(this).children("option:selected").val();
  console.log("You have selected the province - " + selectedProvince);
  if ( (selectedProvince == 'New Jersey') || (selectedProvince == 'New York') || (selectedProvince == 'Rhode Island') ){
  $('.info-message__inner').text(`Users in your state are required to use our mobile phlebotomy option, called mobile blood draw. For an additional fee, a registered phlebotomist will travel to your home or office to draw blood.`);
  $('.blood-box-option').removeClass('selected');
  $('.mobile-box-option').addClass('selected');
  $('.blood-box-option').addClass('dis');  
  $('.mobile-option').attr('selected', ''); 
} else {
  $('.info-message info-message__us').remove();};
});


$('.blood-box-option').click(function() {
  $(this).addClass('selected');
  $('.mobile-box-option').removeClass('selected');
  $('.blood-option').attr('selected', ''); 
  $('.product-price-modal').text(productPriceModal);
}); 

$(".modal-upsell-quantity-input").on("change paste keyup", function() {
  var changeValueInput = $(this).val();
   $("#select-modal-options").attr("quantity", changeValueInput);
  });

$('.product-form__cart-submit').click(() => {
  var variantUpsellId = $('#select-modal-options').find(":selected").val();
  var countrySelected = $('#address_country_new').find(":selected").val();
  var provinceSelected = $('#address_province_new').find(":selected").val();
  var quantity = document.querySelector('#select-modal-options').attributes.quantity.value;

  let formData = {
    'items': [{
      'id': variantUpsellId,
      'quantity': quantity,
      'properties': {
      "country": countrySelected,
      "province": provinceSelected
   }
    }]
  };

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});


     // Initialize observers on address selectors
new Shopify.CountryProvinceSelector('address_country_new', 'address_province_new', {
 hideElement: 'address_province_container_new'
}); 

});



