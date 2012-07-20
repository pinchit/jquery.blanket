// Generated by CoffeeScript 1.3.3
(function() {
  var $, Blanket, jQueryPlugIn,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  jQueryPlugIn = (function() {

    jQueryPlugIn.defaultOptions = {};

    function jQueryPlugIn(element, options) {
      this.element = element;
      this.initialize(options);
    }

    jQueryPlugIn.prototype.initialize = function(options) {
      this.options = options;
    };

    jQueryPlugIn.installAsjQueryPlugIn = function(pluginName) {
      var pluginClass;
      if (pluginName == null) {
        pluginName = this.name;
      }
      pluginClass = this;
      return $.fn[pluginName] = function() {
        var args, options;
        options = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if ($.type(options) === "object") {
          options = $.extend(pluginClass.defaultOptions, options || {});
        }
        return this.each(function() {
          var $this, instance, plugin;
          $this = $(this);
          instance = $this.data(pluginName);
          if (instance != null) {
            if ($.type(options) === "string") {
              return instance[options].apply(instance, args);
            } else if (instance.initialize != null) {
              return instance.initialize.apply(instance, [options].concat(args));
            }
          } else {
            plugin = (function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args), t = typeof result;
              return t == "object" || t == "function" ? result || child : child;
            })(pluginClass, [$this, options].concat(__slice.call(args)), function(){});
            $this.data(pluginName, plugin);
            $this.addClass(pluginName);
            $this.bind("destroyed." + pluginName, function() {
              $this.removeData(pluginName);
              $this.removeClass(pluginName);
              $this.unbind(pluginName);
              return plugin.destructor();
            });
            return plugin;
          }
        });
      };
    };

    return jQueryPlugIn;

  })();

  Blanket = (function(_super) {

    __extends(Blanket, _super);

    Blanket.defaultOptions = {
      openOnInit: false,
      closeElement: '[rel="close"]'
    };

    function Blanket(element, options) {
      this.element = element;
      this.close = __bind(this.close, this);

      this.open = __bind(this.open, this);

      Blanket.__super__.constructor.call(this, this.element, options);
      this.options = options;
      this.body = $('body');
      this.content = this._createContent(this.element);
      this.wrap = this._createWrap(this.content);
      this._wireCloseLinks();
      if (options.openOnInit) {
        this.open();
      }
    }

    Blanket.prototype.open = function() {
      this._attach(this.element);
      return this._disableParentScroll();
    };

    Blanket.prototype.close = function() {
      this._remove();
      return this._enableParentScroll();
    };

    Blanket.prototype._wireCloseLinks = function() {
      var _this = this;
      this.element.find(this.options.closeElement).on('click', this.close);
      return this.wrap.on('click', function(e) {
        if (e.target !== _this.wrap[0]) {
          return;
        }
        return _this.close();
      });
    };

    Blanket.prototype._disableParentScroll = function() {
      return this.body.addClass('noscroll');
    };

    Blanket.prototype._enableParentScroll = function() {
      return this.body.removeClass('noscroll');
    };

    Blanket.prototype._createWrap = function(element) {
      return $('<div/>', {
        "data-js": 'snuggly-blanket',
        "class": 'blanket-wrap',
        html: element
      });
    };

    Blanket.prototype._createContent = function(element) {
      return $('<div/>', {
        "class": 'blanket-content',
        html: element
      });
    };

    Blanket.prototype._attach = function(element) {
      return $('body').append(this.wrap);
    };

    Blanket.prototype._remove = function(element) {
      return this.wrap.remove();
    };

    return Blanket;

  })(jQueryPlugIn);

  Blanket.installAsjQueryPlugIn();

}).call(this);
