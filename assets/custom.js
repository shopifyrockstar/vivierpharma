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


    $(".recommend-button-collection").click(function() {
      console.log("kdkdkkdd");
    })
  var recommend_atc_button = document.getElementsByClassName("recommend-button-collection");
  console.log(recommend_atc_button.length);
  for(var i = 0; i < recommend_atc_button.length; i++) {
    (function(index) {
      recommend_atc_button[index].addEventListener("click", function(e) {
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




const supportedLocales = ["en", "fr"];

const rebuyTranslations = {
  en: {
    smart_cart: {
      cart_title: "Your Cart",
      checking_out_label: "Checking out...",
      checkout_label: "Checkout",
      continue_shopping_label: "Continue Shopping",
      discount_button_label: "Discount",
      discount_code_label: "Discount Code",
      discount_invalid_message: "Discount not valid",
      discount_label: "Discount",
      empty_cart: "Your cart is empty! 😔 Start shopping!",
      free_shipping_helper: "",
      free_shipping_reached: "<b>Yes! Free shipping! 🚐</b>",
      free_shipping_remaining: "You are <span></span> away from <b>FREE SHIPPING</b>",
      notes_label: "If you have a clinic code enter it here. Promo codes get added at checkout.",
      notes_placeholder: "Write your note here",
      notes_remaining_characters: "",
      subtotal_plural_text: "items (<span class='item-count'></span>)",
      subtotal_singular_text: "item (<span class='item-count'></span>)",
      view_cart_label: "View Cart",
      view_cart_working_label: "Opening cart...",
    },
    widget: {
      add_to_cart: "Add to Cart",
      added_to_cart: "Added",
      adding_to_cart: "Adding to Cart",
      cart_switch_to_onetime: "Switch to One Time",
      cart_switch_to_subscription: "Switch to Subscription",
      cart_switch_to_subscription_footer: "",
      continue: "",
      decline: "",
      delivery_frequency_label: "",
      description: "",
      learn_more_label: "",
      remove_body: "",
      remove_confirm: "",
      remove_deny: "",
      remove_from_cart: "Remove from Cart",
      remove_title: "",
      removed_from_cart: "Removed from Cart",
      removing_from_cart: "Removing from Cart",
      sold_out_label: "Sold Out",
      super_title: "",
      thank_you_button: "",
      thank_you_description: "",
      thank_you_title: "",
      title: "",
      upgrade_to_subscription: "Upgrade to Subscription",
      variant_option: "Size",
      variant_options: "Sizes",
    },
  },
  fr: {
    smart_cart: {
      cart_title: "Votre panier",
      checking_out_label: "Passage à la caisse...",
      // checkout_label: "Paiement",
      continue_shopping_label: "Continuer vos achats",
      discount_button_label: "Rabais",
      discount_code_label: " Code de réduction",
      discount_invalid_message: "Rabais non valide",
      discount_label: "Rabais",
      empty_cart: "Votre panier est vide!  Commencer vos achats!",
      free_shipping_helper: "",
      free_shipping_reached: "<b> Oui! Livraison gratuite! </b>",
      free_shipping_remaining: "Plus que <span></span> pour profiter de la <b>LIVRAISON GRATUITE</b> ",
      notes_label: "Si vous avez un code clinique, entrez-le ici. Codes promotionnels sont ajoutés au paiement.",
      notes_placeholder: "Écrire votre note ici",
      notes_remaining_characters: "",
      subtotal_plural_text: "Articles (<span class='item-count'></span>)",
      subtotal_singular_text: "Article (<span class='item-count'></span>)",
      view_cart_label: "Voir le panier",
      view_cart_working_label: "Ouverture du panier...",
    },
    widget: {
      add_to_cart: "Ajouter au panier",
      added_to_cart: "Ajouté",
      adding_to_cart: "Ajout au panier",
      cart_switch_to_onetime: "Passer à l’achat unique",
      cart_switch_to_subscription: "Passer à l'abonnement",
      cart_switch_to_subscription_footer: "",
      continue: "",
      decline: "",
      delivery_frequency_label: "",
      description: "",
      learn_more_label: "",
      remove_body: "",
      remove_confirm: "",
      remove_deny: "",
      remove_from_cart: "Retirer du panier",
      remove_title: "",
      removed_from_cart: "Retiré du panier",
      removing_from_cart: "Retrait du panier ...",
      sold_out_label: "Épuisé",
      super_title: "",
      thank_you_button: "",
      thank_you_description: "",
      thank_you_title: "",
      title: "",
      upgrade_to_subscription: "Passer à l'abonnement",
      variant_option: "Format",
      variant_options: "",
    },
  },
};

const updateSmartCartLanguage = () => {  
  currentLocale = "";
  if (
    Shopify &&
    Shopify.locale &&
    supportedLocales.includes(Shopify.locale)
  ) {
    currentLocale = Shopify.locale;
    console.log("updatesmartcartlanguage");
  }

  const translation = rebuyTranslations[currentLocale].smart_cart;

  Object.assign(Rebuy.SmartCart.settings.language, translation);
};


const updateWidgetLanguage = (widget) => {
  currentLocale = "";

  if (
    Shopify &&
    Shopify.locale &&
    supportedLocales.includes(Shopify.locale)
  ) {
    currentLocale = Shopify.locale;
  }

  const translation = rebuyTranslations[currentLocale].widget;

  Object.assign(widget.settings.language, translation);

  widget.compileConfig();
};

const updateRemainingAmount = () => {
  // shipping-bar
  Rebuy.libraries
    .$(".rebuy-cart__flyout-shipping-bar-message span")
    .html(
      "<b>€ " +
      (
        (Rebuy.SmartCart.settings.free_shipping.minimum -
          Rebuy.SmartCart.cart.total_price) /
        100
      )
        .toFixed(2)
        .replace(".", ",") +
      "</b>"
    );
  // items
  Rebuy.libraries
    .$(".rebuy-cart__flyout-subtotal-label .item-count")
    .html(Rebuy.Cart.cart.item_count);
};

const enrichProductJSON = (products) => {
  for (let i = 0; i < products.length; i++) {
    updateProductJSON(products[i]);
  }

  function updateProductJSON(product) {
    currentLocale = "";

    if (
      Shopify &&
      Shopify.locale &&
      supportedLocales.includes(Shopify.locale)
    ) {
      currentLocale = Shopify.locale;

      $.getJSON(
        `${Shopify.routes.root}/products/${product.handle}.js`,
        function(json) {
          var new_product = json;

          for (var i = 0; i < products.length; i++) {
            if (products[i].id == new_product.id) {
              // Update product title
              product.title = new_product.title;

              for (
                var j = 0, new_variant;
                j < new_product.variants.length;
                j++
              ) {
                new_variant = new_product.variants[j];

                for (
                  var x = 0, variant;
                  x < product.variants.length;
                  x++
                ) {
                  variant = product.variants[x];

                  if (variant.id == new_variant.id) {
                    // Update variant title
                    variant.title = new_variant.title;

                    break;
                  }
                }
              }

              break;
            }
          }
        }
      );
    }
  }
};


document.addEventListener("rebuy:smartcart.ready", (event) => {
  updateSmartCartLanguage()
  if (Shopify.locale == "fr") {
    $('.rebuy-cart__flyout-recommendations .primary-title').text("Compléter votre routine");
    $('.rebuy-cart__flyout-recommendations .rebuy-product-actions .rebuy-button').text("Ajouter");    
    $('.rebuy-cart__flyout-footer .rebuy-cart__checkout-button span').text("Passer à la caisse");
  }
});

document.addEventListener("rebuy:cart.change", (event) => {
  setTimeout(() => {
    updateRemainingAmount();
  if (Shopify.locale == "fr") {
    $('.rebuy-cart__flyout-recommendations .primary-title').text("Compléter votre routine");
    $('.rebuy-cart__flyout-recommendations .rebuy-product-actions .rebuy-button').text("Ajouter");    
    $('.rebuy-cart__flyout-footer .rebuy-cart__checkout-button span').text("Passer à la caisse");
  }
  }, 1000);

});

document.addEventListener("rebuy.productsChange", (event) => {
  enrichProductJSON(event.detail.products);
});

document.addEventListener('rebuy:cart.enriched', () => {
  if (Shopify.locale == "fr") {
    $('.rebuy-cart__flyout-recommendations .primary-title').text("Compléter votre routine");
    $('.rebuy-cart__flyout-recommendations .rebuy-product-actions .rebuy-button').text("Ajouter");    
    $('.rebuy-cart__flyout-footer .rebuy-cart__checkout-button span').text("Passer à la caisse");
  }
});
