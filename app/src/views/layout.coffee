Layout = Backbone.View.extend({

	template: require '../../html/layout.jade'
	className: 'main-layout'
	
	render: ->
		context =
			title: 'Lepton'
			active: Backbone.history.getFragment() || 'home'
			messages: []
			user:
				profile:
					picture: 'https://avatars2.githubusercontent.com/u/1222872?v=3&s=460'

		console.log "CONTEXT", context

		@$el.html @template(context)
		@$(".current-file-input").fileinput
			showRemove: false
			showUpload: false
			showPreview: false
			previewFileType: 'image'

		@$('.current-file-chooser .btn-primary').text 'Open Connector'
		return @

})

module.exports = Layout;
