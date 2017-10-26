'use strict';

module.exports = (pluginContext) => {
  const shell = pluginContext.shell;
  const logger = pluginContext.logger;
  const exec = require('child_process').exec;

  const registry_key = "HKEY_CURRENT_USER\\Software\\SimonTatham\\PuTTY\\Sessions";
  var stored_sessions = [];

  function loadPuttySessions() {
    logger.log('loading Putty sessions...')

    exec("reg query " + registry_key, (error, stdout, stderr) => {
      
      if (error) {
        logger.log("putty reg error: " + stderr);
        return;
      }

      stored_sessions = [];

      stdout.split("\r\n").forEach((item) => {

        if (item.trim().length === 0) return;

        let session_name = decodeURI(item.slice(registry_key.length + 1));

        if (session_name == "Default Settings") return;

        stored_sessions.push(session_name);
      });

      stored_sessions.sort();

      logger.log("putty sessions: " + stored_sessions);
    });

  }

  function startup() {
    loadPuttySessions();
  }

  function search(query, res) {
    let found_matches = 0;
    let has_query = false;

    let filter_call = (item) => { return true; };

    // search query
    if (!(!query || query.trim().length === 0)) {
      query = query.trim();
      has_query = true;

      filter_call = (item) => {
        let found = item.toLowerCase().startsWith(query.toLowerCase()) ? true : false;
        if (found) found_matches++;
        return found;
      }
    }

    stored_sessions.forEach((item) => {
      if (filter_call(item)) {
        res.add({
          id: 'session',
          title: item,
          payload: item,
          desc: 'open PuTTY session \"' + item + '\"',
          icon: '#fa fa-chevron-right'
        });
      }
    });

    // add "putty call"
    res.add({
      id: 'q',
      title: has_query ? 'putty.exe ' + query  : query,
      payload: query,
      desc: 'Run PuTTY command',
      icon: '#fa fa-search'
    });

    // other commands
    res.add({
      id: 'reload',
      title: 'reload',
      desc: 'reload putty sessions',
      icon: '#fa fa-refresh'
    });

  }

  function execute(id, payload) {
    
    logger.log("id: " + id, "payload: " + payload);

    switch (id) {
      case 'q':
        if (payload.trim().length > 0) {
          exec('START putty ' + payload);
        }
      break;

      case 'session':
        exec('START putty -load \"' + payload + '\"');
      break;

      case 'reload':
        loadPuttySessions();
      break;
    }
  }

  return { startup, search, execute };
};
