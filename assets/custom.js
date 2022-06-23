/*
* Pipeline Theme
*
* Use this file to add custom Javascript to Pipeline.  Keeping your custom
* Javascript in this fill will make it easier to update Pipeline. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*
*/


(function() {

  // Below are example event listeners.  They listen for theme events that Pipeline
  // fires in order to make it easier for you to add customizations.

  // Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.


  document.addEventListener('theme:variant:change', function(event) {
    // You might use something like this to write a pre-order feature or a
    // custom swatch feature.
    var variant = event.detail.variant;
    var container = event.target;
    if (variant) {
      console.log('Container ———————— ↓');
      console.log(container);
      console.log('Variant —————————— ↓');
      console.log(variant);
      // ... update some element on the page
    }
  });


  var collection_atc_button = document.getElementsByClassName("atc-button-collection");
  for(var i = 0; i < collection_atc_button.length; i++) {
    (function(index) {
      collection_atc_button[index].addEventListener("click", function(e) {
        console.log(this.getAttribute("data-variant"));
        
        let formData = {
          'items': [{
            'id': this.getAttribute("data-variant"),
            'quantity': 1
          }]
        };
        
        fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          const variant_id = this.getAttribute("data-variant");
          const url = `${window.theme.routes.root_url}variants/${variant_id}/?section_id=api-product-popdown`;
          fetch(url, {
            method: 'GET',
          }).then((response) => {
            return response.text();
          })
          .then((response) => {
            // handle success
            const fresh = document.createElement('div');
            fresh.innerHTML = response;            
            var instance = document.querySelectorAll(".product-add-popdown");
            instance[0].innerHTML = fresh.querySelector('[data-api-content]').innerHTML;
            instance[0].className += " is-visible";
            setTimeout(() => {
              instance[0].classList.remove("is-visible");                       
          	}, 2000)
          })
          .catch(function (error) {
            console.warn(error);
          });
          
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      })
    })(i);
  }
  
  document.addEventListener('theme:cart:popdown', function(event) {    
//       console.log(event);
  });
  
  document.addEventListener('theme:cart:init', (e) => {
//     console.log('theme:cart:init');
//     console.log(e);
  });
    
  document.addEventListener('theme:cart:change', function(event) {
    var cart = event.detail.cart;
    if (cart) {
//       console.log("anyway changed cart.js ");
    }
  });
  // Fired when page loads to update header values
  document.addEventListener('theme:cart:init', (e) => {
//     console.log('theme:cart:init');
//     console.log(e);
  });

  // Debounced scroll listeners.  Up and down only fire on direction changes
  // These events are useful for creating sticky elements and popups.
//   document.addEventListener('theme:scroll', e => { console.log(e); });
//   document.addEventListener('theme:scroll:up', e => { console.log(e); });
//   document.addEventListener('theme:scroll:down', e => { console.log(e); });

  // Debounced resize listener to bundle changes that trigger document reflow
//   document.addEventListener('theme:resize', e => { console.log(e); });

  // Locks and unlocks page scroll for modals and drawers
  // These are commented out because firing them will lock the page scroll
  // the lock event must set `detail` to the modal or drawer body so the 
  // scroll locking code knows what element should maintain scoll. 
  // document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: scrollableInnerElement}));
  // document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));


  // ^^ Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.
})();
