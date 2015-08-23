
View = Backbone.View.extend({

  template: require '../../html/views/loading_spinner.jade'
  
  render: ->
    @$el.html @template()
    return @

})

module.exports = View;
