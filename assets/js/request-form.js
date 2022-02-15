(function() {
	function bytesToSize(bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes === 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}

	var isAdvancedUpload = function() {
		var div = document.createElement('div');
		return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	}();
	var fileUploader     = function(obj) {
		if (obj.hasOwnProperty('fileUploader'))
			return false;
		var _this = obj;

		obj.fileUploader = this;

		var $form        = $(_this),
				$input       = $form.find('input[type="file"]'),
				$errorMsg    = $form.find('.js-lk-uploader-error'),
				droppedFiles = false;

		_this.progressBar  = $form.find('.lk-uploader__progress__bar');
		_this.progressText = $form.find('.lk-uploader__progress__text');
		_this.sizeText     = $form.find('.lk-uploader__progress__size');
		_this.deleteBtn    = $form.find('.js-lk-uploader-delete-btn');
		_this.shareBtn     = $form.find('.js-lk-uploader-share-btn');
		_this.shareInput   = $form.find('.js-lk-uploader-share-input');
		_this.actionInput  = $form.find('input[name=upload_action]');

		_this.setSize = function(bytes) {
			_this.sizeText.html(bytesToSize(bytes));
		};

		_this.setProgress = function(percent, animated) {
			if (_this.progressText.length > 0)
				_this.progressText.html(percent + '%');

			if (_this.progressBar.length > 0) {
				var timing = animated == true ? 250 : 0;
				_this.progressBar.stop(true).animate({'width': percent + '%'}, timing);
			}
		};

		_this.shareBtn.on('click', function(e) {
			e.preventDefault();
			$form.toggleClass('is-opened');
		});
		_this.deleteBtn.on('click', function(e) {
			_this.actionInput.val('delete');
			$form.submit();
			e.preventDefault();
		});
		$input.on('change', function(e) {
			droppedFiles = this.files;
			_this.actionInput.val('upload');
			$form.trigger('submit');
		});

		// drag&drop files if the feature is available
		if (isAdvancedUpload) {
			$form
					.addClass('has-advanced-upload')
					.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
						e.preventDefault();
						e.stopPropagation();
					})
					.on('dragover dragenter', function() {
						$form.addClass('is-dragover');
					})
					.on('dragleave dragend drop', function() {
						$form.removeClass('is-dragover');
					})
					.on('drop', function(e) {
						droppedFiles = e.originalEvent.dataTransfer.files;
						_this.actionInput.val('upload');
						$form.trigger('submit');
					});
		}
		$form.on('submit', function(e) {

			if ($form.hasClass('is-uploading')) return false;

			$form.addClass('is-uploading').removeClass('is-error');

			if (isAdvancedUpload) {
				e.preventDefault();

				var ajaxData = new FormData();
				$form.find("input[type=hidden]").each(function() {
					ajaxData.append(this.name, this.value);
				});
				var fullSize = 0;
				if (droppedFiles) {
					$.each(droppedFiles, function(i, file) {
						ajaxData.append($input.attr('name'), file);
						fullSize += file.size;
					});
				}
				_this.setProgress(0, false);
				_this.setSize(fullSize);
				$.ajax(
						{
							url:         $form.data('bp-uploader-action'),
							type:        'post',
							data:        ajaxData,
							dataType:    'json',
							cache:       false,
							contentType: false,
							processData: false,
							complete:    function() {
								$form.removeClass('is-uploading');
							},
							xhr:         function() {
								var xhr = $.ajaxSettings.xhr();
								xhr.upload.addEventListener('progress', function(evt) {
									if (evt.lengthComputable) {
										var percentComplete = Math.ceil(evt.loaded / evt.total * 100);
										_this.setProgress(percentComplete, true);
									}
								}, false);
								return xhr;
							},
							success:     function(data) {
								_this.setProgress(100, false);
								$form.addClass(data.success == true ? 'is-success' : 'is-error');
								if (!data.success) $errorMsg.text(data.error);
								if (data.success == true) {
									if (data.hasOwnProperty('view')) {
										if (data.view == false) {
											$form.remove();
										} else {
											var newForm = $(data.view);
											newForm.each(function() {
												new fileUploader(this);
											});
											$form.replaceWith(newForm);
										}

									}

								}
							},
							error:       function(e) {
								_this.setProgress(0, false);
								$form.removeClass('is-uploading').addClass('is-error');
							}
						});
			} else {
				var iframeName = 'uploadiframe' + new Date().getTime(),
						$iframe    = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

				$('body').append($iframe);
				$form.attr('target', iframeName);

				$iframe.one('load', function() {
					var data = $.parseJSON($iframe.contents().find('body').text());
					$form.removeClass('is-uploading').addClass(data.success == true ? 'is-success' : 'is-error').removeAttr('target');
					if (!data.success) $errorMsg.text(data.error);
					$iframe.remove();
				});
			}
		});
	};

	window.app.requestForm = function(formSelector, params) {
		$(function() {
			var $form          = $(formSelector);
			var $formContainer = $form.find("#request-residency-fields");
			var validError     = [];

			function initEvents() {
				$form.find(".js-datepicker-PERIODMY").each(function() {
					var $this = $(this);
					$this.datepicker({
						range:                  true,
						multipleDates:          true,
						multipleDatesSeparator: " - ",
						dateFormat:             $this.data("dateFormat") || "mm.yyyy",
						view:                   $this.data("dateView") || "months",
						minView:                $this.data("dateMinView") || "months"
					});
				});
				$form.find(".js-datepicker-DATEMY").each(function() {
					var $this = $(this);
					$this.datepicker({
						dateFormat: $this.data("dateFormat") || "mm.yyyy",
						view:       $this.data("dateView") || "months",
						minView:    $this.data("dateMinView") || "months"
					});
				});
				$form.find(".js-datepicker-DATEY").each(function() {
					var $this = $(this);
					$this.datepicker({
						dateFormat: $this.data("dateFormat") || "yyyy",
						view:       $this.data("dateView") || "years",
						minView:    $this.data("dateMinView") || "years"
					});
				});
				$form.find(".js-datepicker-DATEDMY").each(function() {
					var $this = $(this);
					$this.datepicker({
						dateFormat: $this.data("dateFormat") || "dd.mm.yyyy"
					});
				});
				$form.find('.js-lk-document-uploader').each(function() {
					new fileUploader(this);
				});
				$form.find("[data-inputmask-regex]").inputmask();
				$form.find(".multiply-table .multiply-table-add").on("click", function() {
					var $button      = $(this);
					var $parentTable = $button.parents(".multiply-table");
					$parentTable.find(".lk-row:last select").chosen("destroy");
					$('.js-scrollbar-custom').scrollbar("destroy");
					var $lastRow = $parentTable.children(".lk-row:last").clone();
					var name     = $lastRow.prop("name");
					//$lastRow.find("label").remove();
					$lastRow.find("input, textarea").val("");
					$lastRow.find("select option:selected").prop("selected", false);
					$lastRow.find("select option:disabled").prop("selected", true);
					$lastRow.find("select").chosen("destroy");
					$button.before($lastRow);

					func.jsUI();
					$("select").trigger("chosen:updated");

					$lastRow.find(".js-datepicker-PERIODMY").each(function() {
						var $this = $(this);
						$this.datepicker({
							range:                  true,
							multipleDates:          true,
							multipleDatesSeparator: " - ",
							dateFormat:             $this.data("dateFormat") || "mm.yyyy",
							view:                   $this.data("dateView") || "months",
							minView:                $this.data("dateMinView") || "months"
						});
					});
					$lastRow.find(".js-datepicker-DATEMY").each(function() {
						var $this = $(this);
						$this.datepicker({
							dateFormat: $this.data("dateFormat") || "mm.yyyy",
							view:       $this.data("dateView") || "months",
							minView:    $this.data("dateMinView") || "months"
						});
					});
					$lastRow.find(".js-datepicker-DATEY").each(function() {
						var $this = $(this);
						$this.datepicker({
							dateFormat: $this.data("dateFormat") || "yyyy",
							view:       $this.data("dateView") || "years",
							minView:    $this.data("dateMinView") || "years"
						});
					});
					$lastRow.find(".js-datepicker-DATEDMY").each(function() {
						var $this = $(this);
						$this.datepicker({
							dateFormat: $this.data("dateFormat") || "dd.mm.yyyy"
						});
					});

				});
			}

			function initSelects() {
				$.each(params.selectValues, function(selectName, selectOptions) {
					var $select    = $("select[data-entity='" + selectName + "']");
					var optionHtml = "<option></option>";
					$.each(selectOptions, function(key, val) {
						optionHtml += "<option value='" + key + "'>" + val + "</option>";
					});
					$select.html(optionHtml);
					$select.find("option:selected").prop("selected", false);
					$select.trigger("chosen:updated");
				});
				if (!!params.selectValuesActive) {
					$.each(params.selectValuesActive, function(selectName, values) {
						var $select = $("select[name='" + selectName + "']");
						$select.each(function(key, obj) {
							var val   = values[key];
							var $self = $(this);
							if (Array.isArray(val)) {
								$.each(val, function() {
									$self.find("option[value='" + this + "']").prop("selected", true);
								});
							} else {
								$self.find("option[value='" + val + "']").prop("selected", true);
							}
						});
						$select.trigger("chosen:updated");
					});
				}
				$("select").trigger("chosen:updated");
			}

			function validField($field) {
				var valid    = true;
				var type     = $field.prop("type");
				var tag      = $field.prop("tagName");
				var required = $field.prop("required");
				var value    = $field.val();

				switch (tag) {
					case "INPUT":
					case "TEXTAREA":
						switch (type) {
							case "text":
							case "textarea":
								if (!value && required) {
									validError.push({field: $field, error: "Заполните обязательное поле"});
									valid = false;
								}
								var pattern = $field.prop("pattern");
								if (!!pattern && !!value) {
									var re = new RegExp(pattern);
									if (!re.test(value)) {

										validError.push({field: $field, error: "Заполните в соответствии с шаблоном"});
										valid = false;
									}
								}
								break;
							case "radio":
								var name = $field.prop("name");
								value    = $("[name=" + name + "]:checked").val();
								if (!value && required) {
									validError.push({field: $field, error: "Заполните обязательное поле"});
									valid = false;
								}
								break;
							case "checkbox":

								if (!value && required) {
									validError.push({field: $field, error: "Заполните обязательное поле"});
									valid = false;
								}

								break;
						}
						break;
					case "SELECT":
						switch (type) {
							case "select-multiple":
							case "select-one":
								if (!value && required) {
									validError.push({field: $field, error: "Заполните обязательное поле"});
									valid = false;
								}

								break;
						}
						break;
				}
				$field.each(function() {
					if (typeof this.validator !== 'undefined' && typeof this.validator === 'function') {
						valid = this.validator($form, $field, validError);
					}
				});

				return valid;
			}

			function validForm() {
				var valid  = true;
				validError = [];
				$form.find(":input").each(function() {
					if (!validField($(this)))
						valid = false;
				});
				viewError();
				return (valid);
			}

			function validUpload() {
				var uploadValid = $(".js-lk-document-uploader.lk-uploader_required.is-uploaded").length === $(".js-lk-document-uploader.lk-uploader_required").length;

				if (!uploadValid) {
					alert("Пожалуйста, перед отправкой заявки прикрепите все необходимые документы!");
					return false;
				}
				var data = $form.serializeArray();
				data.push({name: "from", value: "ajax"});
				data.push({name: "action", value: "check_upload_size"});
				$.ajax({
					url:      $form.attr('action'),
					data:     data,
					type:     "POST",
					async:    false,
					dataType: "JSON",
					success:  function(result) {
						if (result['error'] !== null) {
							uploadValid = false;
							alert(result['error']);
						}
					}
				});

				return uploadValid;
			}

			function viewError() {
				if (validError.length) {
					var firstErrorNode = false;
					$.each(validError, function() {
						var $self = this.field;
						$self.closest(".lk-field").addClass("error").hover(function() {
							var tooltipContent = "";
							$.each(validError, function() {
								if ($self === this["field"])
									tooltipContent += this["error"] + "<br>";
							});
							if (tooltipContent) {
								$(this).tooltipster({
									content:           tooltipContent,
									contentAsHTML:     true,
									animationDuration: 150,
									delay:             100,
									theme:             "tooltipster-shadow",
									side:              "bottom"
								}).tooltipster("show");
							}
						});
						if (firstErrorNode === false) {
							firstErrorNode = this.field;
						}
						$('form').on("change", function() {
							$.each(validError, function(key) {
								if ($self === this["field"]) {
									if ($self.parent().hasClass("tooltipstered")) {
										$self.parent().tooltipster("destroy");
									}
									$self.closest(".lk-field").removeClass("error").off("hover");
									delete validError[key];
								}
							});
						});
					});
					$([document.documentElement, document.body]).animate({
						scrollTop: firstErrorNode.parents(".lk-field").offset().top - $(".header_fixed").height() - 70
					}, 1000);
				}
			}

			function submitForm(action) {
				var data = $form.serializeArray();
				data.push({name: "from", value: "ajax"});
				if (action)
					data.push({name: "action", value: action});
				$.ajax({
					url:      $form.attr('action'),
					data:     data,
					type:     "POST",
					async:    false,
					dataType: "JSON",
					success:  function(result) {
						if (result['error'] !== null) {
							alert(result['error']);
						} else {
							if (result['notice'] !== null) {
								alert(result['notice']);
							}
						}
						if (result["status"] && result["newElementLink"])
							window.location = result["newElementLink"];
						$formContainer.html(result.item);
						params.selectValuesActive = result["selectValues"];
						initSelects();
						app.init();
						initEvents();
					}
				});
			}

			function printRequest(id) {
				$.ajax({
					url:      '/api/request/generatedocx',
					data:     {"id": id},
					type:     "POST",
					async:    false,
					dataType: "JSON",
					success:  function(result) {
						if (typeof result.data.link !== 'undefined') {
							window.open(result.data.link);
						}
					}
				});
			}

			if (params["fieldToUpdate"]) {
				$.each(params["fieldToUpdate"], function(key) {
					$(document).on("change", "[name='" + key + "']", function() {
						submitForm();

						return false;
					});
					$(document).on("change", "[name='" + key + "[]']", function() {
						submitForm();

						return false;
					});
				});
			}
			$form.find(".save-request").on("click", function() {
				if ($(this).hasClass("disabled"))
					return false;

				if (validField($form.find("[name='PROJECT_ID']"))) {
					submitForm("save");
				} else {
					viewError();
				}

				return false;
			});
			$form.find(".send-request").on("click", function() {
				if ($(this).hasClass("disabled"))
					return false;
				if (validForm() && validUpload()) {
					submitForm("send");
				}

				return false;
			});
			$form.find(".print-request").on("click", function() {
				if ($(this).hasClass("disabled"))
					return false;

				var id = $("[name='REQUEST_ID']").val();

				if (validForm()) {
					printRequest(id);
				}

				return false;
			});
			$form.find(".pre-save-request").on("click", function() {
				if ($(this).hasClass("disabled"))
					return false;

				if (validForm()) {
					submitForm("save-request");
				}

				return false;
			});
			$form.find("[name='OPF'], [name='ENTITY_TYPE'], [name='PROJECT_ID']").on("change", function() {
				submitForm();
			});

			initEvents();
			initSelects();
			setTimeout(function() {
				initSelects();
			}, 200);
			window.initSelects = initSelects;
			func.jsExtra();
		});
	};
})();
