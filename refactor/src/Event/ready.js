/**
 * @file ready 事件, 用于处理一些 DOM 的初始化以及注册 resize 事件
 */
define( [
    'z',
    'cameraCtl'
], function( z, cameraCtl ) {
    'use strict';

    $( function () {
        console.log( '>>> Ready' );

        var $fjx = $( '#fjx' );
        var $sandzMap = $( '#sandzMap' );
        var $dtMap = $( '#dtMap' );
        var $mask = $sandzMap.find( '.mask' );

        setCanvasHeight();

        // 判断是否 IE
        z.support.chrome = /chrom(e|ium)/.test( navigator.userAgent.toLowerCase() );

        // canvas 自适应
        window.onresize = setCanvasHeight;

        // 为分界线添加事件
        ( function () {
            var top;
            var handler = function ( $e ) {
                top = $e.pageY - 64;
                $fjx.css( {
                    top: top
                } );
                $dtMap.css( {
                    height: top + 3
                } );

                window.getSelection ?
                        window.getSelection().removeAllRanges() :
                        document.selection.empty();
            };

            window._fjxCallback = handler;

            $fjx.on( 'mousedown', function () {
                $mask.show().on( 'mousemove', handler );
            } )
            $mask.parent().on( 'mouseup', function () {
                $mask.hide().off( 'mousemove', handler );
            } );
        } )();

        var SCALC = 10000;

        function setCanvasHeight() {
            var $ce = $( '.cesium-widget canvas' );
            var $fjx = $( '#fjx' );
            var w = $sandzMap.width(), h = $sandzMap.height();
            var top = +$fjx.css( 'top' ).match( /\d*/ )[ 0 ], scalc = 1;

            // 减少误差
            scalc = h * SCALC / ( $ce.height() );
            top *= scalc;
            top = top / SCALC + 1;

            // canvas 的尺寸变化
            $ce.css( {
                width: w, height: h
            } ).attr( {
                width: w, height: h
            } );

            if ( cameraCtl._curModel !== 'linkage' ) { // 不是卷帘模式
                $dtMap.height( h );
                return;
            }

            $fjx = $( '#fjx' ).css( {
                top: top
            } );

            if ( $fjx.css( 'display' ) !== 'none' ) {
                $dtMap.height( top + 3 );
            }
        }
    } );
} );
