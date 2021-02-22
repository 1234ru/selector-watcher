С помощью данной библиотеки можно установить слежение за элементами HTML-документа по указанному CSS-селектору.

Это удобно, когда какие-то операции нужно выполнить не только для элементов, уже присутствующих на странице, но и для добавленных в будущем.

Библиотека написана на чистом Javascript без каких-либо внешних зависимостей.

*[Read in English](README.md)*


## Примеры

1. Сделать красными все ссылки на странице, в том числе добавленные в будущем:

```javascript
new Freedom.SelectorWatcher().attach( {
    selector: 'a',
    callback: function ( element ) {
        element.style.color = 'red';
    }
} );
```

(`Freedom` - веб-фреймворк, в рамках которого ведется разработка, отсюда и название пространства имён.)

2. Также назначить ссылкам обработчик события `click`:

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

3. Отключить слежение:

```javascript
var watcher = new Freedom.SelectorWatcher().attach( {/*...*/} );
watcher.detach();
```


## Примечания

Обработчики назначаются элементу `<body>`, каждый в единственном экземпляре (аналогично [`jQuery.on()`](https://api.jquery.com/on/)). Явное их перечисление с указанием типа события необходимо для возможности отключения.
