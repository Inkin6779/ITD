define(["incTower/core", 'lib/lodash'], function (incTower, _) {
    'use strict';
    var tooltips = {};
    tooltips.hoverOffTimeFunc = _.debounce(function () {
        if (tooltips.activeTooltip.style.display === 'block') {
            tooltips.activeTooltip.style.display = 'none';
        }
    }, 200);
    tooltips.describedElement = undefined; // Current element having a tooltip displayed on it
    tooltips.init = function () {
        tooltips.activeTooltip = document.createElement('div');
        tooltips.activeTooltip.className = 'active-tooltip';
        tooltips.activeTooltip.style.display = 'none';
        tooltips.activeTooltip.style.position = 'absolute';

        document.body.appendChild(tooltips.activeTooltip);
        document.addEventListener('mouseover', _.debounce(function (e) {
            //console.log(e);
            var element = e.target;
            while (true) {
                if (element === null) { break; }
                if (element === tooltips.activeTooltip) {
                    tooltips.hoverOffTimeFunc.cancel();
                    break;
                }
                if (element.className.indexOf('tooltip') > -1) {
                    tooltips.describedElement = element;
                    tooltips.hoverOffTimeFunc.cancel();
                    tooltips.activeTooltip.innerHTML = element.getAttribute('data-tooltip');
                    if (tooltips.activeTooltip.style.display !== 'block') {
                        tooltips.activeTooltip.style.display = 'block';
                    }
                    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                    var left = Math.min(e.pageX + 7, w - 280);
                    left = Math.max(left, 0);
                    var tooltipHeight = getComputedStyle(tooltips.activeTooltip).height;
                    tooltipHeight = parseInt(tooltipHeight.replace('px',''));
                    console.log(tooltipHeight);
                    var top = Math.min(e.pageY + 7, h - tooltipHeight);
                    top = Math.max(top, 0);

                    tooltips.activeTooltip.style.top = top + 'px';
                    tooltips.activeTooltip.style.left = left + 'px';
                    break;
                }
                element = element.parentElement;
            }
        }, 25), false);
        document.addEventListener('mouseout', function (e) {
            var element = e.target;
            while (true) {
                if (element === null) { break; }
                if (element === tooltips.activeTooltip) {
                    tooltips.hoverOffTimeFunc();
                    break;
                }
                if (element.className.indexOf('tooltip') > -1) {
                    tooltips.hoverOffTimeFunc();
                    break;
                }
                element = element.parentElement;
            }

        });
    };
    incTower.checkTooltips = function () {
        _.delay(function () {
            if (tooltips.activeTooltip.style.display !== 'block') {
                return;
            }
            if (tooltips.describedElement.offsetParent === null) {
                tooltips.activeTooltip.style.display = 'none';
                tooltips.describedElement = undefined;
            } else {
                tooltips.activeTooltip.innerHTML = tooltips.describedElement.getAttribute('data-tooltip');
            }
        }, 50);
    };
    tooltips.checkTooltips = incTower.checkTooltips;
    return tooltips;

});
