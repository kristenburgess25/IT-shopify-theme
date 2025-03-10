/**
 * Main JS --  -- The Taproom
 *
 * eg: import "./sections/header";
 */

/* Shopify Starter Theme Scripts */

import "./starter/starter-index";
import { focusHash, bindInPageLinks } from "@shopify/theme-a11y";
import MicroModal from "micromodal"; // es6 module

// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (window.navigator.cookieEnabled) {
  document.documentElement.className = document.documentElement.className.replace(
    "supports-no-cookies",
    "supports-cookies"
  );
}

/* Theme Components */
import "./theme/components/modal";
import "./theme/components/gift-card-lookup";

// Snippets

// Sections

// Templates
// Navigation

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "0px";
  }
  prevScrollpos = currentScrollPos;
}


setTimeout(function(){
  const filterActive = document.querySelectorAll('#filter-by-goal li'); 
  const filterActiveMobile = document.querySelectorAll('.filter-mobile #filter-by-goal li'); 
  filterActiveMobile[0].className="active";

  filterActive[5].className='active';
 document.onclick = function(e) {
   if(e.target != filterActive[5]) {
      filterActive[5].classList.remove("active");  
   } 
 }

 $( ".filter-btn" ).replaceWith(`<button class="filter-btn-mobile">Filter Plans</button>` );
 const mobileFilter = document.querySelector('.filter-mobile');
 mobileFilter.style.display = "block";
 
 $(".filter-btn-mobile").click(function(){
   
 mobileFilter.style.transform = "translateY(0px) translateX(0)";
 
  $( ".home-page-wrapper" ).append(`<div class="overlay-filter"></div>` );
  $(".mobile-filter-x").html(`<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" viewBox="0 0 40 40"><path d="M23.868 20.015L39.117 4.78c1.11-1.108 1.11-2.77 0-3.877-1.109-1.108-2.773-1.108-3.882 0L19.986 16.137 4.737.904C3.628-.204 1.965-.204.856.904c-1.11 1.108-1.11 2.77 0 3.877l15.249 15.234L.855 35.248c-1.108 1.108-1.108 2.77 0 3.877.555.554 1.248.831 1.942.831s1.386-.277 1.94-.83l15.25-15.234 15.248 15.233c.555.554 1.248.831 1.941.831s1.387-.277 1.941-.83c1.11-1.109 1.11-2.77 0-3.878L23.868 20.015z" class="layer"/></svg>`);
  $("#navbar").css("z-index","80");
  console.log('open sidebar');
});
$(".mobile-filter-x").click(function(){

 mobileFilter.style.transform = "translateX(-100%)";
  $( ".overlay-filter" ).remove();
 
  console.log('close sidebar');
});
$(".filters-container li").click(function(){
  const filterActiveMobile = document.querySelectorAll('.filter-mobile #filter-by-goal li');  
 mobileFilter.style.transform = "translateX(-100%)";
  $(".filter-btn").css("display","initial");
  $( ".overlay-filter" ).remove();
  filterActiveMobile[0].classList.remove("active");   
  console.log('close sidebar');
});
$( ".filter-mobile" ).append(`<a href="/pages/compare-products" class="cta-filter-mobile">Compare Plans</a>` );

function myFunction(x) { 
  const mobileFilter = document.querySelector('.filter-mobile'); 
  if (x.matches) { 
    mobileFilter.style.display = "block";
  } else {
    mobileFilter.style.display = "none";
  }
}

var x = window.matchMedia("(max-width: 700px)")
myFunction(x) 
x.addListener(myFunction) 

 }, 3000);