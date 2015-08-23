
Q = require 'Q'
HomeView = require './views/home'
SomeView = require './views/someView'
LayoutView = require './views/layout'

Router = Backbone.Router.extend({

  routes:
    '': 'home'
    'someView': 'someView'

  initialize: (messenger) ->
    @messenger = messenger
    @views = {}

    @messenger.on 'save', =>
      @serialize()

  showTemplate: (path, context, callback) ->
    layout = new LayoutView
    $('.content-container').html layout.render().el
    
    $('.main-housing').html require(path)()

  showView: (name, View, args=[], callback) ->
    layout = new LayoutView
    $('.content-container').html layout.render().el
    
    @views[name] = new View args...
    $('.main-housing').html @views[name].render().el

    callback?()

  serialize: (shouldEmit=true) ->
    promises = []
    for name, view of @views
      promises.push Q(view.serialize?())
    Q.all(promises).then =>
      if shouldEmit
        @messenger.emit 'serialized'

  home: -> @showView 'home', HomeView
  someView: -> @showView 'someView', SomeView

})

module.exports = Router
