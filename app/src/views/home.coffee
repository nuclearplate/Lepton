
View = Backbone.View.extend({

	template: require '../../html/views/home.jade'
	
	render: ->
		@$el.html @template()
		@$('.server-input').val window.lepton.state.server
		return @

	serialize: ->
		lepton.state.connector.name = @$('.server-input').val()

})

module.exports = View;
