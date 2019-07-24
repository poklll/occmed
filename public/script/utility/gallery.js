"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Gallery =
/*#__PURE__*/
function () {
  function Gallery() {
    _classCallCheck(this, Gallery);

    _defineProperty(this, "element", void 0);

    this.create();
  }

  _createClass(Gallery, [{
    key: "create",
    value: function create() {
      var element = document.createElement('div');
      $(element).addClass('gallery');
      this.element = element;
      return this.element;
    }
  }, {
    key: "add",
    value: function add(path) {
      var image = document.createElement('img');
      $(image).addClass('img-w');
      $(image).attr('src', path);
      $(image).appendTo(this.element);
      $(image).wrap("<div class='img-c'></div>");
      var imgSrc = path;
      $(image).parent().css('background-image', 'url(' + imgSrc + ')');
      var imgc = $(image).parent();
      var del = $('<button id="del_image" class="btn btn-danger del-gl"></button>').appendTo(imgc);
      $(del).css('width', '20%');
      $(del).html('<i class="fa fa-trash" aria-hidden="true"></i>');
      $(del).click(function () {
        $(imgc).remove();
        alert(path);
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", path);

        xhr.onload = function () {
          alert('image was removed');
        };

        xhr.send();
      });
      this.refresh();
      return this.element;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var gal = this.element;
      $(this.element).find(".img-c").click(function () {
        var w = $(this).outerWidth();
        var h = $(this).outerHeight();
        var x = $(this).offset().left;
        var y = $(this).offset().top;
        $(gal).find(".img-w").css("object-fit", "contain");
        $(".active").not($(this)).remove();
        var copy = $(this).clone();
        copy.insertAfter($(this)).height(h).width(w).delay(500).addClass("active");
        $(".active").css('top', y - 8);
        $(".active").css('left', x - 8);
        $(copy).css('display', 'flex');
        setTimeout(function () {
          copy.addClass("positioned");
        }, 0);
      });
      $(document).on("click", ".img-c.active", function () {
        var copy = $(this);
        copy.removeClass("positioned active").addClass("postactive");
        $(gal).find(".img-w").css("object-fit", "cover");
        setTimeout(function () {
          copy.remove();
        }, 500);
      });
    }
  }]);

  return Gallery;
}();