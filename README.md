The tool watches HTML document basing on given CSS selector. 

This may be used for running some code not only on elements which exist at the moment, but for newly added ones as well.

The library uses just pure Javascript without any dependencies
and is compatible with all modern browsers including Internet Explorer 11.

*[Читать на русском](README-RU.md)*


## Examples

1. Make all links on the page turn red, including ones added in the future:

```javascript
new Freedom.SelectorWatcher().attach( {
    selector: 'a',
    callback: function ( element ) {
        element.style.color = 'red';
    }
} );
```

(`Freedom` is a web framework featuring this library, hence the namespace's name.)

2. Also add a `click` event handler for links: 
   
```javascript
new Freedom.SelectorWatcher().attach( {
    selector: 'a',
    callback: function() {/*...*/},
    handlersByType: {
        click: function ( event ) {
            alert( this.href );
            event.preventDefault();
            event.stopPropagation();
        }
    }
} );
```

3. Turn watcher off:

```javascript
var watcher = new Freedom.SelectorWatcher().attach( {/*...*/} );
watcher.detach();
```


## Notes

Event handlers are attached to the `<body>` with only single instance created for each one 
(similar to [`jQuery.on()`](https://api.jquery.com/on/)). They have to be listed explicitly by event type to make it possible to remove them.
