/** @version 1.0.1 */

var Freedom = Freedom || {};

if ( !Element.prototype.matches ) { // for IE 11
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}

/**
 * @constructor
 * @link https://github.com/1234ru/selector-watcher
 */
Freedom.SelectorWatcher = function() {
    this.handlersCache = {};
    this.observer;
}

/**
 * @param settings
 *  @param {string} settings.selector
 *  @param {object} [settings.handlersByType]
 *  @param {function} [settings.callback]
 */
Freedom.SelectorWatcher.prototype.attach = function ( settings ) {
    if ( settings.handlersByType ) {
        for ( var eventType in settings.handlersByType ) {
            this.handlersCache[ eventType ] = this.listenToEvent(
                document.body,
                eventType,
                settings.selector,
                settings.handlersByType[ eventType ]
            );
        }
    }
    if ( settings.callback ) {
        this.observer = this.setObserver(
            settings.selector,
            settings.callback
        );
    }
}

/**
 * jQuery.on() without jQuery.
 * See also https://stackoverflow.com/a/30880807/589600.
 * @param {Element} rootElement
 * @param {string} eventType
 * @param {string} selector
 * @param {function} handler
 * @return {EventListener}
 */
Freedom.SelectorWatcher.prototype.listenToEvent = function (
    rootElement,
    eventType,
    selector,
    handler
) {
    const callback = this.makeDelegatedCallback( selector, handler );
    rootElement.addEventListener( eventType, callback );
    return callback;
}

/**
 * @param {string} selector
 * @param {EventListener|Function} callback
 * @return {EventListener|Function}
 */
Freedom.SelectorWatcher.prototype.makeDelegatedCallback = function(selector, callback ) {
    return function( event ) {
        var element = event.target;
        while ( element && element !== this ) {
            if ( element.matches( selector ) ) {
                callback.call( element, event );
            }
            element = element.parentNode;
        }
    };
}

Freedom.SelectorWatcher.prototype.detach = function () {
    for ( var eventType in this.handlersCache ) {
        this.stopListeningToEvent(
            document.body,
            eventType,
            this.handlersCache[ eventType ]
        );
        delete this.handlersCache[ eventType ];
    }
    if ( this.observer ) {
        this.observer.disconnect();
        this.observer = undefined;
    }
}

/**
 * @param {Element} rootElement
 * @param {string} eventType
 * @param {function} handler
 */
Freedom.SelectorWatcher.prototype.stopListeningToEvent = function (
    rootElement,
    eventType,
    handler
) {
    rootElement.removeEventListener( eventType, handler );
}

/**
 * @private
 * @return MutationObserver
 * */
Freedom.SelectorWatcher.prototype.setObserver = function(
    selector,
    callbackOnElementAddition
) {
    var formatterObject = this;
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    const observer = new MutationObserver( function ( mutationList, observer) {
        const matchingElements = formatterObject.catchNewMatchingElements(
            mutationList,
            selector
        );
        for ( var j = 0; j < matchingElements.length; j++ ) {
            callbackOnElementAddition( matchingElements[ j ] );
        }
    } );
    observer.observe( document.body, { childList: true, subtree: true } );
    return observer;
}

/** @private */
Freedom.SelectorWatcher.prototype.catchNewMatchingElements = function(mutationsList, selector ) {
    var mutation, node;
    var matchingElements = [];
    for ( var i = 0; i < mutationsList.length; i++ ) {
        mutation = mutationsList[ i ];
        for ( var j = 0; j < mutation.addedNodes.length; j++ ) {
            node = mutation.addedNodes[ j ];
            matchingElements = matchingElements.concat(
                this.findMatchingElements( node, selector )
            );
        }
    }
    return matchingElements;
}

/**
 * @private
 * @param {HTMLElement} element
 * @param {string} selector
 */
Freedom.SelectorWatcher.prototype.findMatchingElements = function( element, selector ) {
    var matchingElements = [];
    if ( element.nodeType !== Node.ELEMENT_NODE ) {
        return matchingElements;
    }
    if ( element.matches( selector ) ) {
        matchingElements.push( element );
    }
    var i, child;
    for ( i = 0; i < element.childNodes.length; i++ ) {
        child = element.childNodes[ i ];
        matchingElements = matchingElements.concat(
            this.findMatchingElements( child, selector )
        );
    }
    return matchingElements;
}