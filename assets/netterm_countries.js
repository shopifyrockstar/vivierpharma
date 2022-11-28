
{% assign Check_shipping_estimate = false %}
{% assign use_bespoke_shipping = false %}
{% assign check_cart_item = 0 %}
{% for itm in cart.items %}
{% assign check_cart_item = forloop.length %}
{% endfor %}
{% assign show_form = false %}
{% assign NetTerm_Settings = shop.metafields.waioNetOrders.waio-net-term-order %}
{% if NetTerm_Settings.enabled %} 
{% if check_cart_item > 0 %}
{% if NetTerm_Settings.customers_group == "tag_based" %}
{% assign customer_tags = customer.tags | join: '~~~' | downcase | split: '~~~' %}
{% assign eligible_tags = NetTerm_Settings.customers_tag  | downcase | split:',' %} 
{% assign show_form = false %}
{% for e_tag in eligible_tags  %}
{% if customer_tags != blank %}
{% for ct_tag in customer_tags %}
{% if e_tag == ct_tag %}
{% assign show_form = true %}
{% endif %}
{% endfor %}
{% endif %}
{% endfor %}
{% else %}
{% if customer %}
{% assign show_form = true %}
{% endif %}
{% endif %}
{% endif %}
{% endif %}


    {% capture soldout_list %}
    {% assign update_data = '{' %}
    {% for item in cart.items %}
    {% for variant in item.product.variants %}
    {% if item.id == variant.id %}
    {% if variant.inventory_management == 'shopify' %}
    {% if variant.inventory_policy == 'deny' and  variant.inventory_quantity < item.quantity %}
    {% if variant.inventory_quantity != 0 and variant.inventory_quantity > -1%}
    {% assign update_data = update_data | append: item.id  %}
    {% assign update_data = update_data | append: ':' | append : variant.inventory_quantity %}
    {% else %}
        {% assign update_data = update_data | append: item.id  %}
        {% assign update_data = update_data | append: ':' | append : 0 %}
    {% endif %}
    {% assign update_data = update_data | append: ',' %}
    
    <div class="net_item" available_qty="{{variant.inventory_quantity}}" vid="{{item.id}}">
        <div class="net_item_img">
        <a  class="net_item__image">
            <span class="net_img_div">
            <img src="{{ item | img_url: '65x65' }}" alt="{{ item.title | escape }}">
            <span class="net_qty">{{ item.quantity }}</span>
            </span>
        </a>

        </div>
        <div class="net_item_title" style="color:#666666 !important;">
        {{ item.product.title }}
        {% unless item.product.has_only_default_variant %}
        <p>{{ item.variant.title }}</p>
        {% endunless %}

        {% assign property_size = item.properties | size %}
        {% if property_size > 0 %}
        {% for p in item.properties %}
        {% assign first_character_in_key = p.first | truncate: 1, '' %}
        {% unless p.last == blank or first_character_in_key == '_' %}
        <p>
            {{ p.first }}:
            {% if p.last contains '/uploads/' %}
            <a href="{{ p.last }}" style="color:#666666 !important;">{{ p.last | split: '/' | last }}</a>
            {% else %}
            {{ p.last }}
            {% endif %}
        </p>
        {% endunless %}
        {% endfor %}
        {% endif %}
        </div>
    
        <div class="net_item_total" style="color:#666666 !important;">
        {% if variant.inventory_quantity != 0 %}
        {{ item.quantity }} <svg style="width: 14px; padding-top: 14px !important;" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="24" height="24" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#666666"><path d="M129,57.33333v21.5h-129v14.33333h129v21.5l40.13053,-28.66667z"></path></g></g></svg> {{variant.inventory_quantity}}
        <svg class="net_remove_item" vid="{{item.id}}" style="cursor:pointer;position: absolute; left: 80px; top: 7px; width: 15px;" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#666666"><path d="M86,14.33333c-39.48833,0 -71.66667,32.17833 -71.66667,71.66667c0,39.48833 32.17833,71.66667 71.66667,71.66667c39.48833,0 71.66667,-32.17833 71.66667,-71.66667c0,-39.48833 -32.17833,-71.66667 -71.66667,-71.66667zM131.22167,121.11667c-2.86667,3.79833 -6.30667,7.23833 -10.105,10.105l-35.11667,-35.11667l-35.11667,35.11667c-3.79833,-2.86667 -7.23833,-6.30667 -10.105,-10.105l35.11667,-35.11667l-35.11667,-35.11667c2.86667,-3.79833 6.30667,-7.23833 10.105,-10.105l35.11667,35.11667l35.11667,-35.11667c3.79833,2.86667 7.23833,6.30667 10.105,10.105l-35.11667,35.11667z"></path></g></g></svg>
        {% else %}
        <p style="color:red !important;">Sold out</p>
        {% endif %}
        </div>
    </div>
    {% endif %}
    {% endif %}
    {% endif %}
    {% endfor%}
    {% endfor%}
        {% assign update_data = update_data | append: '}'%}
    {% endcapture %}

{% if show_form %}

<script>
{% assign NetTerm_Settings = shop.metafields.waioNetOrders.waio-net-term-order %}

$(document).ready(function(){
WSAIO.cart_object_data = {{ cart|json }};
    WSAIO.netTerms = {{shop.metafields.waioNetOrders.waio-net-term-order | json }} || {};
if(typeof WSAIO.App.checkoutURL === 'undefined'){
    WSAIO.App.checkoutURL = "https://wholesalecheckout.digitalcoo.com";
}

{% liquid
    assign ws_general_settingss = shop.metafields.waioSettings.general_settings 
    %}
WSAIO.general_settingss = {};
try{
    WSAIO.general_settingss = JSON.parse('{{ws_general_settingss}}');
                                        if(typeof WSAIO.general_settingss.settings !== "undefined"){
    if(WSAIO.general_settingss.settings.enable_additional_coupon_code){
        $('.discount-code-forms').show();
    }
    }
}catch(e){console.error("JSON Parsing error in settings.",e)}
WSAIO.app_shippings2 = {{ shop.metafields.wsaio_ships | json }} || [];
try{
    WSAIO.app_shipping2 = Object.keys(WSAIO.app_shippings2).map(function(key) {
        return WSAIO.app_shippings2[key];
    });
    delete WSAIO.app_shippings2;
}catch(e){}

setTimeout(function(){
    var paymentOptions = [],
        checkoutSelector = '',
        default_payment_option = '',
        show_delivery_date = false,
        customize_payment_option = [],
        onlyNetTerms = false,
        netTerm_Button_Text = 'NET ORDERS CHECKOUT',
        netTerm_Label_Text = '',
        messages = [],
        paymentOptions_HTML = '',
        selectaddress =  '';
    customer_addresses = {{customer.addresses|json}} ;
    var customer_id = '{{customer.id}}';
    var shipping_msg = "";
    var shpping_row = "";
    window.net_cart = [];
    var  show_payment_mode = '';
    var is_loggedIn = {% if customer %}true{%else%}false{% endif %};
    var customerTags = {{ customer.tags | json }} || [];
    var customer_tags = {{ customer.tags | json }} || [];

    var app_url = "https://wholesalecheckout.digitalcoo.com";


    WSAIO.shopInfo = {
    "money_format": {{ shop.money_format | json }},
    "currency": {{ shop.currency | json }},
    "domain" : {{shop.domain | json }},
    "shop" : {{shop.permanent_domain | json }},
    "url" : {{ shop.secure_url | append: request.locale.root_url | json }}
    };
    WSAIO.customer = {
    id: {{customer.id|json}},
    tags: {{customer.tags | downcase | json}},
    tax_exempt: {{ customer.tax_exempt | json }},
    total_spent: {{ customer.total_spent | json }},
    orders_count: {{ customer.orders_count | json }},
    name: {{ customer.name | json }},
    email: {{ customer.email | json }},
    default_address: {{ customer.default_address | json }} || {},
    addresses: {{ customer.addresses | json }} || []
};
WSAIO.formatMoney = function (t, g) {
		a = parseFloat(t);
		"string" === typeof a && (a = a.replace(".", ""));
		var c = "",
			e = /\{\{\s*(\w+)\s*\}\}/,
			f = g || WSAIO.shopInfo.money_format || WSAIO.shop_money_format;
		Number.prototype.format_pricing = function (n, x, s, c) {
			var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
				num = this.toFixed(Math.max(0, ~~n));
			return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
		};
		switch (f.match(e)[1]) {
			case "amount":
				a = parseFloat(a);
				return f.replace(e, a.format_pricing(2));
				break;
			case "amount_no_decimals":
				a = parseFloat(a);
				return f.replace(e, a.format_pricing(0));
				break;
			case "amount_with_comma_separator":
				a = parseFloat(a);
				return f.replace(e, a.format_pricing(2, 3, '.', ','));
				break;
			case "amount_no_decimals_with_comma_separator":
				a = parseFloat(a);
				return f.replace(e, a.format_pricing(2, 0, '.').replace('.00', ''));
				break;
			case "amount_no_decimals_with_space_separator":
				a = parseFloat(a);
				return f.replace(e, a.format_pricing(2, 3, ' ').replace('.00', ''));
				break;
			case "  ":
				a = parseFloat(a);
				return f.replace(e, a.format_pricing(2, 3, "'"));
		}
		return f.replace(e, c)
	};
if(WSAIO.customer && WSAIO.customer.tags){
    try{
    WSAIO.customer.tags = JSON.parse(WSAIO.customer.tags);
    }catch(e){}
}


//   console.log("WSAIO.netTerms", WSAIO.netTerms);



WSAIO.apply_net_terms = function(){
    var config = WSAIO.netTerms;
    var _payment_options = [];
    config.payment_options.split(',').forEach(function(d, i){_payment_options.push({value:d, text: d})})
    checkoutSelector = config.checkoutSelector || WSAIO.checkout_selector;
    paymentOptions = _payment_options || [];
    default_payment_option = config.default_payment_option || '';
    show_delivery_date = config.show_delivery_date;
    show_payment_mode = config.show_payment_mode;
    onlyNetTerms = config.onlyNetTerms?true:false;
    netTerm_Button_Text = config.netTerm_Button_Text;
    netTerm_Label_Text = config.cart_message;
    messages = config.messages;


    if(paymentOptions.length){
    $(paymentOptions).each(function(e){ 
        $(customer_tags).each(function(ee){
        if(paymentOptions[e].value.trim().toLowerCase() == customer_tags[ee].toLowerCase()){
            customize_payment_option.push({'value':paymentOptions[e].value.trim(),'text':paymentOptions[e].value.trim()});
        }
        });
    })
    }
    if(customize_payment_option.length){
    paymentOptions = customize_payment_option
    }

    paymentOptions.forEach(function(po, i){
    paymentOptions_HTML+='<option value="'+po.value+'">'+po.text+'</option>';
    });
    $('.payments_option').after(paymentOptions_HTML)

    var customer_addresses_HTML = '';
    customer_addresses.forEach(function(address, i){
    customer_addresses_HTML+='<option value="'+i+'">Address : '+address.city+' : '+address.address1+'</option>';
    });

    if(customer_addresses_HTML == ''){
    selectaddress =  '';
    }else{
    selectaddress =  '                 <div class="net--input_field">  '  + 
        '                   <select class="auto_address field_style w-100"><option value="">Select your address</option><option value="default">Default Address</option>'+customer_addresses_HTML+'</select>  '  + 
        '                 </div>  ' ;
    }

    $('.net_shipping_title').after(selectaddress);


}



WSAIO.apply_net_terms();

setTimeout(function(){
    if(typeof WSAIO.preCheckout != 'undefined'){
      WSAIO.NetTerm_version = 1.1;
    WSAIO.preCheckout();
    }
},100)

var shipping_label = 'Shipping';
  if(typeof WSAIO.shopInfo.currency !== 'undefined' && typeof Shopify.currency.active !== 'undefined' && WSAIO.shopInfo.currency  != Shopify.currency.active){
       shipping_label = 'Shipping (Approx.)';
  }

WSAIO.check_shipping = function(){

    if(typeof WSAIO.applied_shipping != 'undefined' && WSAIO.applied_shipping.apply_shipping_charges && ($('[name="bespoke"]:checked').val() == '' || typeof $('[name="bespoke"]:checked').val() == 'undefined')){
        setTimeout(function(){
          if(WSAIO.applied_shipping.shipping_line.price == 0){
            $('.net_shipping_div').html(' <p>'+shipping_label+'</p><p class="net_prices">free</p>')
            var subtotal = parseFloat(window.preDiscountData.checkout_final_price);
            if(window.coupon_price != undefined){
                var total = WSAIO.formatMoney(parseFloat(subtotal-window.coupon_price));
                if((subtotal-window.coupon_price) < 0){
                  total = WSAIO.formatMoney(parseFloat(0));
                }
              }else{
                var total = WSAIO.formatMoney(parseFloat(subtotal));
              }

              $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            }else{
                var subtotal = parseFloat(window.preDiscountData.checkout_final_price);
                if(window.coupon_price != undefined){
                  var total = WSAIO.formatMoney(parseFloat((subtotal+parseFloat(WSAIO.applied_shipping.shipping_line.price))-window.coupon_price));
                  if(((subtotal+parseFloat(WSAIO.applied_shipping.shipping_line.price))-window.coupon_price) < 0){
                    total = WSAIO.formatMoney(parseFloat(0));
                  }
                }else{
                  var total = WSAIO.formatMoney(parseFloat(subtotal));
                }

                $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                $('.net_shipping_div').html(' <p>'+shipping_label+'</p><p class="net_prices">'+WSAIO.formatMoney(parseFloat(WSAIO.applied_shipping.shipping_line.price))+'</p>');
              }
            },50);
            if(WSAIO.applied_shipping.shipping_line.price != 0){
              setTimeout(function(){
                var subtotal = parseFloat(window.preDiscountData.checkout_final_price);

                if(window.coupon_price != undefined){
                  var total = WSAIO.formatMoney(parseFloat((subtotal+parseFloat(WSAIO.applied_shipping.shipping_line.price))-window.coupon_price));
                  if(((subtotal+parseFloat(WSAIO.applied_shipping.shipping_line.price))-window.coupon_price) < 0){
                    total = WSAIO.formatMoney(parseFloat(0));
                  }
                }else{
                    var total = WSAIO.formatMoney(parseFloat(subtotal+parseFloat(WSAIO.applied_shipping.shipping_line.price)));
                  }
                
                  $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                },50);
              }
            }else{
                setTimeout(function(){
                    {% if use_bespoke_shipping %}
                    if(typeof bespoke_shipping != "undefined" && bespoke_shipping.length != 0){
                      var ship_price = parseFloat($('[name="bespoke"]:checked').val())/100;
                      if(ship_price == 0){
                        $('.net_shipping_div').html(' <p>'+shipping_label+'</p><p class="net_prices">free</p>');
                      }else{
                        $('.net_shipping_div').html(' <p>'+shipping_label+'</p><p class="net_prices">$'+ship_price+'</p>');
                      }
                     var subtotal = parseFloat(window.preDiscountData.checkout_final_price);
                      if(window.coupon_price != undefined){
                        var total = WSAIO.formatMoney(parseFloat((subtotal+ship_price)-window.coupon_price));
                        if(((subtotal+ship_price)-window.coupon_price) < 0){
                          total = WSAIO.formatMoney(parseFloat(0));
                        }
                      }else{
                        var total = WSAIO.formatMoney(parseFloat(subtotal+ship_price));
                      }
                      $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    }
                    else{
                        $('.net_shipping_div').html(' <p>Shipping cost will be added separately in the order invoice.</p>');
                        var subtotal = parseFloat(window.preDiscountData.checkout_final_price);
                        if(window.coupon_price != undefined){
                          var total = WSAIO.formatMoney(parseFloat(subtotal-window.coupon_price));
                          if((subtotal-window.coupon_price) < 0){
                            total = WSAIO.formatMoney(parseFloat(0));
                          }
                        }else{
                          var total = WSAIO.formatMoney(parseFloat(subtotal));
                        }
                        $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                      }
                      {% else %}
                      if(typeof shippingratebyes != 'undefined' && shippingratebyes!=null){
                        window.shipest=parseFloat(shippingratebyes.split(WSAIO.formatMoney(0).split('0')[0])[1].split(" ")[0]);
                        $('.net_shipping_div').html(' <p>Shipping Estimated.</p><p class="net_prices">'+shippingratebyes+'</p>');
                       var subtotal = parseFloat(window.preDiscountData.checkout_final_price);
                        var shiprate=parseFloat(shippingratebyes.split(WSAIO.formatMoney(0).split('0')[0])[1].split(" ")[0]);
                        if(window.coupon_price != undefined){
                          var total = WSAIO.formatMoney(parseFloat((subtotal+shiprate)-window.coupon_price));
                          if(((subtotal+shiprate)-window.coupon_price) < 0){
                            total = WSAIO.formatMoney(parseFloat(0));
                          }
                        }else{
                          var total = WSAIO.formatMoney(parseFloat(subtotal+shiprate));
                        }
        
                        $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                      }
                      else{
                        window.shipest=null;
                        $('.net_shipping_div').html(' <p>Shipping cost will be added separately in the order invoice.</p>');
                        var subtotal = parseFloat(window.preDiscountData.checkout_final_price);
                        if(window.coupon_price != undefined){
                          var total = WSAIO.formatMoney(parseFloat(subtotal-window.coupon_price));
                          if((subtotal-window.coupon_price) < 0){
                            total = WSAIO.formatMoney(parseFloat(0));
                          }
                        }else{
                          var total = WSAIO.formatMoney(parseFloat(subtotal));
                        }
        
                        $('.net_prices.net_subtotal').html('<span style="font-size:14px !important;">'+window.Shopify.currency.active+'</span>'+' '+total.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                      }
                      {% endif %}
                    },100);
                  }
                }

setTimeout(function(){
    typeof WSAIO.check_shipping != 'undefined' ? WSAIO.check_shipping() : console.log('')
},5000)


$('.get-rates.btn.button').on("click",function(){
    setTimeout(function(){
    typeof WSAIO.check_shipping != 'undefined' ? WSAIO.check_shipping() : console.log('')
    },4000)
})

var net_cart = {{ cart|json }}




var check_click = 0;
$('input[type="submit"]').parents('form').on('submit', function(e){
    if(check_click == 0){
    e.preventDefault();
    check_click++;
    var _form = $(this);
    $('input[type="submit"]').attr('disabled','disabled')
    var _po = '';
    if(show_payment_mode) _po =_form.find('[name="payment"]').val();
    else _po = default_payment_option;
    var _dd = '';
    if(show_delivery_date) _dd =_form.find('[name="delivery_date"]').val();
    var shipping_price =$("#wrapper-response").text().trim();
    var _shipping_charges = true;

    if(shipping_price.indexOf("Rates start at") > -1){
        var _price = shipping_price.replace("Rates start at $","").replace(" USD","");
        var _title = "Shipping charges";
        _shipping_charges = false;
    }

    var customs= false;
    var pricex= "0";
    var titlex= "Shipping charges";

    var _custom_shipping = {};

    if(typeof WSAIO.applied_shipping != "undefined"){
        {% if use_bespoke_shipping %}
        if($('[name="bespoke"]:checked').attr('title') == "Wholesale Shipping"){
            var _price = WSAIO.applied_shipping.shipping_line.price;
            var _title = WSAIO.applied_shipping.shipping_line.title;
            _shipping_charges = WSAIO.applied_shipping.apply_shipping_charges;
        }else{
            _shipping_charges = false;
            var bespoke_shipping = $('[name="bespoke"]:checked').val();
            if(bespoke_shipping != ''){
            _custom_shipping.custom= true;
            _custom_shipping.price= bespoke_shipping/100;
            _custom_shipping.title=  $('[name="bespoke"]:checked').attr('title');
            }else{
            customs= false;
            pricex= "0";
            titlex= "Shipping charges"
            }
        }
        {% else %}
        var _price = WSAIO.applied_shipping.shipping_line.price;
        var _title = WSAIO.applied_shipping.shipping_line.title;
        _shipping_charges = WSAIO.applied_shipping.apply_shipping_charges;
        {% endif %}
        }else{
        {% if use_bespoke_shipping %}
        var bespoke_shipping = $('[name="bespoke"]:checked').val();
        if(bespoke_shipping != ''){
            _custom_shipping.custom= true;
            _custom_shipping.price= bespoke_shipping/100;
            _custom_shipping.title=  $('[name="bespoke"]:checked').attr('title');
        }else{
        customs= false;
        pricex= "0";
        titlex= "Shipping charges"
        }
        {% else %}
        {% if Check_shipping_estimate %}
        if(shipest !=null){
        _custom_shipping.custom= true;
        _custom_shipping.price= shipest;
        _custom_shipping.title=  "Shipping Estimated.";
        }
        else{
        customs= false;
        pricex= "0";
        titlex= "Shipping charges";
        }
        {% endif %}
        {% endif %}
    }
    if(typeof window.ntrmshipping != "undefined"){
        var _price = window.ntrmshipping;
        var _title = "Shipping charges";
        _shipping_charges = false;
    }


    var additional_info={};
    additional_info["shipping_notes"] = _form.find('[name="shipping_notes"]').val();


    if($('[name="billing_address_same_as_shipping_address"]').is(":checked")){
        additional_info["Billing_Address"] = "same as shipping";
    }else{

        additional_info["first_name"] = $(".billingaddress").find('[name="waiobilladdress[first_name]"]').val();
        additional_info["last_name"] = $(".billingaddress").find('[name="waiobilladdress[last_name]"]').val();
        additional_info["address1"] = $(".billingaddress").find('[name="waiobilladdress[address1]"]').val();
        additional_info["address2"] = $(".billingaddress").find('[name="waiobilladdress[address2]"]').val();
        additional_info["city"] = $(".billingaddress").find('[name="waiobilladdress[city]"]').val();
        additional_info["company"] = $(".billingaddress").find('[name="waiobilladdress[company]"]').val();
        additional_info["country"] = $(".billingaddress").find('[name="waiobilladdress[country]"]').val();
        additional_info["phone"] = $(".billingaddress").find('[name="waiobilladdress[phone]"]').val();
        additional_info["provice"] = $(".billingaddress").find('[name="waiobilladdress[provice]"]').val();
        additional_info["zip"] = $(".billingaddress").find('[name="waiobilladdress[zip]"]').val();

    }
    var discount_app = [];
    if(typeof WSAIO.application != 'undefined'){
        discount_app = WSAIO.application;
    }
    var _data = {
        "cart": net_cart,
        "shopInfo": WSAIO.shopInfo,
        "customer": WSAIO.customer,
        "user_mode": WSAIO.user_mode,
        "discount_code_application": discount_app,
        "products_with_collections": WSAIO.products_with_collections,
        "payment_option": _po,
        "delivery_date": _dd,
        "additional_info": additional_info,
        "shipping_address": {
        "address1": _form.find('[name="waioaddress[address1]"]').val(),
        "address2": _form.find('[name="waioaddress[address2]"]').val(),
        "city": _form.find('[name="waioaddress[city]"]').val(),
        "company": _form.find('[name="waioaddress[company]"]').val(),
        "country": _form.find('#AddressCountryNew').val(),
        "first_name": _form.find('[name="waioaddress[first_name]"]').val(),
        "last_name": _form.find('[name="waioaddress[last_name]"]').val(),
        "latitude": "",
        "longitude": "",
        "phone": _form.find('[name="waioaddress[phone]"]').val(),
        "province": _form.find('[name="waioaddress[provice]"]').val(),
        "zip": _form.find('[name="waioaddress[zip]"]').val(),
        "name": "",
        "country_code": "",
        "province_code": ""
        },
        "app_shipping_charges": _shipping_charges,
        "shipping_charges": {
        "price": _price,
        "title": _title
        },
        "custom_shipping_line" : _custom_shipping,
        "tags": "NetTerm"
    };
    if(WSAIO.variant_sku_are_same){
        _data["variant_sku_are_same"] = WSAIO.variant_sku_are_same;
    }

	try{ 
		/* send presentment_currency if enabled */
		if(WSAIO.selectedCurrency() != '' && WSAIO.selectedCurrency() !== 'undefined'){
			var presentment_currency_rate = parseFloat(window.Currency.rates[WSAIO.shopInfo.currency]/window.Currency.rates[WSAIO.selectedCurrency()]) || 1;
		
				/* Append rate in payload to use in server */
				_data['presentment_currency'] = {
				code: WSAIO.selectedCurrency(),
				rate: presentment_currency_rate
				};
			
	   }
	   else{
			if(typeof Shopify !== "undefined" && typeof Shopify.currency !== "undefined"){
				var presentment_currency_rate = parseFloat(Shopify.currency.rate) || 1;
					/* Append rate in payload to use in server */
					_data['presentment_currency'] = {
					code: Shopify.currency.active,
					rate: presentment_currency_rate
					};
			}
		}
	}catch(e){console.log('WSAIO currency rates undefined')}

        
    $.ajax({
        type: 'POST',
        url: app_url+'/net-term/v3',
        cache: false,
        data: _data,
        success: function(result){
        if(result&&result.status==1){
            $('.net--input_field').attr('disabled','disabled');
            $('.net-detail-div').hide();
            $('.net_order_name').text(result.draft_order_info.name);
            $('.net-thank-div').show();

            //                 setTimeout(function(){window.location.href = '/';},4000)
            $.post('/cart/clear.js').always(function(){});
        }
        else{
            //               console.log("WAIO NET TERM: Error: ",result.message);
            alert("An error occured");
        }

        },
        error: function(err){
        //             console.log("WAIO NET TERM: Error: ",err);
        console.log(err)
        alert("An error occured");
        }
    });

    }

})

});

},1500);
</script>











<!-- /////////////////////////////////////////////////////////Page Design ======================================================= -->
<div style="background:white;display:none;" class="net_mobile_div">
<h1 class="net_title" style="text-align:center;padding-top: 10px;">{{ page.title }}</h1>
<div class="back_link">
<a href="/cart" style="color:black;font-size: 14px !important;">Cart</a><span style="color:#6666667a !important;padding-left: 5px  !important;font-size: 17px !important;">&#x203A;</span>  <span style="color: #6666667a !important;font-size: 14px !important;"> Checkout </span>
</div>
</br>
<div class="mobile_vie_accordian" >
<button class="net_accordion" style="position:relative;box-shadow: 0 0 0 1px #fafafa !important;display:none ;color: #ef520e !important;background: #fafafa !important;border: 1px solid rgba(179,179,179,0.34) !important; border-left: none !important;border-right: none !important;"><span class="hOuter"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="24" height="24"
viewBox="0 0 172 172"
style=" fill:#fa314a;position:absolute;left: 20px !important;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#f4743c"><path d="M31.63411,14.30534l-24.43945,0.12598l0.06999,14.33333l14.83724,-0.06999l23.61361,56.64746l-8.5804,13.73145c-2.86667,4.58667 -3.01493,10.38036 -0.39193,15.10319c2.623,4.72283 7.59991,7.65657 13.00358,7.65657h86.41992v-14.33333h-86.41992l-0.46191,-0.83985l8.42643,-13.49349h53.52604c5.21017,0 10.005,-2.83296 12.52767,-7.37663l25.8252,-46.47135c1.23983,-2.22167 1.20601,-4.93167 -0.08399,-7.12467c-1.29,-2.18583 -3.64985,-3.52734 -6.18685,-3.52734h-105.69434zM43.58789,43h87.55371l-19.9043,35.83333h-52.71419zM50.16667,129c-7.91608,0 -14.33333,6.41725 -14.33333,14.33333c0,7.91608 6.41725,14.33333 14.33333,14.33333c7.91608,0 14.33333,-6.41725 14.33333,-14.33333c0,-7.91608 -6.41725,-14.33333 -14.33333,-14.33333zM121.83333,129c-7.91608,0 -14.33333,6.41725 -14.33333,14.33333c0,7.91608 6.41725,14.33333 14.33333,14.33333c7.91608,0 14.33333,-6.41725 14.33333,-14.33333c0,-7.91608 -6.41725,-14.33333 -14.33333,-14.33333z"></path></g></g></svg><span class="summry" style="padding-left: 30px;">Show order summary</span> <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="24" height="24"
viewBox="0 0 172 172"
style=" fill:#fa314a;height: 20px; position: absolute;" class="net_down"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#f4743c"><path d="M53.24609,68.08333l-10.75,10.75l43.50391,43.5039l43.5039,-43.5039l-10.75,-10.75l-32.7539,32.7539z"></path></g></g></svg><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="24" height="24"
viewBox="0 0 172 172"
style=" fill:#fa314a;height: 20px; position: absolute;display:none;" class="net_up"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ef520e"><path d="M86,49.66276l-43.50391,43.50391l10.75,10.75l32.75391,-32.75391l32.7539,32.75391l10.75,-10.75z"></path></g></g></svg><p class="net_prices net--subtotal" style="float:right;text-align: right;">{{ cart.total_price | money }}</p><span></button>
<div class="net_panel" style="transition: all 0.5s ease-in-out;">
    <div class="net_items">
    {% for item in cart.items %}
    <div class="net_item">
        <div class="net_item_img">

        <a  class="net_item__image">
            <span class="net_img_div">
            <img src="{{ item | img_url: '65x65' }}" alt="{{ item.title | escape }}">
            <span class="net_qty">{{ item.quantity }}</span>
            </span>
        </a>

        </div>
        <div class="net_item_title">
        {{ item.product.title }}
        {% unless item.product.has_only_default_variant %}
        <p>{{ item.variant.title }}</p>
        {% endunless %}

        {% assign property_size = item.properties | size %}
        {% if property_size > 0 %}
        {% for p in item.properties %}
        {% assign first_character_in_key = p.first | truncate: 1, '' %}
        {% unless p.last == blank or first_character_in_key == '_' %}
        <p>
            {{ p.first }}:
            {% if p.last contains '/uploads/' %}
            <a href="{{ p.last }}">{{ p.last | split: '/' | last }}</a>
            {% else %}
            {{ p.last }}
            {% endif %}
        </p>
        {% endunless %}
        {% endfor %}
        {% endif %}
        </div>
        <div class="net_item_total" style="">
        <span class="net_total net-item-total-price-{{item.key|replace:':','_'}}">{{ item.final_line_price | money }}</span>
        </div>
    </div>
    {% endfor %}
    </div> 

    <div class="discount-code-forms" style="display:none;">
    <span class="wsaio--coupon-code-forms">      
        <input type="text" name="wsaio--discount-code-fields" placeholder="Discount code">     
        <button name="wsaio--discount-code-btns" class="btn wsaio--coupon-code-buttons" disabled="disabled" style="opacity:0.2">Apply</button>    
    </span>
    </div>
    <div class="coupon_label_div" style="display:none;">
    <svg style="width: 14px; margin-right: 3px !important;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17.78 3.09C17.45 2.443 16.778 2 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003-.245.253-.413.554-.5.874L.738 8.055c-.56-.953-.24-2.178.712-2.737L9.823.425C10.284.155 10.834.08 11.35.22l4.99 1.337c.755.203 1.293.814 1.44 1.533z" fill-opacity=".55"></path><path d="M10.835 2H16c1.105 0 2 .895 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818c-.777.778-2.036.782-2.82.01l-5.166-5.1c-.786-.775-.794-2.04-.02-2.828.002 0 .003 0 .003-.002l6.82-6.89C9.79 2.214 10.3 2 10.835 2zM13.5 8c.828 0 1.5-.672 1.5-1.5S14.328 5 13.5 5 12 5.672 12 6.5 12.672 8 13.5 8z"></path></svg>
    <p class="coupon_text"style="font-size: 14px; font-weight: 500; text-transform: uppercase;"></p>
    <svg class="remove_coupon" style="cursor: pointer;width: 16px !important; height: 24px; margin-left: 10px !important;" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#666666"><path d="M40.90039,30.76628l-10.13411,10.13411l45.09961,45.09961l-45.09961,45.09961l10.13411,10.13411l45.09961,-45.09961l45.09961,45.09961l10.13411,-10.13411l-45.09961,-45.09961l45.09961,-45.09961l-10.13411,-10.13411l-45.09961,45.09961z"></path></g></g></svg>
    </div>

    <div class="net_sutotal_div">
    <p>Subtotal</p><p class="net_prices net--subtotal">{{ cart.total_price | money }}</p>
    </div>
    <div class="applied_coupon_line" style="display:none;">
    <div class="net_coupon_div">
        <span style="display: flex;">
        <p>Discount</p>
        <svg style="width: 10px; margin-right: 3px !important;margin-left: 6px !important;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17.78 3.09C17.45 2.443 16.778 2 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003-.245.253-.413.554-.5.874L.738 8.055c-.56-.953-.24-2.178.712-2.737L9.823.425C10.284.155 10.834.08 11.35.22l4.99 1.337c.755.203 1.293.814 1.44 1.533z" fill-opacity=".55"></path><path d="M10.835 2H16c1.105 0 2 .895 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818c-.777.778-2.036.782-2.82.01l-5.166-5.1c-.786-.775-.794-2.04-.02-2.828.002 0 .003 0 .003-.002l6.82-6.89C9.79 2.214 10.3 2 10.835 2zM13.5 8c.828 0 1.5-.672 1.5-1.5S14.328 5 13.5 5 12 5.672 12 6.5 12.672 8 13.5 8z"></path></svg>
        <p class="applied_coupon_text"style="font-size: 12px; font-weight: 500; text-transform: uppercase;"></p>
        </span>
        <p class="net_prices net--coupon_deduct"></p>
    </div>
    </div>
    <div class="net_shipping_div">
      Shipping <svg style="width: 20px !important;; display: block !important;; margin-left: auto !important; margin-top: 8px !important; }" version="1.1" xmlns="http://www.w3.org/2000/svg" width="60px" height="10px" viewBox="0 0 80 20"> <circle cx="10" cy="10" r="10" fill="#666" > <animate attributeName="cx" from="10" to="40" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="10" cy="10" r="0" fill="#555"> <animate attributeName="r" from="0" to="10" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="40" cy="10" r="10" fill="#777"> <animate attributeName="cx" from="40" to="70" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="70" cy="10" r="10" fill="#666"> <animate attributeName="r" from="10" to="0" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> </svg>
    </div>
    <div class="applied_vat_line">
      <div class="net_coupon_div">
        <span style="display: flex;">
          <p>VAT</p>
        </span>
        <p class="net_prices net--vat_deduct"></p>
      </div>
    </div>



    <div class="net_total_div" style="padding: 15px 0 20px 0px;">
    <p style="font-size: 18px !important;">Total</p><p class="net_prices net_subtotal" style="font-size: 18px !important;"><svg style="width: 20px !important;; display: block !important;; margin-left: auto !important; margin-top: 8px !important; }" version="1.1" xmlns="http://www.w3.org/2000/svg" width="60px" height="10px" viewBox="0 0 80 20"> <circle cx="10" cy="10" r="10" fill="#666" > <animate attributeName="cx" from="10" to="40" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="10" cy="10" r="0" fill="#555"> <animate attributeName="r" from="0" to="10" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="40" cy="10" r="10" fill="#777"> <animate attributeName="cx" from="40" to="70" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="70" cy="10" r="10" fill="#666"> <animate attributeName="r" from="10" to="0" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> </svg></p>
    </div>
</div>
</div>

</div>

<div class="NetTerm_div">
<div class="net_box net_box_1 net-thank-div" style="display:none;">
    <div class="net_address_fields" style="display:flex;">
    <div style="padding-top: 85px;padding-right: 10px; " class="net_tick"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#2ecc71"><path d="M86,6.88c-43.62952,0 -79.12,35.49048 -79.12,79.12c0,43.62952 35.49048,79.12 79.12,79.12c43.62952,0 79.12,-35.49048 79.12,-79.12c0,-15.6864 -4.60863,-30.30871 -12.51031,-42.61703l-4.70984,5.56313c6.5188,10.84976 10.34015,23.5003 10.34015,37.0539c0,39.83176 -32.40824,72.24 -72.24,72.24c-39.83176,0 -72.24,-32.40824 -72.24,-72.24c0,-39.83176 32.40824,-72.24 72.24,-72.24c18.72392,0 35.75504,7.22319 48.60344,18.95359l4.50156,-5.31453c-14.0524,-12.7452 -32.6886,-20.51906 -53.105,-20.51906zM148.73297,26.67344l-66.4686,78.43469l-27.97687,-26.09563l-4.68969,5.03235l33.25109,31.01375l71.13813,-83.93735z"></path></g></g></svg>
    </div>
    <div>
        <h1 class="success_title" style="font-size: 38px; margin-bottom: 20px !important; text-transform: none !important; letter-spacing: normal !important;">{{shop.name}}</h1>
        <p>Order <span class="net_order_name"></span></p>
        <h6 class="" style="font-size: 26px !important;padding-bottom: 20px !important;">Thank you {{customer.first_name | capitalize}}!</h6>
        <div style="border: 1px solid #cecece38;padding: 10px !important;border-radius: 5px !important;">
        <p style="font-size: 16px !important;font-weight: 600;">{{NetTerm_Settings.messages.confirmation}}</p>
        <p style="font-size: 14px !important;"> {{NetTerm_Settings.messages.thank_you}}</p>
        </div>
        <a class="net-continue" href="/" style="height: 50px; border-radius: 6px; background: black; color: white !important; padding: 15px 30px; display: block; max-width: 170px; margin: auto !important;border: none !important;    margin-top: 30px !important;margin-bottom: 20px !important;" >Continue Shopping</a>
    </div>
    </div>
</div>


{% if soldout_list != blank %}

<div class="net_box net_box_1 net_stockerror_box" style="background: white;">
    <div class="net_address_fields net_stockerror_div" style="display:flex;background:white;">
    <div style="padding-top: 85px;padding-right: 10px; " class="net_tick"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                                                width="48" height="48"
                                                                                viewBox="0 0 172 172"
                                                                                style=" fill:#000000;"><g transform=""><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><path d="M0,86c0,-47.49649 38.50351,-86 86,-86c47.49649,0 86,38.50351 86,86c0,47.49649 -38.50351,86 -86,86c-47.49649,0 -86,-38.50351 -86,-86zM86,165.12c43.69677,0 79.12,-35.42323 79.12,-79.12c0,-43.69677 -35.42323,-79.12 -79.12,-79.12c-43.69677,0 -79.12,35.42323 -79.12,79.12c0,43.69677 35.42323,79.12 79.12,79.12z" fill="#666666"></path><g fill="#666666"><path d="M85.92861,37.18424c-2.68959,0.03942 -4.83874,2.25033 -4.80195,4.93996v68.25522c-0.02486,1.7575 0.89852,3.39224 2.41655,4.27824c1.51803,0.886 3.39553,0.886 4.91356,0c1.51803,-0.886 2.44141,-2.52074 2.41655,-4.27824v-68.25522c0.01801,-1.31643 -0.49732,-2.58414 -1.42871,-3.51463c-0.93139,-0.93049 -2.1996,-1.4446 -3.51601,-1.42533zM86,124.97087c-2.69147,0 -4.87333,2.18187 -4.87333,4.87333c0,2.69147 2.18187,4.87333 4.87333,4.87333c2.69147,0 4.87333,-2.18187 4.87333,-4.87333c0,-2.69147 -2.18187,-4.87333 -4.87333,-4.87333z"></path></g><path d="" fill="none"></path><path d="" fill="none"></path><path d="M86,172c-47.49649,0 -86,-38.50351 -86,-86v0c0,-47.49649 38.50351,-86 86,-86h0c47.49649,0 86,38.50351 86,86v0c0,47.49649 -38.50351,86 -86,86z" fill="none"></path><path d="M86,165.12c-43.69677,0 -79.12,-35.42323 -79.12,-79.12v0c0,-43.69677 35.42323,-79.12 79.12,-79.12h0c43.69677,0 79.12,35.42323 79.12,79.12v0c0,43.69677 -35.42323,79.12 -79.12,79.12z" fill="none"></path><path d="M86,172c-47.49649,0 -86,-38.50351 -86,-86v0c0,-47.49649 38.50351,-86 86,-86h0c47.49649,0 86,38.50351 86,86v0c0,47.49649 -38.50351,86 -86,86z" fill="none"></path><path d="M86,165.12c-43.69677,0 -79.12,-35.42323 -79.12,-79.12v0c0,-43.69677 35.42323,-79.12 79.12,-79.12h0c43.69677,0 79.12,35.42323 79.12,79.12v0c0,43.69677 -35.42323,79.12 -79.12,79.12z" fill="none"></path><path d="M86,172c-47.49649,0 -86,-38.50351 -86,-86v0c0,-47.49649 38.50351,-86 86,-86h0c47.49649,0 86,38.50351 86,86v0c0,47.49649 -38.50351,86 -86,86z" fill="none"></path><path d="M86,165.12c-43.69677,0 -79.12,-35.42323 -79.12,-79.12v0c0,-43.69677 35.42323,-79.12 79.12,-79.12h0c43.69677,0 79.12,35.42323 79.12,79.12v0c0,43.69677 -35.42323,79.12 -79.12,79.12z" fill="none"></path><path d="M86,172c-47.49649,0 -86,-38.50351 -86,-86v0c0,-47.49649 38.50351,-86 86,-86h0c47.49649,0 86,38.50351 86,86v0c0,47.49649 -38.50351,86 -86,86z" fill="none"></path><path d="M86,165.12c-43.69677,0 -79.12,-35.42323 -79.12,-79.12v0c0,-43.69677 35.42323,-79.12 79.12,-79.12h0c43.69677,0 79.12,35.42323 79.12,79.12v0c0,43.69677 -35.42323,79.12 -79.12,79.12z" fill="none"></path><path d="M86,172c-47.49649,0 -86,-38.50351 -86,-86v0c0,-47.49649 38.50351,-86 86,-86h0c47.49649,0 86,38.50351 86,86v0c0,47.49649 -38.50351,86 -86,86z" fill="none"></path><path d="M86,165.12c-43.69677,0 -79.12,-35.42323 -79.12,-79.12v0c0,-43.69677 35.42323,-79.12 79.12,-79.12h0c43.69677,0 79.12,35.42323 79.12,79.12v0c0,43.69677 -35.42323,79.12 -79.12,79.12z" fill="none"></path></g></g></svg>
    </div>
    <div   style="width:100%;">
        <h1 class="success_title" style="font-size: 38px; margin-bottom: 20px !important; text-transform: none !important; letter-spacing: normal !important;">{{shop.name}}</h1>
        <p style="font-size:18px;">Out of stock</p>
        <p style="color:#666666 !important;">Some items are no longer available. Your cart has been updated.</p>
        <div style="display:flex;margin-top: 60px !important;margin-bottom: 18px !important; font-weight: 500;">
        <p>Description</p>
        <p style="margin-left: auto !important;">Quantity</p>
        </div>
        <div style="border: 1px solid #cecece38;border-left: none; border-right: none;padding: 10px 0px !important;">
            {{soldout_list}}
        </div>
        <div style="margin-top: 25px !important;" class="net_btn_div">
        <a class="net-continue" style="cursor:pointer;height: 50px; border-radius: 6px; background: black; color: white !important; padding: 15px 30px; max-width: 170px;border: none !important;    margin-top: 30px !important;margin-bottom: 20px !important;" >Continue</a>
        <a href="/cart" style="margin-left: 20px !important; font-weight: 500;margin-top: 16px !important;display: inline-block; ;color: black !important;"> Return to cart</a>
        </div>
    </div>
    </div>
</div>


{% else %}

<form class="net_box net_box_1 net-detail-div" >
    <div class="net_address_fields">
    <h1 class="net_title">{{ page.title }}</h1>

    <div class="back_link">
        <a href="/cart" style="color:black;font-size: 14px !important;">Cart</a><span style="color:#6666667a !important;padding-left: 5px  !important;font-size: 17px !important;">&#x203A;</span>  <span style="color: #6666667a !important;font-size: 14px !important;"> Checkout </span>
    </div>
    
    
    

    <div class="net--input_field">
        <textarea class="net_shipping_area w-100 field_style" name="shipping_notes" placeholder="Shipping Notes"></textarea>
    </div>

    {% if NetTerm_Settings.show_delivery_date %}
    <div class="net--input_field">
        <input type="date" id="datepicker" name="delivery_date" autocomplete="off" placeholder="Select delivery date (FUTURE-MM/DD/YYYY)" required class="w-100 field_style" style="width: 100%;
    padding: 12px 10px;">
    </div>
    {% endif %}
    {% if NetTerm_Settings.show_payment_mode %}
    <div class="net--input_field">
        <select name="payment" required class="w-100 field_style">
        <option value="" class="payments_option">Select a payment option</option>
        </select> 
    </div>
    {% endif %}
    <br>
    <label class="net_shipping_title">Shipping address</label>

    <div class="net--input_field" style="display:flex;flex-wrap:wrap;"> 
        <input type="text" name="waioaddress[first_name]" placeholder="First Name" required class="w-49 field_style">
        <input type="text" name="waioaddress[last_name]" placeholder="Last Name" required class="w-49 field_style right_input"> 
    </div> 
    <div class="net--input_field ">
        <input type="text" name="waioaddress[company]" placeholder="Company" class="w-100 field_style"> 
    </div> 
    <div class="net--input_field">
        <input type="text" name="waioaddress[address1]" placeholder="Address Line 1" required class="w-100 field_style">
    </div>
    <div class="net--input_field">
        <input type="text" name="waioaddress[address2]" placeholder="Address Line 2" class="w-100 field_style">   
    </div> 

    <div class="net--input_field">
        <input type="text" name="waioaddress[city]" placeholder="City" required class="w-100 field_style"> 

    </div>

    <div class="net--input_field net_small_div netterm_countries">
        <span class="slct_cntry">
        <select id="AddressCountryNew" name="waioaddress[country] " data-default=""  class="field_style" >{{all_country_option_tags}}</select>
        </span>
        <span class="slct_state">
        <select name="waioaddress[provice]" class="field_style" > 
            <option value="">State/Province</option>
        </select> 
        </span>
        <input type="text" name="waioaddress[zip]" placeholder="Zip/Postcode" required class="field_style" >
    </div>
    <div class="net--input_field"> 
        <input type="number" name="waioaddress[phone]" placeholder="Phone" class="w-100 field_style"> 
    </div> 

    <!--       //==============================Billing address fields ==================================== -->

    <div class="net--input_field " >
        <input type="checkbox" name="billing_address_same_as_shipping_address" checked="checked">
        <span class="net_checkbox_shipping" style="cursor:pointer;">Billing address same as shipping address</span>
    </div>



    <div class="billingaddress" style="display: none;">
        <br>
        <h2 class="net_shipping_title" style="text-align: left;">Billing address</h2>
        <div class="net--input_field" style="display:flex;flex-wrap:wrap;"> 
        <input type="text" name="waiobilladdress[first_name]" placeholder="First Name" class="w-49 field_style">
        <input type="text" name="waiobilladdress[last_name]" placeholder="Last Name" class="w-49 field_style right_input"> 
        </div> 
        <div class="net--input_field ">
        <input type="text" name="waiobilladdress[company]" placeholder="Company" class="w-100 field_style"> 
        </div> 
        <div class="net--input_field">
        <input type="text" name="waiobilladdress[address1]" placeholder="Address Line 1" class="w-100 field_style">
        </div>
        <div class="net--input_field">
        <input type="text" name="waiobilladdress[address2]" placeholder="Address Line 2" class="w-100 field_style">   
        </div> 
        <div class="net--input_field">
        <input type="text" name="waiobilladdress[city]" placeholder="City"  class="w-100 field_style"> 
        </div>

        <div class="net--input_field net_small_div netterm_countries">
        <span class="slct_cntrybill">
            <select id="AddressCountryNew" name="waiobilladdress[country] " data-default=""  class="field_style" >{{all_country_option_tags}}</select>
        </span>
        <span class="slct_statebill">
            <select name="waiobilladdress[provice]" class="field_style" > 
            <option value="">State/Province</option>
            </select> 
        </span>
        <input type="text" name="waiobilladdress[zip]" placeholder="Zip/Postcode" class="field_style" > 
        </div>
        <div class="net--input_field"> 
        <input type="number" name="waiobilladdress[phone]" placeholder="Phone" class="w-100 field_style"> 
        </div>     
    </div>

    {% if use_bespoke_shipping %}
    <span class="net_shipping_method" style="display:none;">
        <label class="net_shipping_method_title">Shipping method</label>
        <div class="net--input_field net_shipping_method_div">
        </div> 
    </span>
    {% endif %}
    <div style="margin-top: 25px !important;" class="net_btn_div">
        <a href="/cart" style="margin-top: 16px !important;display: inline-block; ;color: black !important;"> <span style="font-size: 17px !important;"> &#x2039;</span> Return to cart</a>
        <input class="net--input_field" type="submit" value="Place Order" style="cursor: pointer;border: none !important;float:right !important;margin-top: 0px !important;height: 50px; border-radius: 6px;" />
    </div>
    <div class="net_alert success" style="display:none;margin-top:20px !important;">
        {{NetTerm_Settings.messages.thank_you}}
    </div>
    <br>
    <br>
    <br><br>
    
    </div>

</form>

    {% endif %}


<div class="net_box net_box_2">
    

    <div class="net_items">
    {% for item in cart.items %}
    <div class="net_item">
        <div class="net_item_img">
        <a  class="net_item__image">
            <span class="net_img_div">
            <img src="{{ item | img_url: '65x65' }}" alt="{{ item.title | escape }}">
            <span class="net_qty">{{ item.quantity }}</span>
            </span>
        </a>

        </div>
        <div class="net_item_title">
        {{ item.product.title }}
        {% unless item.product.has_only_default_variant %}
        <p>{{ item.variant.title }}</p>
        {% endunless %}

        {% assign property_size = item.properties | size %}
        {% if property_size > 0 %}
        {% for p in item.properties %}
        {% assign first_character_in_key = p.first | truncate: 1, '' %}
        {% unless p.last == blank or first_character_in_key == '_' %}
        <p>
            {{ p.first }}:
            {% if p.last contains '/uploads/' %}
            <a href="{{ p.last }}">{{ p.last | split: '/' | last }}</a>
            {% else %}
            {{ p.last }}
            {% endif %}
        </p>
        {% endunless %}
        {% endfor %}
        {% endif %}
        </div>
        <div class="net_item_total">
        <span class="net_total net-item-total-price-{{item.key|replace:':','_'}}">{{ item.final_line_price | money }}</span>
        </div>
    </div>
    {% endfor %}
    </div> 
    <div class="discount-code-forms" style="display:none;">
    <span class="wsaio--coupon-code-forms">      
        <input type="text" name="wsaio--discount-code-fields" placeholder="Discount code">     
        <button name="wsaio--discount-code-btns" class="btn wsaio--coupon-code-buttons" disabled="disabled" style="opacity:0.2">Apply</button>    
    </span>
    </div>
    <div class="coupon_label_div" style="display:none;">
    <svg style="width: 14px; margin-right: 3px !important;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17.78 3.09C17.45 2.443 16.778 2 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003-.245.253-.413.554-.5.874L.738 8.055c-.56-.953-.24-2.178.712-2.737L9.823.425C10.284.155 10.834.08 11.35.22l4.99 1.337c.755.203 1.293.814 1.44 1.533z" fill-opacity=".55"></path><path d="M10.835 2H16c1.105 0 2 .895 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818c-.777.778-2.036.782-2.82.01l-5.166-5.1c-.786-.775-.794-2.04-.02-2.828.002 0 .003 0 .003-.002l6.82-6.89C9.79 2.214 10.3 2 10.835 2zM13.5 8c.828 0 1.5-.672 1.5-1.5S14.328 5 13.5 5 12 5.672 12 6.5 12.672 8 13.5 8z"></path></svg>
    <p class="coupon_text"style="font-size: 14px; font-weight: 500; text-transform: uppercase;"></p>
    <svg class="remove_coupon" style="cursor: pointer;width: 16px !important; height: 24px; margin-left: 10px !important;" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#666666"><path d="M40.90039,30.76628l-10.13411,10.13411l45.09961,45.09961l-45.09961,45.09961l10.13411,10.13411l45.09961,-45.09961l45.09961,45.09961l10.13411,-10.13411l-45.09961,-45.09961l45.09961,-45.09961l-10.13411,-10.13411l-45.09961,45.09961z"></path></g></g></svg>
    </div>

    <div class="net_sutotal_div">
    <p>Subtotal</p><p class="net_prices net--subtotal subtotal">{{ cart.total_price | money }}</p>
    </div>

    <div class="applied_coupon_line" style="display:none;">
    <div class="net_coupon_div">
        <span style="display: flex;">
        <p>Discount</p>
        <svg style="width: 10px; margin-right: 3px !important;margin-left: 6px !important;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17.78 3.09C17.45 2.443 16.778 2 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003-.245.253-.413.554-.5.874L.738 8.055c-.56-.953-.24-2.178.712-2.737L9.823.425C10.284.155 10.834.08 11.35.22l4.99 1.337c.755.203 1.293.814 1.44 1.533z" fill-opacity=".55"></path><path d="M10.835 2H16c1.105 0 2 .895 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818c-.777.778-2.036.782-2.82.01l-5.166-5.1c-.786-.775-.794-2.04-.02-2.828.002 0 .003 0 .003-.002l6.82-6.89C9.79 2.214 10.3 2 10.835 2zM13.5 8c.828 0 1.5-.672 1.5-1.5S14.328 5 13.5 5 12 5.672 12 6.5 12.672 8 13.5 8z"></path></svg>
        <p class="applied_coupon_text"style="font-size: 12px; font-weight: 500; text-transform: uppercase;"></p>
        </span>
        <p class="net_prices net--coupon_deduct"></p>
    </div>
    </div>

    <div class="net_shipping_div">
    Shipping <svg style="width: 20px !important;; display: block !important;; margin-left: auto !important; margin-top: 8px !important; }" version="1.1" xmlns="http://www.w3.org/2000/svg" width="60px" height="10px" viewBox="0 0 80 20"> <circle cx="10" cy="10" r="10" fill="#666" > <animate attributeName="cx" from="10" to="40" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="10" cy="10" r="0" fill="#555"> <animate attributeName="r" from="0" to="10" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="40" cy="10" r="10" fill="#777"> <animate attributeName="cx" from="40" to="70" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="70" cy="10" r="10" fill="#666"> <animate attributeName="r" from="10" to="0" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> </svg>
    </div>
    <div class="applied_vat_line"  style="display:none;">
      <div class="net_coupon_div">
        <span style="display: flex;">
          <p>VAT (incl.)</p>
        </span>
        <p class="net_prices net--vat_deduct"></p>
      </div>
    </div>

    <div class="net_total_div" style="padding: 10px 0px;">
    <p style="font-size: 18px !important;">Total</p><p class="net_prices net_subtotal" style="font-size: 18px !important;"><svg style="width: 20px !important;; display: block !important;; margin-left: auto !important; margin-top: 8px !important; }" version="1.1" xmlns="http://www.w3.org/2000/svg" width="60px" height="10px" viewBox="0 0 80 20"> <circle cx="10" cy="10" r="10" fill="#666" > <animate attributeName="cx" from="10" to="40" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="10" cy="10" r="0" fill="#555"> <animate attributeName="r" from="0" to="10" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="40" cy="10" r="10" fill="#777"> <animate attributeName="cx" from="40" to="70" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> <circle cx="70" cy="10" r="10" fill="#666"> <animate attributeName="r" from="10" to="0" dur="0.5s" calcMode="spline" keySplines="0.42 0 0.58 1" keyTimes="0;1" repeatCount="indefinite" /> </circle> </svg></p>
    </div>

</div>




</div>

<style>
header,footer,shopify-section,#shopify-section-header,.breadcrumbs, #shopify-section-announcement{display:none !important;}
*{color:black !important;margin:0px !important;font-size:12px;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;}
main{padding: 0px !important; margin:0px !important;}
a{text-decoration:unset !important;}
.NetTerm_div{background-color:#fafafa !important;}
textarea::-webkit-input-placeholder, input::-webkit-input-placeholder,select::-webkit-input-placeholder,option::-webkit-input-placeholder {
    color: #636c72 !important;
}
.coupon_label_div {
    background: rgb(113 113 113 / 11%); display: inline-flex; padding: 10px; border-radius: 5px; margin-left: 60px !important; margin-top: 10px !important;
}
.discount-code-forms{
    width: 78% !important;
    margin: auto !important;
}
    #shopify-section-footer{
    display:none !important;
}
.net_shipping_method_title{  
    font-size: 18px !important;
    color: #333 !important;
    font-weight: 400 !important;
    text-transform: none !important;
    letter-spacing: normal !important;
}
.net_shipping_method_div{
    border: 1px solid #d9d9d9 !important;
    border-radius: 5px;
}
.net_shipping_method_input_div{
    border-bottom: 1px solid #d9d9d9 !important;
    padding: 10px !important;
    font-size: 14px !important;
    line-height: normal !important;
    min-height: 45px;
    width: 100%;
    
        }
[name="wsaio--discount-code-btns"]{
    background: black;
    color: white !important;
    padding: 10px !important;
    width: 100px !important;
    margin-top: 10px !important;
    border-radius: 5px !important;
    margin-left: 10px !important;
}
[name="wsaio--discount-code-fields"]{
    margin-top: 10px !important;
    border-radius: 5px !important;
    width:100% !important;
}
.wsaio--coupon-code-forms{
display: flex !important;
}
textarea:Focus,.textarea:Focus,select:Focus,input:Focus{
    outline: none !important;
    border-color: #d9d9d9 !important;
}
.NetTerm_div{
    width:100%;
    display:flex;
    flex-wrap:wrap;
}

#net-term-order .wrapper.main-content .grid__item {
    padding: 0px !important;
}

#net-term-order .wrapper.main-content {
    max-width: unset !important;
    padding: 0px !important;
}
input:focus-visible, textarea:focus,select:focus-visible {
    outline: none !important;
    border: 1px solid #d9d9d9 !important;
}
.net_box{
    padding-top: 5%;
}
.net_box_2{
    width:40%;
    min-height: 100vh;
}
.net_box_1{
    background: white;
    width:60%;
}
.net_items{
    width:78%;
    margin:auto !important;
    max-height: 320px;
    overflow: hidden !important;
    padding-right: 3px;
}

.NetTerm_div .net_items,  .mobile_vie_accordian .net_items{
    border-bottom: 1px solid rgba(179,179,179,0.34);
    padding-bottom: 15px;
    margin-bottom: 15px !important;
}
.net_items:hover {
    overflow-y: auto !important;
}

.net_item{
    width:100% !important;
    display:flex !important;
    /*     flex-wrap:wrap; */
    margin:auto !important;
    margin-top:10px !important;
}
.net_item_img{
    width:70px !important;

}
.net_item_img .net_item__image {
    position: relative;
    display: block;
    width: 65px;
    height: 65px !important;
    border: 1px solid rgba(179,179,179,0.34);
    border-radius: 5px !important;
}
.net_item_img img{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto !important;
    max-height: 63px !important;
    max-width: 63px !important;
}
.net_item_title{
    width:57%;
    padding-right: 4%;
    padding-left: 10px;
    position:relative;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",sans-serif;
}
.mobile_vie_accordian .net_item_title{
    padding-right: 5px !important;
}
.net_item_total{
    text-align: right;
    width: auto !important;
    float: right;
    position: relative;
    margin-left: auto !important;
    display: block;
}
.net_item_title  a, .net_item_total span{
    margin: 0 !important;
    width: 100%;
    color:black;
}
input::placeholder , select, option, textarea {
    color: #636c72 !important;
}

.net_qty{
    position:absolute !important;
    border: 1px solid gray !important;
    border-radius: 100% !important;
    width: 20px !important;
    text-align: center !important;
    background: gray !important;
    right: -7% !important;
    top:-5px !important;
    color:white !important;
    font-size: 12px !important;
}
.mobile_vie_accordian .net_qty{
    right: -11%;
}

.net_sutotal_div,.net_total_div,.net_shipping_div, .net_coupon_div, .net_cartLevel_div{
    display:flex !important;
    width: 78% !important;
    margin: auto !important;
    margin-top: 10px !important;

}

.NetTerm_div .net_total_div, .mobile_vie_accordian .net_total_div{
    padding: 15px 0px;
    padding-right: 13px;
    border-top: 1px solid rgba(179,179,179,0.34);
    margin-top: 15px !important;
}

.net_prices{
    margin-left: auto  !important;
    /*     margin-right: 3% !important; */
    color:black;
    font-weight:bold;
}
.net_total{
    font-weight:bold;
}
.net_total s{
    display:block;
}
.net_address_fields{
    width: 100% !important;
    max-width: 600px !important;
    margin: auto !important;
    padding: 0px 30px !important;
}
.net_cart_link{
    color:black;
    text-decoration: revert;
}
.net_link_div{
    cursor: pointer;
}
.net_link_div img{
    width: 14px;height: 8px;
}

.net--input_field {
    margin-top: 15px !important;
}

.net_shipping_title {
    font-size: 18px !important;
    color: #333 !important;
    font-weight: 400 !important;
    text-transform: none !important;
    letter-spacing: normal !important;
}
[type="submit"]{
    background:black !important;
    color:white !important;
    width: 200px !important;
    height: 60px !important;
    border-radius: 10px !important;
}
.field_style{
    border-radius: 5px !important; border: 1px solid #d9d9d9 !important;background-color: white !important;

}
select{
    background-image: url(https://img.icons8.com/material-rounded/23/000000/give-way.png) !important;
    background-size: 8px 6px !important;
    background-position: calc(100% - 24px) calc(1rem + 7px),calc(100% - 19px) calc(1rem + 6px) !important;
    background-repeat: no-repeat !important;
    appearance: none !important;
}
.w-49{
    width: 49% !important;
}
.right_input{
    margin-left:auto !important;
}
input::placeholder,textarea::placeholder, #date_picker::placeholder {
    color: black;
}


.net_mobile_accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
}

.active, .net_mobile_accordion:hover {
    background-color: #ccc; 
}

.nat_mobile_panel {
    padding: 0 18px;
    display: none;
    background-color: white;
    overflow: hidden;
}
.mobile_vie_accordian {
    background: #fcfcfc !important;
    border-bottom: 1px solid rgba(179,179,179,0.34) !important;
}
.mobile_vie_accordian .net_panel{
    padding:20px 20px 0px 20px !important;
    background: #fcfcfc;
    max-width: 600px !important;
    margin: auto !important;
}

.mobile_vie_accordian .hOuter {
    position: relative;
    max-width: 600px !important;
    margin: auto !important;
    display: block;
    padding: 0px 20px !important;
}

.mobile_vie_accordian .net_items{
    width:100% !important;
}
.mobile_vie_accordian .net_sutotal_div,.mobile_vie_accordian .net_total_div,.mobile_vie_accordian .net_shipping_div,.mobile_vie_accordian .net_cartLevel_div{
    width:100% !important;
}


.net_alert.success {
    background-color: #04AA6D;
}
.net_alert {
    padding: 14px;
    background-color: #04aa4ead;
    color: white;
    opacity: 1;
    transition: opacity 0.6s;
    margin-bottom: 15px !important;
    width: 76%; display: block; margin: auto !important; border-radius: 5px;
}
.net_title{
    font-size: 38px !important;
    margin-bottom: 20px !important;
    text-transform: none !important;
    letter-spacing: normal !important;
}

.NetTerm_div input[type=text],.NetTerm_div input[type=number], .NetTerm_div select, .NetTerm_div textarea {
    border: 1px solid #d9d9d9 !important;
    padding: 10px !important;
    font-size: 14px !important;
    line-height: normal !important;
    min-height: 45px;
    width: 100%;
}



.NetTerm_div .net--input_field textarea {
    display: block !important;
}

span.net_checkbox_shipping {
    font-size: 14px !important;
}

/*   //============================================mobile view accordian============= */

.net_accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 20px 0 !important;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
}

.active, .net_accordion:hover {
    background-color: #ccc; 
}

.net_panel {
    padding: 0 18px;
    display: none;
    background-color: white;
    overflow: hidden;

}




/*   //============================================mobile view accordian end============= */ 

@media only screen and (min-width: 613px) {
    .netterm_countries select{
    display: inline-block !important;
    }

    .netterm_countries{
    overflow: hidden !important;
    }

    .netterm_countries > span, .netterm_countries > input {
    width: 32.5% !important;
    float: left !important;
    }
    .netterm_countries > .slct_cntry, .netterm_countries > .slct_cntrybill{
    margin-right: 1.25% !important;
    }
    .netterm_countries > input{
    margin-left: 1.25% !important;
    }

}

@media only screen and (max-width: 998px) {
    .net_box_2, .NetTerm_div .net_title,.NetTerm_div span.back_link{
    display:none;
    }
    .coupon_label_div{
    margin-left:0px !important;
    }
    .net_coupon_div{
    width:100% !important;
    }
    .discount-code-forms{
    width:100% !important;
    }
    .net_box_1{
    width:100%;
    }
    .net_accordion, .net_mobile_div{
    display:block !important;
    }
    .net_shipping_title, .back_link{
    padding-left:unset !important;
    }
    .net--input_field{
    /*      margin-left:unset !important; */
    }
    .net_item_title{
    width: 58% !important;
    }
    /*     .net_item_total{
    margin-right: 16px !important;
} */
    .net_btn_div{
    width:100% !important;
    }
    .net_alert.success {
    width: 100% !important;
    padding: 10px 11px !important;
    line-height: 1.5;
    font-size: 12px !important;
    }

    .net_items {
    max-height: unset !important;
    }

    .back_link{
    text-align:center !important;
    }
    .net_btn_div a{
    margin-bottom:20px !important;
    margin-top:0px !important;
    }
    [type="submit"]{
    width: auto !important;
    padding: 10px 48px !important;
    }
    .net_mobile_div > .back_link {
    display: none !important;
    }

}
@media (max-width: 998px) and  (min-width: 612px){
    .net--input_field{
    width:100% !important;
    }

    .net_address_fields{
    padding: 0px 20px !important;
    }
    .net_title{
    text-align:center;
    }

    .net--input_field{
    width: 100%;
    }
    [type="submit"]{
    width: auto !important;
    padding: 10px 48px !important;
    }




}
@media  (max-width: 612px) and  (min-width: 320px){
    [name="wsaio--discount-code-btns"]{
        min-width: 90px !important;
        padding: 6px 21px !important;
        border-radius: 5px !important;
        }
        .discount-code-forms{
        width: 100% !important;
        }  
    .net_remove_item{
    left: 30px !important;
    top: 32px !important;
    }
    .net_address_fields{
    padding: 0px 20px !important;
    }


    .w-49{
    width:100% !important;
    }
    .right_input{
    margin-top:18px !important;
    }
    .net_small_div select, .net_small_div input{
    width:100% !important;
    }

    .slct_state, .slct_statebill{
    display:block !important;
    }
    [name="waioaddress[provice]"], [name="waiobilladdress[provice]"]{
    /*       margin:0px !important; */
    margin-top:18px !important;
    }
    #AddressCountryNew{
    margin-top:0px !important;
    }
    .net_title{
    text-align:center;
    }
    .net_item_img{
    width:70px !important;
    }
    .net--input_field {
    width: 100% !important;
    }
    [type="submit"]{
    width: auto !important;
    padding: 10px 48px !important;
    }

    .netterm_countries {
    overflow: hidden;
    }
    .netterm_countries input {
    margin-top: 15px !important;
    }

}
@media  (max-width: 612px) and  (min-width: 380px){


}
@media  (max-width: 400px) and  (min-width: 320px){
    .net_tick{
    display:none !important;
    font-size: 30px !important;
    }
    .net_title, .success_title{
    font-size: 30px !important;
    }

}


</style>
<script>
  $(document).ready(function(){
    $('[value="---"]').attr('disabled','disabled')
    $('.net-continue').on('click',function(){
    var update_data = {{update_data}};
        var data1 = {
            updates: update_data
        }
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            cache: false,
            data: data1,
            success: function(result){
            window.location.reload();
            },
            error: function(err){
            //             console.log("WAIO NET TERM: Error: ",err);
            console.log(err)
            }
        });
    })
    $('.net_remove_item').on('click',function(){
    var _this = $(this);
    var g = "updates["+_this.attr('vid')+"]=0"
    jQuery.post('/cart/update.js',g,function(){window.location.reload();});
    })
    
});
  
//===========================================end================================
  //======================================Billing address event ====================

$('[name="billing_address_same_as_shipping_address"]').change(function(){
    if($(this).is(":checked")){
    $(".billingaddress").hide();
    }else{
    $(".billingaddress").show();
    }
});
$(document).on('click','.net_checkbox_shipping',function(){
    if(!$('[name="billing_address_same_as_shipping_address"]').is(":checked")){
    $(".billingaddress").hide();
    $('[name="billing_address_same_as_shipping_address"]').prop("checked", true);
    }else{
    $(".billingaddress").show();
    $('[name="billing_address_same_as_shipping_address"]').prop("checked", false);
    }
});
//===========================================end================================


//====================================== country address code ==================

$(document).ready(function(){
    
    var shop_country = "{{ shop.address.country }}";

    $(".slct_cntry select").on('change', function(){
    var state_data = $(this).find('option:selected').attr("data-provinces");
    state_data = JSON.parse(state_data);
    if($(this).val() == 'United Kingdom'){
    state_data = "";
    }
    if(state_data == ""){
        $(".slct_state select").empty();
        $('.slct_state').css('cssText','display:none !important');
    }else{
        $(".slct_state select").empty();
        state_data.forEach(function(data, i){
        var _option = '<option value="'+data[0]+'">'+data[0]+'</option>';
        $(".slct_state select").append(_option);
        });
        $('.slct_state').show();
    }
    });

    $(".slct_cntrybill select").on('change', function(){

    var state_data = $(this).find('option:selected').attr("data-provinces");
    state_data = JSON.parse(state_data);
    if($(this).val() == 'United Kingdom'){
        state_data = "";
    }
    if(state_data == ""){
        $(".slct_statebill select").empty();
        $('.slct_statebill').css('cssText','display:none !important');
    }else{
        $(".slct_statebill select").empty();

        state_data.forEach(function(data, i){
        var _option = '<option value="'+data[0]+'">'+data[0]+'</option>';
        $(".slct_statebill select").append(_option);
        });
        $('.slct_statebill').show();
    }

    });


    $(".slct_cntry select").trigger('change')
    $(".slct_cntrybill select").trigger('change')
    $('.slct_cntrybill select option').each(function(){
    if($(this).attr("value")==shop_country){
        $(this).attr("selected","selected")
        $(this).trigger("change")
    };
    })
    $('.slct_cntry select option').each(function(){
    if($(this).attr("value")==shop_country){
        $(this).attr("selected","selected")
        $(this).trigger("change")
    };
    })
    
    var a = WSAIO;
    
    var get_coupon = window.location.href.split('?coupon=')[1];
    if(get_coupon != '' && window.location.href.split('?coupon=')[1] != undefined){
    $('[name="wsaio--discount-code-fields"]').val(get_coupon);
    setTimeout(function(){
        $('[name="wsaio--discount-code-btns"]').removeAttr('disabled').css('opacity','1')
        $('[name="wsaio--discount-code-btns"]').trigger('click')
    },2500)
    }else{
    $('[name="wsaio--discount-code-btns"]').attr('disabled','disabled').css('opacity','0.2')
    }

    WSAIO.subscribes = function(b) {
    var f = this, c = '[name="wsaio--discount-code-fields"]';
    $('[name="wsaio--discount-code-btns"]').on(b || "click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        $('[name="wsaio--discount-code-btns"]').attr('disabled','disabled').css('opacity','0.2')
        f.code = $(this).closest("div").find(c).val();
        "" === f.code.trim() ? ($(c).addClass("ws-error"), $(c).focus()) : ($(c).removeClass("ws-error"), WSAIO.apply());
    });
    };
    WSAIO.subscribes();
    WSAIO.apply = function() {
    if (WSAIO["debugger"]) {
        debugger;
    }
    $discount = this;
    a.fetchCart(function(b, f) {
        try {
        WSAIO.cart_object = f;
        } catch (c) {
        }
        if (b) {
        return r(b);
        }
        $.ajax({type:"POST", url:a.App.checkoutURL + "/discount-code", data:{cart:f, shopInfo:a.shopInfo, customer:a.customer, coupon_code:$discount.code, products_with_collections:a.products_with_collections || []}, dataType:"json", success:function(c) {
        $(c);
        try {
            delete c.log;
        } catch (d) {
            $(d);
        }
        "function" === typeof a.callback && a.callback(c);
        if (c && 1 === c.status) {
            if ("undefined" !== typeof c.wholesale_key) {
            $discount.application = c;
            WSAIO.application = c;
            var e = {code:$discount.code, shop:a.shopInfo.shop, };
            var subtotal2 = $('.net_prices.net--subtotal.subtotal').text();
            var subtotal = 0;
            if(WSAIO.formatMoney(0).indexOf(',') > -1){
                subtotal = parseFloat(subtotal2.split(WSAIO.formatMoney(0).split('0')[0])[1].replace(',','.'))
            }else{
                subtotal = parseFloat(subtotal2.split(WSAIO.formatMoney(0).split('0')[0])[1].replace(',',''))
            }
            a.customer.id && (e.customer_id = a.customer.id);
            if(WSAIO.application.price_rule.value_type == 'percentage'){
                var percent = parseFloat(WSAIO.application.price_rule.value)
                subtotal = (subtotal/100)*percent;
                $('.net--coupon_deduct').text('-'+WSAIO.formatMoney(parseFloat(subtotal)))
                window.coupon_price = subtotal;
                WSAIO.check_shipping();
                }else{
                var price = parseFloat(WSAIO.application.price_rule.value)
                $('.net--coupon_deduct').text('-'+WSAIO.formatMoney(parseFloat(price)))
                window.coupon_price = price;
                WSAIO.check_shipping();
                }
                $('.coupon_text, .applied_coupon_text').text(c.coupon_code)
                $('.coupon_label_div, .applied_coupon_line').show();
            $('[name="wsaio--discount-code-fields"]').val('')
            $('.wsaio--coupon-code-buttons').attr('disabled','disabled').css('opacity','0.2')
            localStorage.setItem("ws-applied-coupon", JSON.stringify(e));
            } else {
            $discount.application = void 0;
            }
        } else {
            localStorage.removeItem("ws-applied-coupon");
            if($('.coupon_error').length == 0){
            $('.coupon_label_div').after('<p class="coupon_error" style="color: red !important; margin-left: 64px !important;">Enter a valid discount code</p>')
            }
            if (c.once_per_customer && null === WSAIO.customer.id) {
            return a.alterHTML("<span>" + a.discount_code_customer_login_message + "</span>", a.discount_code_alerts_selector);
            }
            }
        }});
    });
    };
    $('.remove_coupon').on('click',function(){
    $('.coupon_text, .applied_coupon_text').text('');
    $('.coupon_label_div, .applied_coupon_line').hide();
    coupon_price=0;
    WSAIO.check_shipping()
    WSAIO.application = {};
    if(window.location.href.indexOf('?coupon') > -1){
    var get_coupon = window.location.href.split('?coupon=')[0];
        window.location.href=get_coupon
    }
    })
    $('[name="wsaio--discount-code-fields"]').keyup(function(){
    $('.coupon_error').remove();
    if($(this).val() != ''){
        $('[name="wsaio--discount-code-btns"]').removeAttr('disabled').css('opacity','1')
    }else{
        $('[name="wsaio--discount-code-btns"]').attr('disabled','disabled').css('opacity','0.2')
    }
    })

});


//===========================================end================================

//======================================mobile view accordian==================

var acc = document.getElementsByClassName("net_accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
    });
}

$(document).on('click','.net_accordion',function(){
    $('.net_up').toggle();
    $('.net_down').toggle();
    if( $('.net_up').css('display') == 'block'){
    $('.net_up').css('display','inline-block')
    }
    if( $('.net_down').css('display') == 'block'){
    $('.net_down').css('display','inline-block')
    }
})




//=====================================auto address event==================
$(document).ready(function(){
    setTimeout(function(){
    $('.auto_address').on('change', function(){
        var _val = $(this).val();
        var _form = $(this).parents('form');
        _form.find('[name="waioaddress[first_name]"]').val('');
        _form.find('[name="waioaddress[last_name]"]').val('');
        _form.find('[name="waioaddress[company]"]').val('');
        _form.find('[name="waioaddress[address1]"]').val('');
        _form.find('[name="waioaddress[address2]"]').val('');
        _form.find('[name="waioaddress[city]"]').val('');
        _form.find('[name="waioaddress[zip]"]').val('');

        _form.find('[name="waioaddress[phone]"]').val('');
        _form.find('[name*="waioaddress[country]"]')[0].selectedIndex=0;
        _form.find('[name*="waioaddress[country]"]').trigger('change')

        if(_val === '') return;
        if(_val == 'default'){
        _form.find('[name="waioaddress[first_name]"]').val(WSAIO.customer.default_address.first_name);
        _form.find('[name="waioaddress[last_name]"]').val(WSAIO.customer.default_address.last_name);
        _form.find('[name="waioaddress[company]"]').val(WSAIO.customer.default_address.company);
        _form.find('[name="waioaddress[address1]"]').val(WSAIO.customer.default_address.address1);
        _form.find('[name="waioaddress[address2]"]').val(WSAIO.customer.default_address.address2);
        _form.find('[name="waioaddress[city]"]').val(WSAIO.customer.default_address.city);
        _form.find('[name="waioaddress[zip]"]').val(WSAIO.customer.default_address.zip);
        _form.find('[name="waioaddress[phone]"]').val(WSAIO.customer.default_address.phone);
        _form.find('[name*="waioaddress[country]"]').val(WSAIO.customer.default_address.country).trigger('change');
        _form.find('[name*="waioaddress[provice]"]').val(WSAIO.customer.default_address.province).trigger('change');
        }else{
        var corresponding_data = customer_addresses[_val];
        if(typeof corresponding_data !== "undefined"){
            _form.find('[name="waioaddress[first_name]"]').val(corresponding_data.first_name);
            _form.find('[name="waioaddress[last_name]"]').val(corresponding_data.last_name);
            _form.find('[name="waioaddress[company]"]').val(corresponding_data.company);
            _form.find('[name="waioaddress[address1]"]').val(corresponding_data.address1);
            _form.find('[name="waioaddress[address2]"]').val(corresponding_data.address2);
            _form.find('[name="waioaddress[city]"]').val(corresponding_data.city);
            _form.find('[name="waioaddress[zip]"]').val(corresponding_data.zip);

            _form.find('[name="waioaddress[phone]"]').val(corresponding_data.phone);
            _form.find('[name*="waioaddress[country]"]').val(corresponding_data.country_name).trigger('change');
            _form.find('[name*="waioaddress[provice]"]').val(corresponding_data.province).trigger('change');
        }
        }
        setTimeout(function(){
            $('[id="address_zip"]').val($('[name="waioaddress[zip]"]').val());
            $('#address_country').val($('[name="waioaddress[country] "]').val());
            $('#address_province').val($('[name="waioaddress[provice]"]').val());
            $('.get-rates.btn.button').click();
          },700);
    });
    },700);
});
//===========================================end================================
  
  </script>
  
  

<!--   ============================================================Shipping Estimator Code Start========================================================================== -->
{% if Check_shipping_estimate %}
<script>
theme.strings = {
    shippingCalcSubmitButton: {{ settings.shipping_calculator_submit_button_label | default: 'Calculate shipping' | json }},
    shippingCalcSubmitButtonDisabled: {{ settings.shipping_calculator_submit_button_label_disabled | default: 'Calculating...' | json }},
    {% if customer %}shippingCalcCustomerIsLoggedIn: true,{% endif %}
    shippingCalcMoneyFormat: {{ shop.money_with_currency_format | json }}
}
</script>



{% unless settings.shipping_calculator == 'Disabled' %}
{% if Check_shipping_estimate %}
<div id="shipping-calculator" style="display:none;">
<h3>{{ settings.shipping_calculator_heading | default: 'Get shipping estimates' }}</h3>
<div>
    <p class="field" style="width: 30%; display: inline-block;">
    <label for="address_country">Country</label>
    <select id="address_country" name="address[country]" data-default="{% if shop.customer_accounts_enabled and customer %}{{ customer.default_address.country }}{% elsif settings.shipping_calculator_default_country != '' %}{{ settings.shipping_calculator_default_country }}{% endif %}">{{ country_option_tags }}</select>
    </p>
    <p class="field" id="address_province_container" style="display:none;">
    <label for="address_province" id="address_province_label">Province</label>
    <select id="address_province" name="address[province]" data-default="{% if shop.customer_accounts_enabled and customer and customer.default_address.province != '' %}{{ customer.default_address.province }}{% endif %}"></select>
    </p>   
    <p class="field" style="width: 30%; display: inline-block;">
    <label for="address_zip">Zip/Postal Code</label>
    <input type="text" id="address_zip" name="address[zip]"{% if shop.customer_accounts_enabled and customer %} value="{{ customer.default_address.zip }}"{% endif %} />
    </p>
    <p class="field" style="width: 25%; margin-top: 6px !important;">
    <input type="button" class="get-rates btn button" value="{{ settings.shipping_calculator_submit_button_label | default: 'Calculate shipping' }}" />
    </p>
</div>
<div id="wrapper-response"></div>
</div>
{% endif %}
{% endunless %}

<script id="shipping-calculator-response-template" type="text/template">
{% raw %}
<p id="shipping-rates-feedback" {{#if success}} class="success" {{else}} class="error" {{/if}}>
{{#if success}}
{{#if rates}}
    {{#rates}}
    {{#if @first}}
        Rates start at<span class="sucx"> {{price}} </span>
    {{/if}}
    {{/rates}}
{{else}}
    We do not ship to this destination.
{{/if}}    
{{else}}
{{ errorFeedback }}
{{/if}}
</p>
{% endraw %}
</script>

<!--[if lte IE 8]>
<style> #shipping-calculator { display: none; } </style>
<![endif]-->

<script>


$(document).ready(function(){
setTimeout(function(){

"object"==typeof Countries&&(Countries.updateProvinceLabel=function(e,t){if("string"==typeof e&&Countries[e]&&Countries[e].provinces){if("object"!=typeof t&&(t=document.getElementById("address_province_label"),null===t))return;t.innerHTML=Countries[e].label;var r=jQuery(t).parent();r.find("select");r.find(".custom-style-select-box-inner").html(Countries[e].provinces[0])}}),"undefined"==typeof Shopify.Cart&&(Shopify.Cart={}),Shopify.Cart.ShippingCalculator=function(){var _config={submitButton:"Calculate shipping",submitButtonDisabled:"Calculating...",templateId:"shipping-calculator-response-template",wrapperId:"wrapper-response",customerIsLoggedIn:!1,moneyFormat:"${{amount}}"},_render=function(e){var t=jQuery("#"+_config.templateId),r=jQuery("#"+_config.wrapperId);if(t.length&&r.length){var templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var n=Handlebars.compile(jQuery.trim(t.text())),a=n(e);if(jQuery(a).appendTo(r),"undefined"!=typeof Currency&&"function"==typeof Currency.convertAll){var i="";jQuery("[name=currencies]").size()?i=jQuery("[name=currencies]").val():jQuery("#currencies span.selected").size()&&(i=jQuery("#currencies span.selected").attr("data-currency")),""!==i&&Currency.convertAll(shopCurrency,i,"#wrapper-response span.money, #estimated-shipping span.money")}}},_enableButtons=function(){jQuery(".get-rates").removeAttr("disabled").removeClass("disabled").val(_config.submitButton)},_disableButtons=function(){jQuery(".get-rates").val(_config.submitButtonDisabled).attr("disabled","disabled").addClass("disabled")},_getCartShippingRatesForDestination=function(e){var t={type:"POST",url:"/cart/prepare_shipping_rates",data:jQuery.param({shipping_address:e}),success:_pollForCartShippingRatesForDestination(e),error:_onError};jQuery.ajax(t)},_pollForCartShippingRatesForDestination=function(e){var t=function(){jQuery.ajax("/cart/async_shipping_rates",{dataType:"json",success:function(r,n,a){200===a.status?_onCartShippingRatesUpdate(r.shipping_rates,e):setTimeout(t,500)},error:_onError})};return t},_fullMessagesFromErrors=function(e){var t=[];return jQuery.each(e,function(e,r){jQuery.each(r,function(r,n){t.push(e+" "+n)})}),t},_onError=function(XMLHttpRequest,textStatus){jQuery("#estimated-shipping").hide(),jQuery("#estimated-shipping em").empty(),_enableButtons();var feedback="",data=eval("("+XMLHttpRequest.responseText+")");feedback=data.message?data.message+"("+data.status+"): "+data.description:"Error : "+_fullMessagesFromErrors(data).join("; ")+".","Error : country is not supported."===feedback&&(feedback="We do not ship to this destination."),_render({rates:[],errorFeedback:feedback,success:!1}),jQuery("#"+_config.wrapperId).show()},_onCartShippingRatesUpdate=function(e,t){_enableButtons();var r="";if(t.zip&&(r+=t.zip+", "),t.province&&(r+=t.province+", "),r+=t.country,e.length){"0.00"==e[0].price?jQuery("#estimated-shipping em").html("FREE"):jQuery("#estimated-shipping em").html(_formatRate(e[0].price));for(var n=0;n<e.length;n++)e[n].price=_formatRate(e[n].price)}_render({rates:e,address:r,success:!0}),jQuery("#"+_config.wrapperId+", #estimated-shipping").fadeIn()},_formatRate=function(e){function t(e,t){return"undefined"==typeof e?t:e}function r(e,r,n,a){if(r=t(r,2),n=t(n,","),a=t(a,"."),isNaN(e)||null==e)return 0;e=(e/100).toFixed(r);var i=e.split("."),o=i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+n),s=i[1]?a+i[1]:"";return o+s}if("function"==typeof Shopify.formatMoney)return Shopify.formatMoney(e,_config.moneyFormat);"string"==typeof e&&(e=e.replace(".",""));var n="",a=/\{\{\s*(\w+)\s*\}\}/,i=_config.moneyFormat;switch(i.match(a)[1]){case"amount":n=r(e,2);break;case"amount_no_decimals":n=r(e,0);break;case"amount_with_comma_separator":n=r(e,2,".",",");break;case"amount_no_decimals_with_comma_separator":n=r(e,0,".",",")}return i.replace(a,n)};return _init=function(){new Shopify.CountryProvinceSelector("address_country","address_province",{hideElement:"address_province_container"});var e=jQuery("#address_country"),t=jQuery("#address_province_label").get(0);"undefined"!=typeof Countries&&(Countries.updateProvinceLabel(e.val(),t),e.change(function(){Countries.updateProvinceLabel(e.val(),t)})),jQuery(".get-rates").click(function(){_disableButtons(),jQuery("#"+_config.wrapperId).empty().hide();var e={};e.zip=jQuery("#address_zip").val()||"",e.country=jQuery("#address_country").val()||"",e.province=jQuery("#address_province").val()||"",_getCartShippingRatesForDestination(e)}),_config.customerIsLoggedIn&&jQuery(".get-rates:eq(0)").trigger("click")},{show:function(e){e=e||{},jQuery.extend(_config,e),jQuery(function(){_init()})},getConfig:function(){return _config},formatRate:function(e){return _formatRate(e)}}}();

if(window.location.href.indexOf('/pages/net-term-order') > -1){
    Shopify.Cart.ShippingCalculator.show( {
    submitButton: theme.strings.shippingCalcSubmitButton,
    submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
    customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
    moneyFormat: theme.strings.shippingCalcMoneyFormat
    } );
}

$('[name="waioaddress[zip]"]').keyup(function(){
    setTimeout(function(){
    $('[id="address_zip"]').val($('[name="waioaddress[zip]"]').val());
    $('#address_country').val($('[name="waioaddress[country] "]').val());
    $('#address_province').val($('[name="waioaddress[provice]"]').val());
    $('.get-rates.btn.button').click();
    },500);
})
$('[id="AddressCountryNew"]').on("change",function(){
    $('[id="address_zip"]').val($('[name="waioaddress[zip]"]').val());
    $('#address_country').val($('[name="waioaddress[country] "]').val());
    $('#address_province').val($('[name="waioaddress[provice]"]').val());
    new Shopify.CountryProvinceSelector("AddressCountryNew", "address_province", { hideElement: "address_province_container" });
    $('.get-rates.btn.button').click();
})
$('[name="waioaddress[provice]"]').on("change",function(){
    $('[id="address_zip"]').val($('[name="waioaddress[zip]"]').val());
    $('#address_country').val($('[name="waioaddress[country] "]').val());
    $('#address_province').val($('[name="waioaddress[provice]"]').val());
    $('.get-rates.btn.button').click();
})
$(document).on("change",'[name="address[country]"]',function(){
    if($('#address_province_container select').val()!=null){
    $('#address_province_container').css("width","30%");
    $('#address_province_container').css("display","inline-block");
    }
})
setTimeout(function(){
    if($('#address_province_container select').val()!=null){
    $('#address_province_container').css("width","30%");
    $('#address_province_container').css("display","inline-block");
    }
},2000);

setTimeout(function(){
$('[id="AddressCountryNew"]').trigger('change')
$('.get-rates.btn.button').on("click",function(){
setTimeout(function(){
    if($('#shipping-rates-feedback .sucx').text()==""){
    window.shippingratebyes=null;
    }
    else{console.log('asdas');
        window.shippingratebyes=$('#wrapper-response .success:nth-child(1) .sucx').text().trim();
        setTimeout(function(){
        WSAIO.check_shipping();
        },1000)
        }
},2000)
})
$('.get-rates.btn.button').click();
},200)
},4000)



})


</script>

{% endif %}

<!--     ============================================================Shipping Estimator Code End========================================================================== -->


<!--     ============================================================Bespoke shipping Code start========================================================================== -->
{% if use_bespoke_shipping %}
{{ 'netterm_countries.js' | asset_url | script_tag}}
<script>
$(document).ready(function(){

    WSAIO.bespoke_shipping_apply = function(){
    try{
        $('.net_shipping_method').hide();
        $('.net_shipping_method_div').html('')
        var cart_items = [];
        var shop_country = "{{shop.address.country_code}}";
        var shop_zip="{{shop.address.zip}}";
        var shop_province = "{{shop.address.province_code}}";
        var shop_city = "{{shop.address.city}}";
        var shop_name= "{{shop.name}}";
        var shop_address = "{{shop.address.city}}";
        var shop_phone = "{{shop.phone}}";
        var shop_company = "{{shop.address.company}}";
        var customer_info = {
        default_address: {{ customer.default_address | json }} || {},
        }

        var getcountry_code = isoCountries[$('[name="waioaddress[country] "]').val()]
    var getprovince_code = isoProvinces[$('[name="waioaddress[country] "]').val()].province_codes[$('[name="waioaddress[provice]"]').val()]

    $(WSAIO.cart_object_data.items).each(function(e){
        cart_items.push({
        "name":WSAIO.cart_object_data.items[e].product_title,
        "sku":WSAIO.cart_object_data.items[e].sku,
        "quantity":WSAIO.cart_object_data.items[e].quantity,
        "grams":WSAIO.cart_object_data.items[e].grams,
        "price":WSAIO.cart_object_data.items[e].price,
        "vendor":WSAIO.cart_object_data.items[e].vendor,
        "requires_shipping":WSAIO.cart_object_data.items[e].requires_shipping,
        "taxable":WSAIO.cart_object_data.items[e].taxable,
        "fulfillment_service":"manual",
        "properties":WSAIO.cart_object_data.items[e].null,
        "product_id":WSAIO.cart_object_data.items[e].product_id,
        "variant_id":WSAIO.cart_object_data.items[e].id
        })
                            }).promise().done(function(){
                            var _data = JSON.stringify({
                                "origin": {
                                "country": shop_country,
                                "postal_code": shop_zip,
                                "province": shop_province,
                                "city": shop_city,
                                "name": shop_name,
                                "address1": shop_address,
                                "address2": "",
                                "address3": null,
                                "phone": shop_phone,
                                "fax": null,
                                "address_type": null,
                                "company_name": shop_company
                                },
                                "destination": {
                                "country": getcountry_code,
                                "postal_code": $('[name="waioaddress[zip]"]').val(),
                                "province": getprovince_code,
                                "city": $('[name="waioaddress[city]"]').val(),
                                "name": customer_info.default_address.name,
                                "address1": $('[name="waioaddress[address1]"]').val(),
                                "address2": $('[name="waioaddress[address2]"]').val(),
                                "address3": null,
                                "phone": $('[name="waioaddress[phone]"]').val(),
                                "fax": null,
                                "address_type": null,
                                "company_name": $('[name="waioaddress[company]"]').val()
                                },
                                "items": cart_items,
                                "currency": "AUD"
                            });

                            $.ajax({
                                type: 'POST',
                                url: 'https://parcel-intelligence.com/cs/api_ex.php',
                                cache: false,
                                "headers": {
                                "Content-type": "application/json",
                                "HTTP_X_STORE_NAME": "liquidleds-trade.myshopify.com",
                                "HTTP_X_STORE_TOKEN": "c706b228533d884a7578fd05f40220ecff9d4890",
                                "HTTP_X_SHOW_DEBUG": "true"
                                },
                                data: _data,
                                success: function(result){
                                try{
                                    $('.net_shipping_method').hide();
                                    $('.net_shipping_method_div').html('')
                                    var shipping_method_respone = JSON.parse(`{"rates"${result.split('{"rates"')[1]}`);
                                    window.bespoke_shipping = [];
                                    $(shipping_method_respone.rates).each(function(e){
                                    bespoke_shipping.push(shipping_method_respone.rates[e])
                                    var _price = shipping_method_respone.rates[e].total_price;
                                    var _service_name = shipping_method_respone.rates[e].service_name;
                                    if($('.wholesale_ship').length == 0 && WSAIO.applied_shipping != undefined){
                                    if(WSAIO.applied_shipping.shipping_line.price == 0){
                                        $('.net_shipping_method_div').append('<div class="w-100 net_shipping_method_input_div wholesale_ship"> <input type="radio" class="net_shipping_method_input " name="bespoke" value="'+WSAIO.applied_shipping.shipping_line.price*100+'" title="Wholesale Shipping"> <label for="'+_service_name+'">Flat rate shipping</label> <span class="ship_value" style="float: right;"><b>free</b></span> </div>')
                                    }else{
                                        $('.net_shipping_method_div').append('<div class="w-100 net_shipping_method_input_div wholesale_ship"> <input type="radio" class="net_shipping_method_input " name="bespoke" value="'+WSAIO.applied_shipping.shipping_line.price*100+'" title="Wholesale Shipping"> <label for="'+_service_name+'">Flat rate shipping</label> <span class="ship_value" style="float: right;"><b>$'+WSAIO.applied_shipping.shipping_line.price+'</b></span> </div>')
                                    }
                                    }
                                    if(_price == 0){
                                    $('.net_shipping_method_div').append('<div class="w-100 net_shipping_method_input_div"> <input type="radio" class="net_shipping_method_input " name="bespoke" value="'+_price+'" title="'+_service_name+'"> <label for="'+_service_name+'">'+_service_name+'</label> <span class="ship_value" style="float: right;"><b>free</b></span> </div>')
                                    }else{
                                    $('.net_shipping_method_div').append('<div class="w-100 net_shipping_method_input_div"> <input type="radio" class="net_shipping_method_input " name="bespoke" value="'+_price+'" title="'+_service_name+'"> <label for="'+_service_name+'">'+_service_name+'</label> <span class="ship_value" style="float: right;"><b>$'+_price/100+'</b></span> </div>')
                                    }
                                    }).promise().done(function(){
                                    if(bespoke_shipping.length > 0){
                                        $('.net_shipping_method_div .net_shipping_method_input_div:nth-child(1) input').trigger('click')
                                        $('.net_shipping_method').show();
                                        $('[name="bespoke"]').on('change',function(){
                                        WSAIO.check_shipping();
                                        })
                                        WSAIO.check_shipping();
                                    }
                                    })

                                }catch(e){console.log(e)}

                                }
                            });
                            })
    }catch(ee){console.log(ee)}
    }
    setTimeout(function(){
    $('.auto_address option[value="default"]').attr("selected", "selected");
    $(".auto_address").trigger('change')
    WSAIO.bespoke_shipping_apply();
    $('[name="waioaddress[provice]"], .slct_cntry select').on("change",function(){
        $('.net_shipping_method').hide();
        $('.net_shipping_method_div').html('')
        WSAIO.bespoke_shipping_apply();
    })
    $('[name="waioaddress[zip]"]').keyup(function(){
        $('.net_shipping_method').hide();
        $('.net_shipping_method_div').html('')
        WSAIO.bespoke_shipping_apply();
    })

    },3000);


})




</script>
{% endif %}

<!--     ============================================================Bespoke shipping Code end========================================================================== -->
  
{% else %}
{% if check_cart_item == 0 %}
<script> window.location.href = '/cart' </script>
{% else %}
<script> window.location.href = '/' </script>
{% endif %}
{% endif %} 

