var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
function isIE() {
   ua = navigator.userAgent;
   var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
   return is_ie;
}
if (isIE()) {
   document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
   document.querySelector('html').classList.add('_touch');
}

function ibg() {
   if (isIE()) {
      let ibg = document.querySelectorAll("._ibg");
      for (var i = 0; i < ibg.length; i++) {
         if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
            ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
         }
      }
   }
}
ibg();

// Menu ========================================================================================
let iconMenu = document.querySelector(".icon-menu");
iconMenu.addEventListener("click", function () {
   iconMenu.classList.toggle("_active");
   document.body.classList.toggle("_active");
});

//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let i = 0; i < tabs.length; i++) {
   let tab = tabs[i];
   let tabItems = tab.querySelectorAll("._tabs-item");
   let tabBlocks = tab.querySelectorAll("._tabs-block");
   for (let i = 0; i < tabItems.length; i++) {
      let tabItem = tabItems[i];
      tabItem.addEventListener("click", function (e) {
         for (let i = 0; i < tabItems.length; i++) {
            let tabItem = tabItems[i];
            tabItem.classList.remove('_active');
            tabBlocks[i].classList.remove('_active');
         }
         tabItem.classList.add('_active');
         tabBlocks[i].classList.add('_active');
         e.preventDefault();
      });
   }
}

// Button Up =====================================================================================
document.addEventListener("DOMContentLoaded", function () {
   const backToTop = document.querySelector(".back-to-top");

   // Показать/скрыть кнопку при прокрутке страницы
   window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
         backToTop.style.display = "block";
      } else {
         backToTop.style.display = "none";
      }
   });

   // Плавная прокрутка при клике на кнопку
   backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
         top: 0,
         behavior: "smooth"
      });
   });
});

// Form =====================================================================================
function email_test(input) {
   return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
   for (let index = 0; index < forms.length; index++) {
      const el = forms[index];
      el.addEventListener('submit', form_submit);
   }
}
async function form_submit(e) {
   let btn = e.target;
   let form = btn.closest('form');
   let error = form_validate(form);
   if (error == 0) {
      let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
      let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
      const message = form.getAttribute('data-message');
      const ajax = form.getAttribute('data-ajax');

      //SendForm
      if (ajax) {
         e.preventDefault();
         let formData = new FormData(form);
         form.classList.add('_sending');
         let response = await fetch(formAction, {
            method: formMethod,
            body: formData
         });
         if (response.ok) {
            let result = await response.json();
            form.classList.remove('_sending');
            if (message) {
               popup_open(message + '-message');
            }
            form_clean(form);
         } else {
            alert("Ошибка");
            form.classList.remove('_sending');
         }
      }
      // If test
      if (form.hasAttribute('data-test')) {
         e.preventDefault();
         if (message) {
            popup_open(message + '-message');
         }
         form_clean(form);
      }
   } else {
      let form_error = form.querySelectorAll('._error');
      if (form_error && form.classList.contains('_goto-error')) {
         _goto(form_error[0], 1000, 50);
      }
      e.preventDefault();
   }
}
function form_validate(form) {
   let error = 0;
   let form_req = form.querySelectorAll('._req');
   if (form_req.length > 0) {
      for (let index = 0; index < form_req.length; index++) {
         const el = form_req[index];
         if (!_is_hidden(el)) {
            error += form_validate_input(el);
         }
      }
   }
   return error;
}
function form_validate_input(input) {
   let error = 0;
   let input_g_value = input.getAttribute('data-value');

   if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
      if (input.value != input_g_value) {
         let em = input.value.replace(" ", "");
         input.value = em;
      }
      if (email_test(input) || input.value == input_g_value) {
         form_add_error(input);
         error++;
      } else {
         form_remove_error(input);
      }
   } else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
      form_add_error(input);
      error++;
   } else {
      if (input.value == '' || input.value == input_g_value) {
         form_add_error(input);
         error++;
      } else {
         form_remove_error(input);
      }
   }
   return error;
}
function form_add_error(input) {
   input.classList.add('_error');
   input.parentElement.classList.add('_error');

   let input_error = input.parentElement.querySelector('.form__error');
   if (input_error) {
      input.parentElement.removeChild(input_error);
   }
   let input_error_text = input.getAttribute('data-error');
   if (input_error_text && input_error_text != '') {
      input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
   }
}
function form_remove_error(input) {
   input.classList.remove('_error');
   input.parentElement.classList.remove('_error');

   let input_error = input.parentElement.querySelector('.form__error');
   if (input_error) {
      input.parentElement.removeChild(input_error);
   }
}
function form_clean(form) {
   let inputs = form.querySelectorAll('input,textarea');
   for (let index = 0; index < inputs.length; index++) {
      const el = inputs[index];
      el.parentElement.classList.remove('_focus');
      el.classList.remove('_focus');
      el.value = el.getAttribute('data-value');
   }
   let checkboxes = form.querySelectorAll('.checkbox__input');
   if (checkboxes.length > 0) {
      for (let index = 0; index < checkboxes.length; index++) {
         const checkbox = checkboxes[index];
         checkbox.checked = false;
      }
   }
   let selects = form.querySelectorAll('select');
   if (selects.length > 0) {
      for (let index = 0; index < selects.length; index++) {
         const select = selects[index];
         const select_default_value = select.getAttribute('data-default');
         select.value = select_default_value;
         select_item(select);
      }
   }
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
   if (inputs.length > 0) {
      for (let index = 0; index < inputs.length; index++) {
         const input = inputs[index];
         const input_g_value = input.getAttribute('data-value');
         input_placeholder_add(input);
         if (input.value != '' && input.value != input_g_value) {
            input_focus_add(input);
         }
         input.addEventListener('focus', function (e) {
            if (input.value == input_g_value) {
               input_focus_add(input);
               input.value = '';
            }
            if (input.getAttribute('data-type') === "pass") {
               if (input.parentElement.querySelector('._viewpass')) {
                  if (!input.parentElement.querySelector('._viewpass').classList.contains('_active')) {
                     input.setAttribute('type', 'password');
                  }
               } else {
                  input.setAttribute('type', 'password');
               }
            }
            if (input.classList.contains('_date')) {
               /*
               input.classList.add('_mask');
               Inputmask("99.99.9999", {
                  //"placeholder": '',
                  clearIncomplete: true,
                  clearMaskOnLostFocus: true,
                  onincomplete: function () {
                     input_clear_mask(input, input_g_value);
                  }
               }).mask(input);
               */
            }
            if (input.classList.contains('_phone')) {
               //'+7(999) 999 9999'
               //'+38(999) 999 9999'
               //'+375(99)999-99-99'
               input.classList.add('_mask');
               Inputmask("+375 (99) 9999999", {
                  //"placeholder": '',
                  clearIncomplete: true,
                  clearMaskOnLostFocus: true,
                  onincomplete: function () {
                     input_clear_mask(input, input_g_value);
                  }
               }).mask(input);
            }
            if (input.classList.contains('_digital')) {
               input.classList.add('_mask');
               Inputmask("9{1,}", {
                  "placeholder": '',
                  clearIncomplete: true,
                  clearMaskOnLostFocus: true,
                  onincomplete: function () {
                     input_clear_mask(input, input_g_value);
                  }
               }).mask(input);
            }
            form_remove_error(input);
         });
         input.addEventListener('blur', function (e) {
            if (input.value == '') {
               input.value = input_g_value;
               input_focus_remove(input);
               if (input.classList.contains('_mask')) {
                  input_clear_mask(input, input_g_value);
               }
               if (input.getAttribute('data-type') === "pass") {
                  input.setAttribute('type', 'text');
               }
            }
         });
         if (input.classList.contains('_date')) {
            const calendarItem = datepicker(input, {
               customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
               customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
               overlayButton: 'Применить',
               overlayPlaceholder: 'Год (4 цифры)',
               startDay: 1,
               formatter: (input, date, instance) => {
                  const value = date.toLocaleDateString()
                  input.value = value
               },
               onSelect: function (input, instance, date) {
                  input_focus_add(input.el);
               }
            });
            const dataFrom = input.getAttribute('data-from');
            const dataTo = input.getAttribute('data-to');
            if (dataFrom) {
               calendarItem.setMin(new Date(dataFrom));
            }
            if (dataTo) {
               calendarItem.setMax(new Date(dataTo));
            }
         }
      }
   }
}
function input_placeholder_add(input) {
   const input_g_value = input.getAttribute('data-value');
   if (input.value == '' && input_g_value != '') {
      input.value = input_g_value;
   }
}
function input_focus_add(input) {
   input.classList.add('_focus');
   input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
   input.classList.remove('_focus');
   input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
   input.inputmask.remove();
   input.value = input_g_value;
   input_focus_remove(input);
}

//ScrollOnClick (Navigation)
let link = document.querySelectorAll('._goto-block');
if (link) {
   let blocks = [];
   for (let index = 0; index < link.length; index++) {
      let el = link[index];
      let block_name = el.getAttribute('href').replace('#', '');
      if (block_name != '' && !~blocks.indexOf(block_name)) {
         blocks.push(block_name);
      }
      el.addEventListener('click', function (e) {
         if (document.querySelector('.menu__body._active')) {
            menu_close();
            body_lock_remove(500);
         }
         let target_block_class = el.getAttribute('href').replace('#', '');
         let target_block = document.querySelector('.' + target_block_class);
         _goto(target_block, 300);
         e.preventDefault();
      })
   }

   window.addEventListener('scroll', function (el) {
      let old_current_link = document.querySelectorAll('._goto-block._active');
      if (old_current_link) {
         for (let index = 0; index < old_current_link.length; index++) {
            let el = old_current_link[index];
            el.classList.remove('_active');
         }
      }
      for (let index = 0; index < blocks.length; index++) {
         let block = blocks[index];
         let block_item = document.querySelector('.' + block);
         if (block_item) {
            let block_offset = offset(block_item).top;
            let block_height = block_item.offsetHeight;
            if ((pageYOffset > block_offset - window.innerHeight / 3) && pageYOffset < (block_offset + block_height) - window.innerHeight / 3) {
               let current_links = document.querySelectorAll('._goto-block[href="#' + block + '"]');
               for (let index = 0; index < current_links.length; index++) {
                  let current_link = current_links[index];
                  current_link.classList.add('_active');
               }
            }
         }
      }
   })
}
//ScrollOnClick (Simple)
let goto_links = document.querySelectorAll('._goto');
if (goto_links) {
   for (let index = 0; index < goto_links.length; index++) {
      let goto_link = goto_links[index];
      goto_link.addEventListener('click', function (e) {
         let target_block_class = goto_link.getAttribute('href').replace('#', '');
         let target_block = document.querySelector('.' + target_block_class);
         _goto(target_block, 300);
         e.preventDefault();
      });
   }
}
function _goto(target_block, speed, offset = 0) {
   let header = '';
   //OffsetHeader
   //if (window.innerWidth < 992) {
   //	header = 'header';
   //}
   let options = {
      speedAsDuration: true,
      speed: speed,
      header: header,
      offset: offset,
      easing: 'easeOutQuad',
   };
   let scr = new SmoothScroll();
   scr.animateScroll(target_block, '', options);
}

//SameFunctions
function offset(el) {
   var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
   return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
function disableScroll() {
   if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
   document.addEventListener('wheel', preventDefault, { passive: false }); // Disable scrolling in Chrome
   window.onwheel = preventDefault; // modern standard
   window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
   window.ontouchmove = preventDefault; // mobile
   document.onkeydown = preventDefaultForScrollKeys;
}
function enableScroll() {
   if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
   document.removeEventListener('wheel', preventDefault, { passive: false }); // Enable scrolling in Chrome
   window.onmousewheel = document.onmousewheel = null;
   window.onwheel = null;
   window.ontouchmove = null;
   document.onkeydown = null;
}
function preventDefault(e) {
   e = e || window.event;
   if (e.preventDefault)
      e.preventDefault();
   e.returnValue = false;
}
function preventDefaultForScrollKeys(e) {
   /*if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
   }*/
}

function fix_block(scr_fix_block, scr_value) {
   let window_width = parseInt(window.innerWidth);
   let window_height = parseInt(window.innerHeight);
   let header_height = parseInt(document.querySelector('header').offsetHeight) + 15;
   for (let index = 0; index < scr_fix_block.length; index++) {
      const block = scr_fix_block[index];
      let block_width = block.getAttribute('data-width');
      const item = block.querySelector('._side-block');
      if (!block_width) { block_width = 0; }
      if (window_width > block_width) {
         if (item.offsetHeight < window_height - (header_height + 30)) {
            if (scr_value > offset(block).top - (header_height + 15)) {
               item.style.cssText = "position:fixed;bottom:auto;top:" + header_height + "px;width:" + block.offsetWidth + "px;left:" + offset(block).left + "px;";
            } else {
               gotoRelative(item);
            }
            if (scr_value > (block.offsetHeight + offset(block).top) - (item.offsetHeight + (header_height + 15))) {
               block.style.cssText = "position:relative;";
               item.style.cssText = "position:absolute;bottom:0;top:auto;left:0px;width:100%";
            }
         } else {
            gotoRelative(item);
         }
      }
   }
   function gotoRelative(item) {
      item.style.cssText = "position:relative;bottom:auto;top:0px;left:0px;";
   }
}

function custom_scroll(event) {
   scr_body.style.overflow = 'hidden';
   let window_height = window.innerHeight;
   let custom_scroll_line = document.querySelector('._custom-scroll__line');
   let custom_scroll_content_height = document.querySelector('.wrapper').offsetHeight;
   let custom_cursor_height = Math.min(window_height, Math.round(window_height * (window_height / custom_scroll_content_height)));
   if (custom_scroll_content_height > window_height) {
      if (!custom_scroll_line) {
         let custom_scroll = document.createElement('div');
         custom_scroll_line = document.createElement('div');
         custom_scroll.setAttribute('class', '_custom-scroll');
         custom_scroll_line.setAttribute('class', '_custom-scroll__line');
         custom_scroll.appendChild(custom_scroll_line);
         scr_body.appendChild(custom_scroll);
      }
      custom_scroll_line.style.height = custom_cursor_height + 'px';
   }
}

let new_pos = pageYOffset;
function scroll_animate(event) {
   let window_height = window.innerHeight;
   let content_height = document.querySelector('.wrapper').offsetHeight;
   let start_position = pageYOffset;
   let pos_add = 100;

   if (event.keyCode == 40 || event.keyCode == 34 || event.deltaX > 0 || event.deltaY < 0) {
      new_pos = new_pos - pos_add;
   } else if (event.keyCode == 38 || event.keyCode == 33 || event.deltaX < 0 || event.deltaY > 0) {
      new_pos = new_pos + pos_add;
   }
   if (new_pos > (content_height - window_height)) new_pos = content_height - window_height;
   if (new_pos < 0) new_pos = 0;

   if (scrolling) {
      scrolling = false;
      _goto(new_pos, 1000);

      let scr_pause = 100;
      if (navigator.appVersion.indexOf("Mac") != -1) {
         scr_pause = scr_pause * 2;
      };
      setTimeout(function () {
         scrolling = true;
         _goto(new_pos, 1000);
      }, scr_pause);
   }
   //If native scroll
   //disableScroll();
}
