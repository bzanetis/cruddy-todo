const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var id = data;
    var newFilePath = exports.dataDir + '/' + id + '.txt';

    fs.writeFile(newFilePath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        items[id] = text;
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading files');
    } else {
      var data = _.map(files, (text, id) => {
        text = text.split('.')[0];
        return { id: text, text: text };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(err, `No item with id: ${id}`);
    } else {
      callback(null, { id, text: fileData });
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';

  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(err, `No item with id: ${id}`);
    } else {
      fs.writeFile(filePath, text, (err, fileData) => {
        if (err) {
          callback(err, 'Error updating file');
        } else {
          callback(null, { id, text: fileData });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = exports.dataDir + '/' + id + '.txt';

    fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(err, `No item with id: ${id}`);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
