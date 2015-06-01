/**
 * jQuery fillColor Plugin
 * Author: bashkos
 *
 * Based on https://github.com/krustnic/site-preview-yandex-style
 * by Mityakov Aleksandr (krustnic)
 *
 * License: MIT
 *
 * https://github.com/bashkos/jquery.fillcolor
 *
 * Version: 1.0.0
 */

(function ($) {
    'use strict';

    var getColor = {
            avg: function (imageData) {
                var rgb = {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    count = 0;

                for (var i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i] !== 255 || imageData.data[i + 1] !== 255 || imageData.data[i + 2] !== 255) {
                        rgb.r += imageData.data[i];
                        rgb.g += imageData.data[i + 1];
                        rgb.b += imageData.data[i + 2];

                        count++;
                    }
                }

                rgb.r = Math.round(rgb.r / count);
                rgb.g = Math.round(rgb.g / count);
                rgb.b = Math.round(rgb.b / count);

                return rgb;
            },

            avgYUV: function (imageData) {
                var rgb = {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    yuv = {
                        y: 0,
                        u: 0,
                        v: 0
                    },
                    count = 0,

                    sigma = function (x) {
                        return x / (Math.abs(x) + 0.4);
                    };

                for (var i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i] !== 255 || imageData.data[i + 1] !== 255 || imageData.data[i + 2] !== 255) {
                        rgb.r = imageData.data[i] / 255;
                        rgb.g = imageData.data[i + 1] / 255;
                        rgb.b = imageData.data[i + 2] / 255;

                        yuv.y += 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                        yuv.u += -0.147 * rgb.r - 0.289 * rgb.g + 0.436 * rgb.b;
                        yuv.v += 0.615 * rgb.r - 0.515 * rgb.g - 0.100 * rgb.b;

                        count++;
                    }
                }

                yuv.y = sigma(yuv.y / count);
                yuv.u = sigma(yuv.u / count);
                yuv.v = sigma(yuv.v / count);

                rgb.r = yuv.y + 1.3983 * yuv.v;
                rgb.g = yuv.y - 0.3946 * yuv.u - 0.58060 * yuv.v;
                rgb.b = yuv.y + 2.0321 * yuv.u;

                rgb.r = Math.round(rgb.r * 255);
                rgb.g = Math.round(rgb.g * 255);
                rgb.b = Math.round(rgb.b * 255);

                return rgb;
            }
        };

    $.fn.fillColor = function (options) {
        var settings = $.extend({
                type: 'avg',
                debug: false
            }, options);

        return this.each(function () {
            var $fillRect = $(this),
                $image = $('img', $fillRect).eq(0);

            if ($image.length) {
                var w = $image.width(),
                    h = $image.height(),
                    canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    imageData;

                context.fillStyle = 'rgb(255, 255, 255)';
                context.fillRect(0, 0, w, h);
                context.drawImage($image[0], 0, 0, w, h);

                try {
                    imageData = context.getImageData(0, 0, w, h);
                } catch (e) {
                    // security error, img on diff domain
                    if (settings.debug) {
                        console.log('Cross-domain error');
                    }
                    return;
                }

                var rgb = getColor[settings.type](imageData);

                $fillRect.css('background-color', 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
            }
        });
    };
})(jQuery);
