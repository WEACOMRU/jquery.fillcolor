# jquery.fillcolor
Заливка фона контейнера средним цветом изображения, расположенного в нем.

Основано на https://github.com/krustnic/site-preview-yandex-style за авторством **krustnic**

## Использование
```
$('.j_fillcolor').fillColor();
```

Можно изменить алгоритм расчета среднего цвета с `avg` (по-умолчанию) на `avgYUV`:
```
$('.j_fillcolor').fillColor({ type: 'avgYUV' });
```

## Альтернатива
[npm i get-average-color](https://github.com/bashkos/get-average-color)
