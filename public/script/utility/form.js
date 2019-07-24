
"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Element =
/*#__PURE__*/
function () {
  function Element(name, type, value) {
    _classCallCheck(this, Element);

    _defineProperty(this, "drafted", void 0);

    _defineProperty(this, "rendered", void 0);

    _defineProperty(this, "choices", void 0);

    this.name = name;
    this.type = type;
    this.value = value;

    if (!this.value) {
      this.value = [];
    }
  }

  _createClass(Element, [{
    key: "draft",
    value: function draft() {
      var type = this.type;
      var element;
      var template = document.createElement('div');
      $(template).addClass('form-group component_item').html("<label for=\"\" class=\"mb-1\"></label>\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" onclick=\"removeItem(this)\"><span aria-hidden=\"true\">&times;</span></button>\n        <input type=\"text\" id=\"component_name\" class=\"form-control component_name\" placeholder=\"Enter field name\"></input>");

      if (type == "Long text") {
        element = "<textarea  name=\"\" class=\"form-control textarea-autosize\" rows=\"1\"></textarea>";
        $(element).appendTo(template);
        addTabsupport();
        autosize($('.textarea-autosize'));
      } else if (type == "Choices") {
        element = "<div class=\"choice_container\"></div>";
        $(element).appendTo(template);
        this.drafted = template;

        if (!this.choices) {
          this.addChoice("");
        }
      } else if (type == "Images") {
        var gallery = new Gallery();
        $(gallery.element).appendTo(template);
        var add = $('<button id="add_image" class="btn btn-dark"></button>').appendTo(template);
        var fileinput = $('<input type="file" accept="image/*" multiple></input>').appendTo(template).css("display", "none");
        $(add).css('width', '70%');
        $(add).html(' <i class="fa fa-upload" aria-hidden="true"></i>');
        $(add).click(function () {
          fileinput.click();
        });
        $(fileinput).change(function () {
          var files = $(fileinput).prop("files");
          var formData = new FormData();
          $.map(files, function (file) {
            formData.append('file', file);
          });
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/upload");

          xhr.onload = function () {
            var files = JSON.parse(xhr.responseText).files;
            files.forEach(function (file) {
              gallery.add(file.path);
            });
          };

          xhr.send(formData);
        });
      } else {
        element = "<input type=\"".concat(type, "\" name=\"\" class=\"form-control\"></input>");
        var input = $(element).appendTo(template);

        if (type == "File") {
          $(template).find('input').change(function () {
            var file = $(input).prop("files")[0];
            var formData = new FormData();
            formData.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/upload");

            xhr.onload = function () {
              var imgpaths = JSON.parse(xhr.responseText).paths;
              imgpaths.forEach(function (imgpath) {
                alert(imgpath + " was uploaded");
              });
            };

            xhr.send(formData);
          });
        }
      }

      this.drafted = template;
      this.draftsetup();
      return template;
    }
  }, {
    key: "render",
    value: function render(name) {
      var temp = $(this.drafted).clone();
      var select = document.createElement('select');
      $(temp).attr("id", name);
      $(temp).addClass("render_item");
      $(temp).removeClass("component_item");
      $(temp).find('label').attr('for', name).text(name);
      $(temp).find('input').attr('name', name);
      $(temp).find('textarea').attr('name', name);
      $(select).attr('name', name).addClass('form-control').appendTo($(temp).find('.choice_container'));
      $(temp).find('.choice').remove();
      $(temp).find('#component_name').remove();
      $(temp).find('.close').remove();
      $(this.drafted).addClass("draft");
      $(this.drafted).attr('data-name', this.name);
      $(this.drafted).attr('data-type', this.type);
      this.rendered = temp;
    }
  }, {
    key: "loadTo",
    value: function loadTo(target) {
      var _this = this;

      this.draftTo(target);
      $(this.drafted).find('#component_name').val(this.name).trigger("change");

      if (this.choices) {
        this.choices.map(function (choice) {
          _this.addChoice(choice);
        });
        $(this.addChoice("")).trigger('change');
        this.addChoice("");
      }
    }
  }, {
    key: "draftTo",
    value: function draftTo(target) {
      this.draft();
      $(this.drafted).appendTo(target);
      $(this.drafted).find("#component_name").focus();
      addTabsupport();
      autosize($('.textarea-autosize'));
    }
  }, {
    key: "draftsetup",
    value: function draftsetup() {
      var el = this;
      $(this.drafted).find('#component_name').keypress(function (e) {
        if (e.which == 13) {
          $(this).css("font-weight", "bold");
          $(this).blur();
          el.name = $(this).val();
          el.render($(this).val());
          $(el.drafted).attr('data-render', $(el.rendered).prop('outerHTML'));
        }
      });
      $(this.drafted).find('#component_name').on('change', function () {
        $(this).css("font-weight", "bold");
        $(this).blur();
        el.name = $(this).val();
        el.render($(this).val());
        $(el.drafted).attr('data-render', $(el.rendered).prop('outerHTML'));
      });
      $(this.drafted).find('#component_name').on('keydown', function () {
        $(this).css("font-weight", "normal");
        unsave();
      });
    }
  }, {
    key: "addChoice",
    value: function addChoice(choice) {
      var _this2 = this;

      var container = $(this.drafted).find(".choice_container");
      var element = "<div class=\"choice\">\n        <i class=\"fa fa-circle\" aria-hidden=\"true\"></i><input type=\"text\"  placeholder=\"add choice\"></input>\n        </div>\n        ";
      var input = $(element).appendTo(container).find('input');
      $(input).focus();
      $(input).on('change', function () {
        var html = $(container).parent().attr('data-render');

        if (html) {
          var temp = document.createElement('div');
          $(html).appendTo(temp);

          if ($(input).val() == "") {
            if ($(input).parent().children().length > 1) {
              removeItem(input);
            }
          } else {
            _this2.addChoice("");
          }

          $(container).find('.choice > input').each(function (index, value) {
            var choice = $(value).val();

            if (choice != "") {
              var option = document.createElement('option');
              $(option).val(choice);
              $(option).text(choice);
              $(temp).find('select').append(option);
              html = $(temp).html();
              $(container).parent().attr('data-render-with-choices', html);
            }
          });
        } else {
          alert("กรุณากรอกชื่อหัวข้อ");
          $(container).parent().find('#component_name').focus();
        }
      });

      if (choice != "") {
        $(input).val(choice);
      }

      return input;
    }
  }, {
    key: "create",
    value: function create() {
      var type = this.type;
      var element;
      var template = document.createElement('div');
      $(template).addClass('form-group render_item').html("<label for=\"".concat(this.name, "\" class=\"mb-1\">").concat(this.name, "</label>"));
      $(template).attr('data-name', this.name);
      $(template).attr('data-type', type);

      if (type == "Long text") {
        element = "<textarea  name=\"".concat(this.name, "\" class=\"form-control textarea-autosize\" rows=\"1\"></textarea>");
        var textarea = $(element).appendTo(template);
        addTabsupport();
        autosize($('.textarea-autosize'));
        $(textarea).val(this.value);
      } else if (type == "Choices") {
        element = "<select name=\"".concat(this.name, "\" class=\"form-control\"></select>");
        var select = $(element).appendTo(template);
        this.choices.map(function (choice) {
          $("<option value=\"".concat(choice, "\">").concat(choice, "</option>")).appendTo(select);
        });
        $(select).val(this.value);
      } else if (type == "Images") {
        var gallery = new Gallery();
        var input = $(gallery.element).appendTo(template);

        if (this.value) {
          this.value.map(function (img) {
            gallery.add(img);
          });
        }

        var el = this;
        var add = $('<button id="add_image" class="btn btn-dark"></button>').appendTo(template);
        var fileinput = $('<input type="file" accept="image/*" multiple></input>').appendTo(template).css("display", "none");
        $(add).css('width', '100%');
        $(add).html(' <i class="fa fa-upload" aria-hidden="true"></i>');
        $(add).click(function () {
          fileinput.click();
        });
        $(fileinput).change(function () {
          var files = $(fileinput).prop("files");
          var formData = new FormData();
          $.map(files, function (file) {
            formData.append('file', file);
          });
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "/upload");

          xhr.onload = function () {
            var imgpaths = JSON.parse(xhr.responseText).files;
            imgpaths.forEach(function (img) {
              gallery.add(img.path);
              el.value.push(img.path);
              $(input).attr('data-value', JSON.stringify({
                value: el.value
              }));
            });
          };

          xhr.send(formData);
        });
      } else {
        element = "<input type=\"".concat(this.type, "\" name=\"").concat(this.name, "\" class=\"form-control\"></input>");
        var input = $(element).appendTo(template);
        var el = this;

        if (type == "File") {
          if (this.value) {
            this.value.map(function (file) {
              $("<a href=\"".concat(file.path, "\">").concat(file.name, "</a>").concat(file.date, "<hr>")).appendTo(template);
            });
          }

          $(template).find('input').change(function () {
            var file = $(input).prop("files")[0];
            var formData = new FormData();
            formData.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/upload");

            xhr.onload = function () {
              var files = JSON.parse(xhr.responseText).files;
              files.forEach(function (file) {
                alert(file.name + " was uploaded");
                $("<a href=\"".concat(file.path, "\">").concat(file.name, "</a><p>").concat(file.date, "</p><hr>")).appendTo(template);
                var val = {
                  name: file.name,
                  path: file.path,
                  date: file.date
                };
                el.value.push(val);
                $(input).attr('data-value', JSON.stringify({
                  value: el.value
                }));
              });
            };

            xhr.send(formData);
          });
        } else {
          $(input).val(this.value);
        }
      }

      return template;
    }
  }, {
    key: "createTo",
    value: function createTo(target) {
      $(this.create()).appendTo(target);
      addTabsupport();
      autosize($('.textarea-autosize'));
    }
  }]);

  return Element;
}();

var Form =
/*#__PURE__*/
function () {
  function Form(name) {
    _classCallCheck(this, Form);

    _defineProperty(this, "components", []);

    this.name = name;
  }

  _createClass(Form, [{
    key: "saveEditor",
    value: function saveEditor(editor) {
      var _this3 = this;

      $(editor).find('.draft').each(function (index, value) {
        var html;
        var choices = $(value).attr("data-render-with-choices");
        var name = $(value).attr("data-name");
        var type = $(value).attr("data-type");
        var choice = [];

        if (choices) {
          html = choices;
        } else {
          html = $(value).attr("data-render");
        }

        var element = $(html).appendTo('#render_container');
        $(element).find('option').each(function (index, value) {
          choice.push($(value).val());
        }); // $(element).remove();

        _this3.components.push({
          name: name,
          type: type,
          choices: choice,
          value: ""
        });
      });
    }
  }, {
    key: "save",
    value: function save(editor) {
      var _this4 = this;

      this.components = [];
      $(editor).find('.render_item').each(function (index, value) {
        var name = $(value).attr("data-name");
        var type = $(value).attr("data-type");
        var tag;
        var choices = [];

        if (type == "Long text") {
          tag = 'textarea';
        } else if (type == "Choices") {
          tag = 'select';
        } else {
          tag = 'input';
        }

        var val;

        if (type == "File") {
          if ($(value).find(tag).attr("data-value")) {
            val = JSON.parse($(value).find(tag).attr("data-value"));
          }
        } else if (type == "Images") {
          if ($(value).find('.gallery').attr("data-value")) {
            val = JSON.parse($(value).find('.gallery').attr("data-value"));
          }
        } else {
          val = $(value).find(tag).val();
        }

        $(value).find('option').each(function (index, value) {
          if (value) {
            choices.push($(value).val());
          }
        });

        _this4.components.push({
          name: name,
          type: type,
          choices: choices,
          value: val
        });
      });
    }
  }, {
    key: "load",
    value: function load(editor) {
      this.components.map(function (element) {
        var component = new Element(element.name, element.type, element.value);

        if (element.choices) {
          component.choices = element.choices;
        }

        component.createTo(editor);
      });
    }
  }, {
    key: "loadEditor",
    value: function loadEditor(editor) {
      this.components.map(function (element) {
        var component = new Element(element.name, element.type);

        if (element.choices) {
          component.choices = element.choices;
        }

        component.loadTo(editor);
      });
    }
  }]);

  return Form;
}();