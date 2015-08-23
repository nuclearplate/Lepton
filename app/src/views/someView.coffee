
View = Backbone.View.extend({

  template: require '../../html/views/someView.jade'
  
  render: ->
    @$el.html @template()
    return @

})

module.exports = View;
