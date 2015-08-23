define.amd = false

ipc = require 'ipc'
flatfile = require 'flat-file-db'
{EventEmitter} = require 'events'

window.jQuery = require 'jquery'
window.$ = jQuery
window.jui = require 'jquery-ui'

window.Backbone = require 'backbone'
window.Backbone.$ = jQuery

window.jade = require 'jade'

window.CodeMirror = require 'codemirror'
window.CSMirror = require '../../node_modules/codemirror/mode/coffeescript/coffeescript.js'
window.CSMirror = require '../../node_modules/codemirror/addon/search/search.js'
window.CSMirror = require '../../node_modules/codemirror/addon/search/searchcursor.js'
window.CSMirror = require '../../node_modules/codemirror/addon/dialog/dialog.js'

require "../vendor/jquery-jsonview/jquery.jsonview.js";
require "../vendor/fileinput/fileinput.js";

jadequire = require 'jadequire'
jadequire()

Router = require './router'

db = flatfile.sync 'db.json'

defaultState = {}

messenger = new EventEmitter
messenger.on 'new', -> ipc.send 'new'
ipc.on 'open', (path) -> messenger.emit 'open', path
ipc.on 'save', -> messenger.emit 'save'
ipc.on 'newFile', (path) -> messenger.emit 'newFile', path
ipc.on 'createFile', (path) -> messenger.emit 'createFile', path
ipc.on 'reset', -> db.put 'state', defaultState

state = db.get 'state'

updateDb = ->
  lepton.router.serialize(false).then ->
    db.put 'state', lepton.state

    if lepton.state?.file?.path
      db.put "storage:#{lepton.state.file.path}", lepton.state

loadState = (path) ->
  lepton.state = db.get "storage:#{path}"
  unless lepton.state?
    lepton.state = defaultState
    lepton.state.file.path = path

window.lepton =
  db: db
  state: state || defaultState
  router: new Router(messenger)
  updateDb: updateDb
  messenger: messenger
  loadState: loadState
  updateInterval: setInterval(updateDb, 1000)

unless lepton.state.connector.settings
  lepton.state.connector.settings = {}
unless lepton.state.connector.controls
  lepton.state.connector.controls = {}
  
Backbone.history.start()
