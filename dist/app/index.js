(function () {
'use strict';

var h = function (tag, data) {
  var arguments$1 = arguments;

  var node;
  var canConcat;
  var oldCanConcat;

  var stack = [];
  var children = [];

  for (var i = arguments.length; i-- > 2;) {
    stack.push(arguments$1[i]);
  }

  while (stack.length) {
    if (Array.isArray(node = stack.pop())) {
      i = node.length;

      while (i--) {
        stack.push(node[i]);
      }
    } else if (node != null && node !== true && node !== false) {
      i = children.length;

      if (typeof node === "number") {
        node = node + "";
      }

      canConcat = typeof node === "string";

      if (canConcat && oldCanConcat) {
        children[i - 1] += node;
      } else {
        children[i] = node;
        oldCanConcat = canConcat;
      }
    }
  }

  return typeof tag === "string"
    ? {
      tag: tag,
      data: data || {},
      children: children
    }
    : tag(data, children)
};

var app = function (app) {
  var state = {};
  var view = app.view;
  var actions = {};
  var events = {};
  var node;
  var element;

  for (var i = -1, plugins = app.plugins || []; i < plugins.length; i++) {
    var plugin = plugins[i] ? plugins[i](app) : app;

    if (plugin.state != null) {
      state = merge(state, plugin.state);
    }

    init(actions, plugin.actions);

    Object.keys(plugin.events || []).map(function (key) {
      events[key] = (events[key] || []).concat(plugin.events[key]);
    });
  }

  if (document.readyState[0] !== "l") {
    load();
  } else {
    addEventListener("DOMContentLoaded", load);
  }

  function init(namespace, children, lastName) {
    Object.keys(children || []).map(function (key) {
      var action = children[key];
      var name = lastName ? lastName + "." + key : key;

      if (typeof action === "function") {
        namespace[key] = function (data) {
          var result = action(state, emit("action", {
            name: name,
            data: data
          }).data, actions, emit);

          if (result == null || typeof result.then === "function") {
            return result
          }

          render(state = merge(state, emit("update", result)), view);
        };
      } else {
        init(namespace[key] || (namespace[key] = {}), action, name);
      }
    });
  }

  function load() {
    render(state, view);
    emit("loaded", emit);
  }

  function emit(name, data) {
    (events[name] || []).map(function (cb) {
      var result = cb(state, actions, data, emit);
      if (result != null) {
        data = result;
      }
    });

    return data
  }

  function render(state, view) {
    element = patch(
      app.root || (app.root = document.body),
      element,
      node,
      node = emit("render", view)(state, actions)
    );
  }

  function merge(a, b) {
    var obj = {};

    if (typeof b !== "object" || Array.isArray(b)) {
      return b
    }

    for (var i in a) {
      obj[i] = a[i];
    }
    for (var i in b) {
      obj[i] = b[i];
    }

    return obj
  }

  function createElementFrom(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node);

    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag);

      for (var i = 0; i < node.children.length;) {
        element.appendChild(createElementFrom(node.children[i++], isSVG));
      }

      for (var name in node.data) {
        if (name === "onCreate") {
          node.data[name](element);
        } else {
          setElementData(element, name, node.data[name]);
        }
      }
    }

    return element
  }

  function setElementData(element, name, value, oldValue) {
    if (name === "key") {
    } else if ((name = name.toLowerCase()) === "style") {
      for (var i in merge(oldValue, value = value || {})) {
        element.style[i] = value[i] || "";
      }
    } else {
      try {
        element[name] = value;
      } catch (_) {
      }

      if (typeof value !== "function") {
        if (value) {
          element.setAttribute(name, value);
        } else {
          element.removeAttribute(name);
        }
      }
    }
  }

  function updateElementData(element, oldData, data) {
    for (var name in merge(oldData, data)) {
      var value = data[name];
      var oldValue = oldData[name];

      if (name === "onUpdate") {
        value(element);

      } else if (value !== oldValue || value !== element[name]) {
        setElementData(element, name, value, oldValue);
      }
    }
  }

  function getKeyFrom(node) {
    if (node && (node = node.data)) {
      return node.key
    }
  }

  function removeElement(parent, element, node) {
    if (node.data.onRemove) {
      node.data.onRemove(element);
    }
    parent.removeChild(element);
  }

  function patch(parent, element, oldNode, node) {
    if (oldNode == null) {
      element = parent.insertBefore(createElementFrom(node), element);

    } else if (node.tag && node.tag === oldNode.tag) {
      updateElementData(element, oldNode.data, node.data);

      var len = node.children.length;
      var oldLen = oldNode.children.length;
      var reusableChildren = {};
      var oldElements = [];
      var newKeys = {};

      for (var i = 0; i < oldLen; i++) {
        var oldElement = element.childNodes[i];
        oldElements[i] = oldElement;

        var oldChild = oldNode.children[i];
        var oldKey = getKeyFrom(oldChild);

        if (null != oldKey) {
          reusableChildren[oldKey] = [oldElement, oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < len) {
        var oldElement = oldElements[i];
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKeyFrom(oldChild);
        if (newKeys[oldKey]) {
          i++;
          continue
        }

        var newKey = getKeyFrom(newChild);

        var reusableChild = reusableChildren[newKey];
        var reusableElement = 0;
        var reusableNode = 0;

        if (reusableChild) {
          reusableElement = reusableChild[0];
          reusableNode = reusableChild[1];
        }

        if (null == oldKey && null == newKey) {
          patch(element, oldElement, oldChild, newChild);
          j++;
          i++;

        } else if (null == oldKey && null != newKey) {
          if (reusableElement) {
            element.insertBefore(reusableElement, oldElement);
            patch(element, reusableElement, reusableNode, newChild);
          } else {
            patch(element, oldElement, null, newChild);
          }

          j++;
          newKeys[newKey] = newChild;

        } else if (null != oldKey && null == newKey) {
          i++;

        } else {
          if (oldKey === newKey) {
            patch(element, reusableElement, reusableNode, newChild);
            i++;

          } else if (reusableElement) {
            element.insertBefore(reusableElement, oldElement);
            patch(element, reusableElement, reusableNode, newChild);

          } else {
            patch(element, oldElement, null, newChild);
          }

          j++;
          newKeys[newKey] = newChild;
        }
      }

      while (i < oldLen) {
        var oldChild = oldNode.children[i];
        var oldKey = getKeyFrom(oldChild);
        if (null == oldKey) {
          removeElement(element, oldElements[i], oldChild);
        }
        i++;
      }

      for (var i in reusableChildren) {
        var reusableChild = reusableChildren[i];
        var reusableNode = reusableChild[1];
        if (!newKeys[reusableNode.data.key]) {
          removeElement(element, reusableChild[0], reusableNode);
        }
      }
    } else if (node !== oldNode) {
      var i = element;
      parent.replaceChild(element = createElementFrom(node), i);
    }

    return element
  }
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var papaparse = createCommonjsModule(function (module) {
/*!
	Papa Parse
	v4.2.0
	https://github.com/mholt/PapaParse
*/
(function(root, factory)
{
	if (typeof undefined === 'function' && undefined.amd)
	{
		// AMD. Register as an anonymous module.
		undefined([], factory);
	}
	else if ('object' === 'object' && module.exports)
	{
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
	else
	{
		// Browser globals (root is window)
		root.Papa = factory();
	}
}(commonjsGlobal, function()
{
	'use strict';

	var global = (function () {
		// alternative method, similar to `Function('return this')()`
		// but without using `eval` (which is disabled when
		// using Content Security Policy).

		if (typeof self !== 'undefined') { return self; }
		if (typeof window !== 'undefined') { return window; }
		if (typeof global !== 'undefined') { return global; }

        // When running tests none of the above have been defined
        return {};
	})();


	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;
	Papa.ReadableStreamStreamer = ReadableStreamStreamer;

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var this$1 = this;

				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					{ return true; }	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this$1.files[i],
						inputElem: this$1,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						{ options.complete(); }
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							{ f.instanceConfig = $.extend(f.instanceConfig, returned.config); }
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						{ userCompleteFunc(results, f.file, f.inputElem); }
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					{ options.error({name: name}, file, elem, reason); }
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		};
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function () {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		_config.dynamicTyping = _config.dynamicTyping || false;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (typeof _input === 'string')
		{
			if (_config.download)
				{ streamer = new NetworkStreamer(_config); }
			else
				{ streamer = new StringStreamer(_config); }
		}
		else if (_input.readable === true && typeof _input.read === 'function' && typeof _input.on === 'function')
		{
			streamer = new ReadableStreamStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			{ streamer = new FileStreamer(_config); }

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		var _output = '';
		var _fields = [];

		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		unpackConfig();

		var quoteCharRegex = new RegExp(_quoteChar, 'g');

		if (typeof _input === 'string')
			{ _input = JSON.parse(_input); }

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				{ return serialize(null, _input); }
			else if (typeof _input[0] === 'object')
				{ return serialize(objectKeys(_input[0]), _input); }
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				{ _input.data = JSON.parse(_input.data); }

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					{ _input.fields =  _input.meta && _input.meta.fields; }

				if (!_input.fields)
					{ _input.fields =  _input.data[0] instanceof Array
									? _input.fields
									: objectKeys(_input.data[0]); }

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					{ _input.data = [_input.data]; }	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw 'exception: Unable to serialize unrecognized input';


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				{ return; }

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length === 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				{ _quotes = _config.quotes; }

			if (typeof _config.newline === 'string')
				{ _newline = _config.newline; }

			if (typeof _config.quoteChar === 'string')
				{ _quoteChar = _config.quoteChar; }

			if (typeof _config.header === 'boolean')
				{ _writeHeader = _config.header; }
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				{ return []; }
			var keys = [];
			for (var key in obj)
				{ keys.push(key); }
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = '';

			if (typeof fields === 'string')
				{ fields = JSON.parse(fields); }
			if (typeof data === 'string')
				{ data = JSON.parse(data); }

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						{ csv += _delimiter; }
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					{ csv += _newline; }
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						{ csv += _delimiter; }
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					{ csv += _newline; }
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				{ return ''; }

			str = str.toString().replace(quoteCharRegex, _quoteChar+_quoteChar);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? _quoteChar + str + _quoteChar : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				{ if (str.indexOf(substrings[i]) > -1)
					{ return true; } }
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._paused = false;
		this._finished = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					{ chunk = modifiedChunk; }
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted())
				{ return; }

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				{ this._rowCount += results.data.length; }

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk))
			{
				this._config.chunk(results, this._handle);
				if (this._paused)
					{ return; }
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
				{ this._config.complete(this._completeResults, this._input); }

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				{ this._nextChunk(); }

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				{ this._config.error(error); }
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				{ configCopy.chunkSize = null; }  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			{ config.chunkSize = Papa.RemoteChunkSize; }
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open('GET', this._input, !IS_WORKER);

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes='+this._start+'-'+end);
				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				{ this._chunkError(); }
			else
				{ this._start += this._config.chunkSize; }
		};

		this._chunkLoaded = function()
		{
			if (xhr.readyState != 4)
				{ return; }

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		};

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(errorText);
		};

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
        			return -1;
            		}
			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			{ config.chunkSize = Papa.LocalChunkSize; }
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				{ reader = new FileReaderSync(); }	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				{ this._readChunk(); }
		};

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				{ this._chunkLoaded({ target: { result: txt } }); }	// mimic the async signature
		};

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		};

		this._chunkError = function()
		{
			this._sendError(reader.error);
		};

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var string;
		var remaining;
		this.stream = function(s)
		{
			string = s;
			remaining = s;
			return this._nextChunk();
		};
		this._nextChunk = function()
		{
			if (this._finished) { return; }
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		};
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;


	function ReadableStreamStreamer(config)
	{
		config = config || {};

		ChunkStreamer.call(this, config);

		var queue = [];
		var parseOnData = true;

		this.stream = function(stream)
		{
			this._input = stream;

			this._input.on('data', this._streamData);
			this._input.on('end', this._streamEnd);
			this._input.on('error', this._streamError);
		};

		this._nextChunk = function()
		{
			if (queue.length)
			{
				this.parseChunk(queue.shift());
			}
			else
			{
				parseOnData = true;
			}
		};

		this._streamData = bindFunction(function(chunk)
		{
			try
			{
				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

				if (parseOnData)
				{
					parseOnData = false;
					this.parseChunk(queue.shift());
				}
			}
			catch (error)
			{
				this._streamError(error);
			}
		}, this);

		this._streamError = bindFunction(function(error)
		{
			this._streamCleanUp();
			this._sendError(error.message);
		}, this);

		this._streamEnd = bindFunction(function()
		{
			this._streamCleanUp();
			this._finished = true;
			this._streamData('');
		}, this);

		this._streamCleanUp = bindFunction(function()
		{
			this._input.removeListener('data', this._streamData);
			this._input.removeListener('end', this._streamEnd);
			this._input.removeListener('error', this._streamError);
		}, this);
	}
	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;   // Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					{ processResults(); }
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						{ return; }

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						{ _parser.abort(); }
					else
						{ userStep(_results, self); }
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				{ _config.newline = guessLineEndings(input); }

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline);
				if (delimGuess.successful)
					{ _config.delimiter = delimGuess.bestDelimiter; }
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(typeof _config.delimiter === 'function')
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				{ parserConfig.preview++; }	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input);
		};

		this.aborted = function ()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				{ _config.complete(_results); }
			_input = '';
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \''+Papa.DefaultDelimiter+'\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					{ if (_results.data[i].length === 1 && _results.data[i][0] === '')
						{ _results.data.splice(i--, 1); } }
			}

			if (needsHeaderRow())
				{ fillHeaderFields(); }

			return applyHeaderAndDynamicTyping();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				{ return; }
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				{ for (var j = 0; j < _results.data[i].length; j++)
					{ _fields.push(_results.data[i][j]); } }
			_results.data.splice(0, 1);
		}

		function parseDynamic(field, value)
		{
			if ((_config.dynamicTyping[field] || _config.dynamicTyping) === true)
			{
				if (value === 'true' || value === 'TRUE')
					{ return true; }
				else if (value === 'false' || value === 'FALSE')
					{ return false; }
				else
					{ return tryParseFloat(value); }
			}
			return value;
		}

		function applyHeaderAndDynamicTyping()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping))
				{ return _results; }

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = _config.header ? {} : [];

				for (var j = 0; j < _results.data[i].length; j++)
				{
					var field = j;
					var value = _results.data[i][j];

					if (_config.header)
						{ field = j >= _fields.length ? '__parsed_extra' : _fields[j]; }

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						{ row[field] = value; }
				}

				_results.data[i] = row;

				if (_config.header)
				{
					if (j > _fields.length)
						{ addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, i); }
					else if (j < _fields.length)
						{ addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, i); }
				}
			}

			if (_config.header && _results.meta)
				{ _results.meta.fields = _fields; }
			return _results;
		}

		function guessDelimiter(input, newline)
		{
			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					{ avgFieldCount /= preview.data.length; }

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			}
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024*1024);	// max length 1 MB

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				{ return '\n'; }

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					{ numWithN++; }
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function tryParseFloat(val)
		{
			var isNumber = FLOAT.test(val);
			return isNumber ? parseFloat(val) : val;
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		var quoteChar = config.quoteChar || '"';

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			{ delim = ','; }

		// Comment character must be valid
		if (comments === delim)
			{ throw 'Comment character same as delimiter'; }
		else if (comments === true)
			{ comments = '#'; }
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			{ comments = false; }

		// Newline must be valid: \r, \n, or \r\n
		if (newline != '\n' && newline != '\r' && newline != '\r\n')
			{ newline = '\n'; }

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				{ throw 'Input must be a string'; }

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = typeof step === 'function';

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				{ return returnable(); }

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						{ cursor += newline.length; }
					else if (ignoreLastRow)
						{ return returnable(); }
					if (comments && row.substr(0, commentsLen) === comments)
						{ continue; }
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							{ return returnable(); }
					}
					else
						{ pushRow(row.split(delim)); }
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(quoteChar+quoteChar, 'g');

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					var quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						var quoteSearch = input.indexOf(quoteChar, quoteSearch+1);

						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						if (quoteSearch === inputLen-1)
						{
							// Closing quote at EOF
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						if (input[quoteSearch+1] === quoteChar)
						{
							quoteSearch++;
							continue;
						}

						if (input[quoteSearch+1] === delim)
						{
							// Closing quote followed by delimiter
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						if (input.substr(quoteSearch+1, newlineLen) === newline)
						{
							// Closing quote followed by newline
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									{ return returnable(); }
							}

							if (preview && data.length >= preview)
								{ return returnable(true); }

							break;
						}
					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						{ return returnable(); }
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							{ return returnable(); }
					}

					if (preview && data.length >= preview)
						{ return returnable(true); }

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					{ return returnable(); }
				if (typeof value === 'undefined')
					{ value = input.substr(cursor); }
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					{ doStep(); }
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [], errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			{ return false; }
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			{ throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			); }
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			{ worker.userError(msg.error, msg.file); }
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						{ break; }
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			{ completeWorker(msg.workerId, msg.results); }
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			{ worker.userComplete(results); }
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw 'Not implemented.';
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			{ Papa.WORKER_ID = msg.workerId; }

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				{ global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				}); }
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object')
			{ return obj; }
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			{ cpy[key] = copy(obj[key]); }
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));
});

var parseCSV = function (state, e, actions) {
  var file = e.target.files[0];
  papaparse.parse(file, {
    header: true,
    worker: true,
    step: function (results) { return actions.updateRows({results: results}); }
  });
};

var actions = {
  parse: function (state, e, actions) { return parseCSV(state, e, actions); },
  updateRows: function (state, ref) {
      var results = ref.results;

      return state.rows.push(results.data);
}
};

var events = {
  update: function (state) { return state; }
};

var state = {
  rows: []
};

/* eslint-disable no-unused-vars */

// Author: Marcus Asplund
// Copyright (c) 2017 Marcus Asplund, marcus@greatname.se
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// =============================================================================
// ES2015-implementation of
// Javascript-implementation of "Gauss Conformal Projection
// (Transverse Mercator), Krügers Formulas".
// by Arnold Andreasson, info@mellifica.se
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

var defaultParams = {
  axis: null, // Semi-major axis of the ellipsoid.
  flattening: null, // Flattening of the ellipsoid.
  centralMeridian: null, // Central meridian for the projection.
  latOfOrigin: null, // Latitude of origin.
  scale: null, // Scale on central meridian.
  falseNorthing: null, // Offset for origo.
  falseEasting: null // Offset for origo.
};

// Parameters for RT90 and SWEREF99TM.
// Note: Parameters for RT90 are choosen to eliminate the differences between Bessel and
// GRS80-ellipsoides. Bessel-variants should only be used if lat/long are given as RT90-lat/long
// based on the Bessel ellipsoide (from old maps). Parameter: projection (string). Must match
// if-statement.
var grs80Params = {
  axis: 6378137.0, // GRS 80.
  flattening: 1.0 / 298.257222101, // GRS 80.
  centralMeridian: null,
  latOfOrigin: 0.0
};

// Sets of default parameters.
var besselParams = {
  axis: 6377397.155, // Bessel 1841.
  flattening: 1.0 / 299.1528128, // Bessel 1841.
  centralMeridian: null,
  latOfOrigin: 0.0,
  scale: 1.0,
  falseNorthing: 0.0,
  falseEasting: 1500000.0
};

var sweref99Params = {
  axis: 6378137.0, // const 80.
  flattening: 1.0 / 298.257222101, // GRS 80.
  centralMeridian: null,
  latOfOrigin: 0.0,
  scale: 1.0,
  falseNorthing: 0.0,
  falseEasting: 150000.0
};

var rt9075gonV = {
  centralMeridian: 11.0 + 18.375 / 60.0,
  scale: 1.000006000000,
  falseNorthing: -667.282,
  falseEasting: 1500025.141
};

var rt9050gonV = {
  centralMeridian: 13.0 + 33.376 / 60.0,
  scale: 1.000005800000,
  falseNorthing: -667.130,
  falseEasting: 1500044.695
};

var rt9025gonV = {
  centralMeridian: 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0,
  scale: 1.00000561024,
  falseNorthing: -667.711,
  falseEasting: 1500064.274
};

var rt9000gonV = {
  centralMeridian: 18.0 + 3.378 / 60.0,
  scale: 1.000005400000,
  falseNorthing: -668.844,
  falseEasting: 1500083.521
};

var rt9025gonO = {
  centralMeridian: 20.0 + 18.379 / 60.0,
  scale: 1.000005200000,
  falseNorthing: -670.706,
  falseEasting: 1500102.765
};

var rt9050gonO = {
  centralMeridian: 22.0 + 33.380 / 60.0,
  scale: 1.000004900000,
  falseNorthing: -672.557,
  falseEasting: 1500121.846
};

var besselRt9075gonV = {
  centralMeridian: 11.0 + 18.0 / 60.0 + 29.8 / 3600.0
};

var besselRt9050gonV = {
  centralMeridian: 13.0 + 33.0 / 60.0 + 29.8 / 3600.0
};

var besselRt9025gonV = {
  centralMeridian: 15.0 + 48.0 / 60.0 + 29.8 / 3600.0
};

var besselRt9000gonV = {
  centralMeridian: 18.0 + 3.0 / 60.0 + 29.8 / 3600.0
};

var besselRt9025gonO = {
  centralMeridian: 20.0 + 18.0 / 60.0 + 29.8 / 3600.0
};

var besselRt9050gonO = {
  centralMeridian: 22.0 + 33.0 / 60.0 + 29.8 / 3600.0
};

var sweref99tm = {
  centralMeridian: 15.00,
  latOfOrigin: 0.0,
  scale: 0.9996,
  falseNorthing: 0.0,
  falseEasting: 500000.0
};

var sweref991200 = {
  centralMeridian: 12.00
};

var sweref991330 = {
  centralMeridian: 13.50
};

var sweref991500 = {
  centralMeridian: 15.00
};

var sweref991630 = {
  centralMeridian: 16.50
};

var sweref991800 = {
  centralMeridian: 18.00
};

var sweref991415 = {
  centralMeridian: 14.25
};

var sweref991545 = {
  centralMeridian: 15.75
};

var sweref991715 = {
  centralMeridian: 17.25
};

var sweref991845 = {
  centralMeridian: 18.75
};

var sweref992015 = {
  centralMeridian: 20.25
};

var sweref992145 = {
  centralMeridian: 21.75
};

var sweref992315 = {
  centralMeridian: 23.25
};

// Conversion calculation with testCase params should return:
// Lat: 66 0'0", lon: 24 0'0".
// X:1135809.413803 Y:555304.016555.
var testCase = {
  axis: 6378137.0,
  flattening: 1.0 / 298.257222101,
  centralMeridian: 13.0 + 35.0 / 60.0 + 7.692000 / 3600.0,
  latOfOrigin: 0.0,
  scale: 1.000002540000,
  falseNorthing: -6226307.8640,
  falseEasting: 84182.8790
};

var params = {
  rt9075gonV: Object.assign({}, grs80Params, rt9075gonV),
  rt9050gonV: Object.assign({}, grs80Params, rt9050gonV),
  rt9025gonV: Object.assign({}, grs80Params, rt9025gonV),
  rt9000gonV: Object.assign({}, grs80Params, rt9000gonV),
  rt9025gonO: Object.assign({}, grs80Params, rt9025gonO),
  rt9050gonO: Object.assign({}, grs80Params, rt9050gonO),
  besselRt9075gonV: Object.assign({}, besselParams, besselRt9075gonV),
  besselRt9050gonV: Object.assign({}, besselParams, besselRt9050gonV),
  besselRt9025gonV: Object.assign({}, besselParams, besselRt9025gonV),
  besselRt9000gonV: Object.assign({}, besselParams, besselRt9000gonV),
  besselRt9025gonO: Object.assign({}, besselParams, besselRt9025gonO),
  besselRt9050gonO: Object.assign({}, besselParams, besselRt9050gonO),
  sweref99tm: Object.assign({}, sweref99Params, sweref99tm),
  sweref991200: Object.assign({}, sweref99Params, sweref991200),
  sweref991330: Object.assign({}, sweref99Params, sweref991330),
  sweref991500: Object.assign({}, sweref99Params, sweref991500),
  sweref991630: Object.assign({}, sweref99Params, sweref991630),
  sweref991800: Object.assign({}, sweref99Params, sweref991800),
  sweref991415: Object.assign({}, sweref99Params, sweref991415),
  sweref991545: Object.assign({}, sweref99Params, sweref991545),
  sweref991715: Object.assign({}, sweref99Params, sweref991715),
  sweref991845: Object.assign({}, sweref99Params, sweref991845),
  sweref992015: Object.assign({}, sweref99Params, sweref992015),
  sweref992145: Object.assign({}, sweref99Params, sweref992145),
  sweref992315: Object.assign({}, sweref99Params, sweref992315),
  testCase: testCase
};

// example usage: projectionParams('rt9075gonV')
var projectionParams = function (projection) {
  return Object.assign({}, defaultParams, params[projection])
};

/* eslint-disable no-unused-vars */
var StateDisplay = function (ref) {
    var state = ref.state;

    return h( 'pre', null,
    h( 'code', null,
      JSON.stringify(projectionParams('testCase'), null, 2),
      JSON.stringify(state, null, 2)
    )
  );
};

/* eslint-disable no-unused-vars */
var UploadView = function (ref) {
    var state = ref.state;
    var actions = ref.actions;

    return h( 'div', { class: 'container' },
    h( 'label', { for: 'files', class: 'button file-label' }, "upload .csv ", h( 'input', {
      onChange: function (e) { return actions.parse(e); }, accept: '.csv', class: 'hidden', id: 'files', type: 'file' })
    ),

    h( StateDisplay, { state: state })
  );
};

/* eslint-disable no-unused-vars */
var view = function (state, actions) { return h( UploadView, { actions: actions, state: state }); };

app({
  actions: actions,
  events: events,
  state: state,
  view: view
});

}());

//# sourceMappingURL=index.js.map