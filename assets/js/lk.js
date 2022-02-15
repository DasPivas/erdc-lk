var app = {
    'init': function () {
        func.jsPopup();
        func.jsSlider();
        func.jsToggle();
        func.jsUI();
        func.jsFileUpload();
        func.jsExtra();
    },
    'load': function () {
    },
    'resize': function () {
    },
    'scroll': function () {
    },
    'popup': function () {
        func.jsPopup();
        func.jsFileUpload();
        $.colorbox.resize();
    }
};

var func = {
    'jsPopup': function () {
        if ($().colorbox) {
            $('[data-colorbox]').each(function () {
                var s = {
                    previous: '<i class="fa fa-angle-left" />',
                    next: '<i class="fa fa-angle-right" />',
                    close: '',
                    maxWidth: '100%',
                    opacity: .5,
                    onComplete: function () {
                        app.popup();
                    }
                }, o = $(this).data('colorbox'), s = $.extend(s, o);
                $(this).colorbox(s);
            });
        }
    },
    'jsPopupMessage': function (html) {
        if ($().colorbox) {
            $.colorbox({
                close: '',
                maxWidth: '100%',
                html: '<div class="popup-message-wrap">' + html + '</div>',
                scrolling: false,
                opacity: .5,
                onComplete: function () {
                    app.popup();
                }
            });
        }
    },
    'jsSlider': function () {
        if ($().slick) {
            $('[data-slick]').slick({
                accessibility: false,
                speed: 500,
                touchMove: false,
                touchThreshold: 500,
                prevArrow: '<i class="slick-arrow slick-prev fa fa-angle-left trans" />',
                nextArrow: '<i class="slick-arrow slick-next fa fa-angle-right trans" />'
            });
        }
    },
    'jsToggle': function () {

        $(document).off('click', '.js-lk-uploader-share-toggle').on('click', '.js-lk-uploader-share-toggle', function () {
            var wrap = $(this).closest('.lk-uploader__share');
            wrap.toggleClass('is-opened');
        });

        $(document).off('click', '.js-lk-uploader-share-input').on('click', '.js-lk-uploader-share-input', function () {
            var input = $(this);
            input.focus();
            input.select();
            document.execCommand('copy');
            input.addClass('is-copied');
            setTimeout(function(){
                input.removeClass('is-copied');
                input.blur();
            },1000);
            setTimeout(function(){
                $('.lk-uploader__share').removeClass('is-opened');
            },1500);
        });

        $(document).off('click', '.js-form-hint-toggle').on('click', '.js-form-hint-toggle', function () {
            var wrap = $(this).closest('.js-form-hint-toggled');
            wrap.toggleClass('is-form-hint-toggled');
        });

        $(document).off('click', '.js-lk-box-form-toggle').on('click', '.js-lk-box-form-toggle', function () {
            var wrap = $(this).closest('.js-lk-box-form-toggled'),
                form = $('.lk-form', wrap),
                text = $(this).data('text');
            wrap.toggleClass('is-form-toggled');
            form.toggleClass('lk-form_collapsed');
            if (text.off && text.on) {
                $('.im', this).toggleClass('im-pencil im-close');
                if (wrap.hasClass('is-form-toggled')) {
                    $('span', this).text(text.off);
                } else {
                    $('span', this).text(text.on);
                }
            }
        });

        $(document).off('click', '[data-scrollto]').on('click', '[data-scrollto]', function () {
            var data = $(this).data('scrollto'),
                target = data.target,
                offset = (parseInt(data.offset) > 0) ? parseInt(data.offset) : 0;
            if ($(target).length)
                $('body,html').animate({scrollTop: $(target).offset().top - offset}, 300);
        });
        $(document).off('click', '[data-toggle]').on('click', '[data-toggle]', function () {
            var data = $(this).data('toggle');
            if (data.removeFrom && data.removeClass)
                $(data.removeFrom).removeClass(data.removeClass);
            if (data.target && data.className)
                $(data.target).toggleClass(data.className);
            if (data.textShow && data.textHide) {
                $(data.target).hasClass(data.className) ? $(this).html(data.textHide) : $(this).html(data.textShow);
            }
            if ($().colorbox)
                $.colorbox.resize();
        });
        $(document).on('click', function (e) {
            var formHintWrap = $('.js-form-hint-toggled'),
                fileShare = $('.lk-uploader__share');
            if (!formHintWrap.is(e.target) && formHintWrap.has(e.target).length === 0)
                $('*').removeClass('is-form-hint-toggled');
            if (!fileShare.is(e.target) && fileShare.has(e.target).length === 0)
                fileShare.removeClass('is-opened');
        });
        $(document).keyup(function (e) {
            if (e.key === 'Escape' || e.key === 'escape' || e.keyCode === 27) {
                $('*').removeClass('is-form-hint-toggled');
                $('.lk-uploader__share').removeClass('is-opened');
            }
        });
    },
    'jsUI': function () {
        if ($().inputmask) {
            $('[data-inputmask]').inputmask({
                showMaskOnHover: false
            });
        }
        if ($().chosen) {
            console.log($('select.js-select'))
            $('select.js-select').chosen({
                disable_search: true,
                inherit_select_classes: true,
            });
        }
        if ($().stick_in_parent) {
            $('[data-sticky]').each(function () {
                var data = $(this).data('sticky'),
                    parent = data.parent ? data.parent : $(this).parent(),
                    offsetTop = parseInt(data.offsetTop) > 0 ? parseInt(data.offsetTop) : 0;
                $(this).stick_in_parent({
                    parent: parent,
                    offset_top: offsetTop,
                    sticky_class: 'is-stuck'
                });
            });
        }
        if ($().scrollbar) {
            $('.js-scrollbar-custom').scrollbar();
        }
    },
    'jsFileUpload': function () {
        $('[data-add-field]').each(function () {
            var box = $(this),
                params = $(this).data('add-field'),
                btn = $('[data-attrs]', box),
                step = !!params.step;
            btn.off('click').on('click', function () {
                var attrs = $(this).data('attrs');
                if (!step || (step && box.prev('.lk-file-upload').hasClass('has-val'))) {
                    if (params.type === 'file') {
                        box.before('<input type="file" name="' + attrs.name + '" data-upload=\'{"type": "' + attrs.type + '", "placeholder": "' + attrs.placeholder + '"}\' />');
                        jsFileUpload();
                    }
                    if (step) {
                        box.prev('.lk-file-upload').find('[type="file"]').trigger('click');
                    }
                } else {
                    box.prev('.lk-file-upload').find('[type="file"]').trigger('click');
                }
            });
        });

        $('[data-upload]').each(function () {
            var control = $(this),
                params = control.data('upload'),
                placeholder = params.placeholder ? params.placeholder : '&nbsp;';
            control
                .not('.is-inited')
                .addClass('is-inited')
                .wrap('<span class="lk-file-upload lk-file-upload_' + params.type + '" />')
                .after('<span class="lk-file-upload__value js-file-value">' + params.placeholder + '</span>')
                .after('<i class="im im-upload"/><i class="im im-close js-file-clear"/>');
            var wrap = control.closest('.lk-file-upload'),
                clear = $('.js-file-clear', wrap),
                value = $('.js-file-value', wrap);
            control.off('change').on('change', function (e) {
                var arVal = control.val().split('\\'),
                    file = arVal[arVal.length - 1];
                if (file.length) {
                    value.text(GetFileName(file) + '.' + GetFileExt(file));
                    wrap.addClass('has-val').attr('data-ext', GetFileExt(file));
                } else {
                    value.text(placeholder);
                    wrap.removeClass('has-val').removeAttr('data-ext');
                }
                if(params.hasOwnProperty('onchange')){
                    var funcName = params.onchange;
                    var cb = null;

                    if(typeof(window[funcName])=='function')
                        cb = window[funcName];

                    if(typeof(funcName)=='function')
                        cb = funcName;

                    cb.call(e.originalEvent,control);
                }
            });
            clear.off('click').on('click', function () {
                value.text(placeholder);
                control.val('').trigger('change');
            });
            if (params.type === 'image') {
                wrap.not('.has-val').prepend('<figure class="is-contain"><img src="' + params.src + '" class="js-file-preview" alt="" /></figure>');
                var preview = $('.js-file-preview', wrap);
                control.on('change', function () {
                    GetFilePath(this, preview);
                });
            }

        });

        $('.js-file-remove').off('click').on('click', function () {
            $(this).closest('.lk-file-upload').remove();
        });

        function GetFileName(src) {
            return src.substr(0, src.lastIndexOf('.')) || src;
        }

        function GetFileExt(src) {
            return src.split('.').pop();
        }

        function GetFilePath(input, preview) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(preview).attr('src', e.target.result).show();
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

    },
    'jsExtra': function() {}
};

$(function () {

    app.init();

    $(window).on('load', function () {
        app.load();
    });

    $(window).on('resize', function () {
        app.resize();
    });

	var hSearch = $('.js-h-search');
	if (hSearch.length) {
		var input = hSearch.find('input[type="text"]');
		var hSearchItem = hSearch.parents('.h-nav__item');
		var otherItems = hSearchItem.siblings('.h-nav__item:not(.js-h-search):not(.h-nav__item_user-menu)');
		hSearchItem.on('click', function () {
			var w = $(window).width();
			$(this).addClass('h-nav__item_active');
			otherItems.addClass('h-nav__item_transparent');
		});
		$(document).on('click', function (e) {
			var w = $(window).width();
			var $target = $(e.target);
			var isSearch = $target.is('.h-nav__item_search') || $target.parents('.h-nav__item_search').length;
			if (!isSearch) {
				hSearchItem.removeClass('h-nav__item_active');
				if (w > 1024) {
					otherItems.removeClass('h-nav__item_transparent');
				}
			}
		});
	}

	var fixedHeader = $('.header_fixed');
	var burger = $('#slide-nav-trigger');
	$(window).on('scroll', function () {
		var topOffset = $(document).scrollTop();
		if (topOffset > 200) {
			fixedHeader.addClass('header_active');
			burger.addClass('burger_scrolled');
		} else {
			fixedHeader.removeClass('header_active');
			burger.removeClass('burger_scrolled');
		}
	});
	var upBtn = $('.js-up-btn');
	if (upBtn.length) {
		upBtn.on('click', function () {
			$('html, body').animate({ scrollTop: $('header').position().top }, 500);
		});
	}
	$(function(){

		// LEFT SLIDE SIDEBAR
		var slideNavApi = {
			el: function(){
				this.$menu = $('#slide-nav');
				this.$trigger = $("#slide-nav-trigger");
				this.$getMainLinks = $('.slide-nav__list_main [data-nav-target]', this.menu);
				this.$getSubs = $('[data-nav-links]', this.menu);
				this.$getSubsContainer = $('.slide-nav__list_subs', this.menu);
			},
			showFunc: function(){
				var $trigger = this.$trigger;
				var $menu = this.$menu;
				// Добавляем класс активности триггеру
				$trigger.addClass('burger_active');
				// Добавляем класс активности всему меню
				$menu.addClass('slide-nav_active');
			},
			hideFunc: function(){
				var $trigger = this.$trigger;
				var $menu = this.$menu;
				// Убираем класс активности триггеру
				$trigger.removeClass('burger_active');
				// Убираем класс активности всему меню
				$menu.removeClass('slide-nav_active');
				slideNavApi.resetMenu();
			},
			resetMenu: function(){
				var $subsContainer = this.$getSubsContainer;
				var $sublists = this.$getSubs;
				var $mainLinks = this.$getMainLinks;
				// Если нажали на одинокую ссылку
				$subsContainer.removeClass('slide-nav__list_active');
				$sublists.removeClass('js-active').fadeOut(0);
				// Убираем главной ссылке класс активности
				$mainLinks.removeClass('slide-nav__link_active');
			},
			openSublinks: function(){
				var $mainLinks = this.$getMainLinks;
				var $sublists = this.$getSubs;
				var $subsContainer = this.$getSubsContainer;
				$mainLinks.on('click', function(){
					if ($(this).is('[data-nav-target]')){
						// добавляем главной ссылке класс активности
						$mainLinks
							.removeClass('slide-nav__link_active')
							.filter($(this))
							.addClass('slide-nav__link_active');
						// Если нажали на ссылку с контентом
						var targetLinksIndex = $(this).data('nav-target');
						var toShowLinks = $('[data-nav-links='+ targetLinksIndex +']');
						$subsContainer.addClass('slide-nav__list_active');
						if (toShowLinks.hasClass('js-active')){
							return false;
						}
						$sublists
							.removeClass('js-active')
							.fadeOut(0)
							.filter('[data-nav-links='+ targetLinksIndex +']')
							.addClass('js-active')
							.fadeIn(400);
					}else {
						slideNavApi.resetMenu();
					}
				});
			}
		};
		slideNavApi.el(); // Кешируем дом
		$('#slide-nav').slideReveal({
			trigger: $("#slide-nav-trigger"),
			push: false,
			width: 566,
			show: function(conteiner){
				slideNavApi.showFunc();
			},
			hide: function(conteiner){
				slideNavApi.hideFunc();
			}
		});
		$('#slide-nav').show();
		// функция открытия ссылок
		slideNavApi.openSublinks();
	});
});

/* FILE UPLOADER */
'use strict';
(function ($, window, document, undefined) {
    // feature detection for drag&drop upload

    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    $('.js-lk-uploader').each(function () {
        var $form = $(this),
            $input = $form.find('input[type="file"]'),
            $errorMsg = $form.find('.js-lk-uploader-error'),
            droppedFiles = false,
            showFiles = function (files) {
                console.log('input get file');
            };

        // letting the server side to know we are going to make an Ajax request
        $form.append('<input type="hidden" name="ajax" value="1" />');

        // automatically submit the form on file select
        $input.on('change', function (e) {
            showFiles(e.target.files);
            $form.trigger('submit');
        });

        // drag&drop files if the feature is available
        if (isAdvancedUpload) {
            $form
                .addClass('has-advanced-upload')
                .on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragover dragenter', function (){
                    $form.addClass('is-dragover');
                })
                .on('dragleave dragend drop', function () {
                    $form.removeClass('is-dragover');
                })
                .on('drop', function (e) {
                    droppedFiles = e.originalEvent.dataTransfer.files;
                    showFiles(droppedFiles);
                    $form.trigger('submit');
                });
        }

        // if the form was submitted
        $form.on('submit', function (e) {
            // preventing the duplicate submissions if the current one is in progress
            if ($form.hasClass('is-uploading')) return false;

            $form.addClass('is-uploading').removeClass('is-error');

            // ajax file upload for modern browsers
            if (isAdvancedUpload) {
                e.preventDefault();

                // gathering the form data
                var ajaxData = new FormData($form.get(0));
                if (droppedFiles) {
                    $.each(droppedFiles, function (i, file) {
                        ajaxData.append($input.attr('name'), file);
                    });
                }

                // ajax request
                $.ajax(
                    {
                        url: $form.attr('action'),
                        type: $form.attr('method'),
                        data: ajaxData,
                        dataType: 'json',
                        cache: false,
                        contentType: false,
                        processData: false,
                        complete: function () {
                            $form.removeClass('is-uploading');
                        },
                        success: function (data) {
                            $form.addClass(data.success == true ? 'is-success' : 'is-error');
                            if (!data.success) $errorMsg.text(data.error);
                        },
                        error: function () {
                            $form.removeClass('is-uploading').addClass('is-error');
                            console.log('Error. Please, contact the webmaster!');
                        }
                    });
            }
            // fallback Ajax solution upload for older browsers
            else {
                var iframeName = 'uploadiframe' + new Date().getTime(),
                    $iframe = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

                $('body').append($iframe);
                $form.attr('target', iframeName);

                $iframe.one('load', function () {
                    var data = $.parseJSON($iframe.contents().find('body').text());
                    $form.removeClass('is-uploading').addClass(data.success == true ? 'is-success' : 'is-error').removeAttr('target');
                    if (!data.success) $errorMsg.text(data.error);
                    $iframe.remove();
                });
            }
        });


    });
})(jQuery, window, document);