'use strict';

module.exports = (pluginContext) => {
  const shell = pluginContext.shell;
  const logger = pluginContext.logger;
  const exec = require('child_process').exec;

  function startup() {
    // you can do some preparations here
  }

  function search(query, res) {
    // Will attempt to reference stored sessions at a later date. For now just return input as is
    if (!query || query.trim().length === 0) {
      return;
    }

    return res.add({
      id: query,
      title: query,
      desc: 'SSH to '+ query,
      icon: '#fa fa-chevron-right'
    });
  }

  function execute(id, payload) {
    exec("START putty "+ id);
  }

  return { startup, search, execute };
};
