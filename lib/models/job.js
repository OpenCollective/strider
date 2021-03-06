'use strict';

var mongoose = require('../mongoose-shim');
var Schema = mongoose.Schema;

var TriggerNotSchema = {
  type: {type: String},
  author: {
    id: {type: Schema.ObjectId, ref: 'user'},
    url: String,
    name: String,
    email: String,
    image: String,
    username: String
  },
  message: String,
  timestamp: Date,
  url: String,
  source: {}
  // source looks like:
  // { type: "plugin", plugin: "github" } ||
  // { type: "UI", page: "dashboard" } ||
  // { type: "API", app: "MyApp" }
};

var PhaseNotSchema = {
  duration: Number,
  finished: Date,
  exitCode: Number,
  commands: [{
    started: Date,
    duration: Number,
    command: String,
    comment: Boolean,
    plugin: String,
    out: String,
    err: String,
    merged: String
  }]
};

var JobSchema = new Schema({
  type: {type: String},
  user_id: {type: Schema.ObjectId, ref: 'user'},
  project: {type: String, index: true}, // should always be lower case
  ref: {
    // not every job is on a branch, and want arbitrary stuff here.
    // so we can't specify branch, but we still want an index on it
    // branch: { type: String, index: true, sparse: true }
  },
  trigger: TriggerNotSchema,
  phases: {
    environment: PhaseNotSchema,
    prepare: PhaseNotSchema,
    test: PhaseNotSchema,
    deploy: PhaseNotSchema,
    cleanup: PhaseNotSchema
  },
  // plugins can store any extra data here
  plugin_data: {},
  warnings: [{
    plugin: String,
    title: String,
    description: String,
    severity: {type: String, default: 'major', enum: ['major', 'minor']}
  }],
  std: {
    out: String,
    err: String,
    merged: String
  },
  duration: Number,
  created: {type: Date, index: true},
  queued: Date,
  started: Date,
  finished: {type: Date, index: true},
  archived: {type: Date, index: true},
  test_exitcode: Number,
  deploy_exitcode: Number,
  errored: {type: Boolean, default: false},
  error: {
    message: String,
    stack: String
  },
  runner: {
    id: String,
    data: {}
  }
});

JobSchema.index({archived: 1, project: 1, finished: -1});

module.exports = mongoose.model('Job', JobSchema);
