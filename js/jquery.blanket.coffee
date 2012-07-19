$ = jQuery
class jQueryPlugIn
  @defaultOptions: {}

  constructor: (@element, options) ->
    @initialize options

  initialize: (@options) ->

  @installAsjQueryPlugIn: (pluginName = @name) ->
    pluginClass = @
    $.fn[pluginName] = (options, args...) ->
      options = $.extend pluginClass.defaultOptions, options or {} if $.type(options) is "object"
      return @each () ->
        $this = $(this)
        instance = $this.data pluginName
        if instance?
          if $.type(options) is "string"
            instance[options].apply instance, args
          else if instance.initialize?
            instance.initialize.apply instance, [options].concat args
        else
          plugin = new pluginClass $this, options, args...
          $this.data pluginName, plugin
          $this.addClass pluginName
          $this.bind "destroyed.#{pluginName}", () ->
            $this.removeData pluginName
            $this.removeClass pluginName
            $this.unbind pluginName
            plugin.destructor()
          plugin

###############################################################################

class blanket extends jQueryPlugIn

  @defaultOptions:
    openOnInit    : false
    closeElement  : '[rel="close"]'

  constructor: (@element, options) ->
    super @element, options

    @options = options

    # cache body
    @body = $('body')

    @_wireCloseLinks()

    # auto-open if option is specified
    @open() if options.openOnInit

  open: =>
    @_attach @element
    @_disableParentScroll()

  close: =>
    @_remove()
    @_enableParentScroll()

  ## private

  _wireCloseLinks: ->
    @element.find(@options.closeElement).on 'click', @close

  _disableParentScroll: ->
    @body.addClass 'noscroll'

  _enableParentScroll: ->
    @body.removeClass 'noscroll'

  _createWrap: (element) ->
    $('<div/>', {
      "data-js": 'snuggly-blanket'
      class: 'blanket-wrap'
      html: element
    })

  _createContent: (element) ->
    $('<div/>', {
      class: 'blanket-content'
      html: element
    })

  _attach: (element) ->
    @content = @_createContent element
    @wrap = @_createWrap @content
    $('body').append @veil
    $('body').append @wrap

  _remove: (element) ->
    @wrap.remove()

###############################################################################
# install plugin

blanket.installAsjQueryPlugIn()
