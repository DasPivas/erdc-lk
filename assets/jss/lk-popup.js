/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

window.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.lk-popup__evaluations-label').forEach(function (label) {
    label.addEventListener('click', function (e) {
      var target = e.target;
      var popupForm = document.querySelector('.lk-popup--active');
      var evaluationsLabls = popupForm.querySelectorAll('.lk-popup__evaluations-label');
      var isPaint = true;
      evaluationsLabls.forEach(function (innerLabel) {
        if (innerLabel.classList.contains('lk-popup__evaluations-label--selected')) {
          innerLabel.classList.remove('lk-popup__evaluations-label--selected');
        }

        if (isPaint) {
          innerLabel.classList.add('lk-popup__evaluations-label--selected');
        }

        if (innerLabel === target) {
          isPaint = false;
        }
      });
    });
  });
  document.querySelectorAll('[data-for-popup]').forEach(function (consultationBtn) {
    consultationBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var optionPopup = consultationBtn.dataset.forPopup;
      var ticketNumber = consultationBtn.dataset.tiketNumber;
      var selectValue = consultationBtn.dataset.selectValue;
      var popup = document.querySelector("[data-popup=".concat(optionPopup, "]"));
      var inputTikcetNumber = popup.querySelector('.lk-popup__tiket-value');
      var selectBlock = popup.querySelector('.lk-popup__service-select');

      if (selectBlock) {
        selectValue ? selectBlock.value = selectValue : selectBlock.value = '';
      }

      popup.classList.add('lk-popup--active');

      if (inputTikcetNumber) {
        inputTikcetNumber.value = ticketNumber;
      }

      if (optionPopup === 'service' || 'getConsultation') {
        var form = popup.querySelector('form');
        form.addEventListener('submit', function (event) {
          sendForm(event, form);
        });
      }
    });
  });

  var removeAttr = function removeAttr(collection, option, value) {
    switch (option) {
      case 'class':
        collection.forEach(function (el) {
          if (el.classList.contains(value)) {
            el.classList.remove(value);
          }
        });
        break;

      case 'checked':
        collection.forEach(function (el) {
          if (el.checked) {
            el.checked = value;
          }
        });
        break;

      case 'value':
        collection.forEach(function (el) {
          el.value = '';
        });
        break;
    }
  };

  var closePopup = function closePopup() {
    var activeForm = document.querySelector('.lk-popup--active');
    var inputTiketNumber = activeForm.querySelectorAll('.lk-popup__tiket-value');
    var inputName = activeForm.querySelectorAll('.lk-popup__name-input');
    var inputPhone = activeForm.querySelectorAll('.lk-popup__phone-input');
    var inputEmail = activeForm.querySelectorAll('.lk-popup__email-input');
    var textareaComment = activeForm.querySelectorAll('.lk-popup__textarea');
    var labelEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-label');
    var inputEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-input');
    removeAttr(inputTiketNumber, 'value', '');
    removeAttr(inputName, 'value', '');
    removeAttr(inputPhone, 'value', '');
    removeAttr(inputEmail, 'value', '');
    removeAttr(textareaComment, 'value', '');
    removeAttr(labelEvaluations, 'class', 'lk-popup__evaluations-label--selected');
    removeAttr(inputEvaluations, 'checked', false);
    activeForm.classList.remove('lk-popup--active');
  };

  document.querySelectorAll('[data-js=popup-close]').forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      closePopup();
    });
  });
  document.querySelectorAll('.lk-popup').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target.classList.contains('lk-popup--active')) {
        closePopup();
      }
    });
  });

  function getFormInputs(form) {
    var inputsValues = {};
    var formInputs = form.elements;
    Object.entries(formInputs).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          inputName = _ref2[0],
          input = _ref2[1];

      inputsValues[inputName] = input.value;
    });
    return inputsValues;
  }

  function successAlert() {
    var successForm = document.querySelector('[data-popup=success]');

    if (successForm) {
      successForm.classList.add('lk-popup--active');
    }
  }

  function requestFormApi(_x) {
    return _requestFormApi.apply(this, arguments);
  }

  function _requestFormApi() {
    _requestFormApi = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
      var data,
          result,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              data = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _context.prev = 1;
              _context.next = 4;
              return fetch(url, {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(data)
              });

            case 4:
              result = _context.sent;
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](1);
              throw _context.t0;

            case 10:
              if (result.ok) {
                _context.next = 12;
                break;
              }

              throw new Error('Ответ сети был не ok.');

            case 12:
              return _context.abrupt("return", result);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 7]]);
    }));
    return _requestFormApi.apply(this, arguments);
  }

  function sendForm(event, form) {
    event.preventDefault();
    var submitBtn = form.querySelector('input[type=submit]');
    var url = 'https://jsonplaceholder.typicode.com/posts';
    var data = getFormInputs(form);
    submitBtn.disabled = true;
    requestFormApi(url, data).then(function (response) {
      closePopup();
      successAlert();
    }).catch(function (err) {
      console.error(err);
    }).finally(function () {
      submitBtn.disabled = false;
    });
  }

  document.querySelectorAll('.lk-popup__phone-input').forEach(function (input) {
    input.addEventListener('focus', function (event) {
      var parent = event.target.parentNode;
      if (parent.classList.contains('lk-popup__phone-wrapper')) parent.classList.add('lk-popup__phone-wrapper--hover');
    });
    input.addEventListener('blur', function (event) {
      var parent = event.target.parentNode;
      if (parent.classList.contains('lk-popup__phone-wrapper--hover')) parent.classList.remove('lk-popup__phone-wrapper--hover');
    });
  });
});
/******/ })()
;