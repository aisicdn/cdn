// Easy Responsive Tabs Plugin
(function($) {
	$.fn.extend({
		easyResponsiveTabs: function(options) {
			var defaults = {
				type: 'default',
				width: 'auto',
				fit: true,
				closed: false,
				tabidentify: '',
				activetab_bg: '',
				inactive_bg: '',
				active_border_color: '',
				active_content_border_color: '',
				activate: function() {}
			}
			var options = $.extend(defaults, options);
			var opt = options,
				jtype = opt.type,
				jfit = opt.fit,
				jwidth = opt.width,
				vtabs = 'vertical',
				accord = 'accordion';
			var hash = window.location.hash;
			var historyApi = !! (window.history && history.replaceState);
			$(this).bind('tabactivate', function(e, currentTab) {
				if (typeof options.activate === 'function') {
					options.activate.call(currentTab, e)
				}
			});
			this.each(function() {
				var $respTabs = $(this);
				var $respTabsList = $respTabs.find('ul.resp-tabs-list.' + options.tabidentify);
				var respTabsId = $respTabs.attr('id');
				$respTabs.find('ul.resp-tabs-list.' + options.tabidentify + ' li').addClass('resp-tab-item').addClass(options.tabidentify);
				$respTabs.css({
					'display': 'block',
					'width': jwidth
				});
				if (options.type == 'vertical') $respTabsList.css('margin-top', '0px');
				$respTabs.find('.resp-tabs-container.' + options.tabidentify).css('border-color', options.active_content_border_color);
				$respTabs.find('.resp-tabs-container.' + options.tabidentify + ' > div').addClass('resp-tab-content').addClass(options.tabidentify);
				jtab_options();

				function jtab_options() {
					if (jtype == vtabs) {
						$respTabs.addClass('resp-vtabs').addClass(options.tabidentify)
					}
					if (jfit == true) {
						$respTabs.css({
							width: '100%',
							margin: '0px'
						})
					}
					if (jtype == accord) {
						$respTabs.addClass('resp-easy-accordion').addClass(options.tabidentify);
						$respTabs.find('.resp-tabs-list').css('display', 'none')
					}
				}
				var $tabItemh2;
				$respTabs.find('.resp-tab-content.' + options.tabidentify).before("<h2 class='resp-accordion " + options.tabidentify + "' role='tab'><span class='resp-arrow'></span></h2>");
				$respTabs.find('.resp-tab-content.' + options.tabidentify).prev("h2").css({
					'background-color': options.inactive_bg,
					'border-color': options.active_border_color
				});
				var itemCount = 0;
				$respTabs.find('.resp-accordion').each(function() {
					$tabItemh2 = $(this);
					var $tabItem = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')');
					var $accItem = $respTabs.find('.resp-accordion:eq(' + itemCount + ')');
					$accItem.append($tabItem.html());
					$accItem.data($tabItem.data());
					$tabItemh2.attr('aria-controls', options.tabidentify + '_tab_item-' + (itemCount));
					itemCount++
				});
				var count = 0,
					$tabContent;
				$respTabs.find('.resp-tab-item').each(function() {
					$tabItem = $(this);
					$tabItem.attr('aria-controls', options.tabidentify + '_tab_item-' + (count));
					$tabItem.attr('role', 'tab');
					$tabItem.css({
						'background-color': options.inactive_bg,
						'border-color': 'none'
					});
					var tabcount = 0;
					$respTabs.find('.resp-tab-content.' + options.tabidentify).each(function() {
						$tabContent = $(this);
						$tabContent.attr('aria-labelledby', options.tabidentify + '_tab_item-' + (tabcount)).css({
							'border-color': options.active_border_color
						});
						tabcount++
					});
					count++
				});
				var tabNum = 0;
				if (hash != '') {
					var matches = hash.match(new RegExp(respTabsId + "([0-9]+)"));
					if (matches !== null && matches.length === 2) {
						tabNum = parseInt(matches[1], 10) - 1;
						if (tabNum > count) {
							tabNum = 0
						}
					}
				}
				$($respTabs.find('.resp-tab-item.' + options.tabidentify)[tabNum]).addClass('resp-tab-active').css({
					'background-color': options.activetab_bg,
					'border-color': options.active_border_color
				});
				if (options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {
					$($respTabs.find('.resp-accordion.' + options.tabidentify)[tabNum]).addClass('resp-tab-active').css({
						'background-color': options.activetab_bg + ' !important',
						'border-color': options.active_border_color,
						'background': 'none'
					});
					$($respTabs.find('.resp-tab-content.' + options.tabidentify)[tabNum]).addClass('resp-tab-content-active').addClass(options.tabidentify).attr('style', 'display:block')
				} else {}
				$respTabs.find("[role=tab]").each(function() {
					var $currentTab = $(this);
					$currentTab.click(function() {
						var $currentTab = $(this);
						var $tabAria = $currentTab.attr('aria-controls');
						if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
							$respTabs.find('.resp-tab-content-active.' + options.tabidentify).slideUp('', function() {
								$(this).addClass('resp-accordion-closed')
							});
							$currentTab.removeClass('resp-tab-active').css({
								'background-color': options.inactive_bg,
								'border-color': 'none'
							});
							return false
						}
						if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
							$respTabs.find('.resp-tab-active.' + options.tabidentify).removeClass('resp-tab-active').css({
								'background-color': options.inactive_bg,
								'border-color': 'none'
							});
							$respTabs.find('.resp-tab-content-active.' + options.tabidentify).slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
							$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active').css({
								'background-color': options.activetab_bg,
								'border-color': options.active_border_color
							});
							$respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + '].' + options.tabidentify).slideDown().addClass('resp-tab-content-active')
						} else {
							console.log('here');
							$respTabs.find('.resp-tab-active.' + options.tabidentify).removeClass('resp-tab-active').css({
								'background-color': options.inactive_bg,
								'border-color': 'none'
							});
							$respTabs.find('.resp-tab-content-active.' + options.tabidentify).removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');
							$respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active').css({
								'background-color': options.activetab_bg,
								'border-color': options.active_border_color
							});
							$respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + '].' + options.tabidentify).addClass('resp-tab-content-active').attr('style', 'display:block')
						}
						$currentTab.trigger('tabactivate', $currentTab);
						if (historyApi) {
							var currentHash = window.location.hash;
							var tabAriaParts = $tabAria.split('tab_item-');
							var newHash = respTabsId + (parseInt(tabAriaParts[1], 10) + 1).toString();
							if (currentHash != "") {
								var re = new RegExp(respTabsId + "[0-9]+");
								if (currentHash.match(re) != null) {
									newHash = currentHash.replace(re, newHash)
								} else {
									newHash = currentHash + "|" + newHash
								}
							} else {
								newHash = '#' + newHash
							}
							history.replaceState(null, null, newHash)
						}
					})
				});
				$(window).resize(function() {
					$respTabs.find('.resp-accordion-closed').removeAttr('style')
				})
			})
		}
	})
})(jQuery);