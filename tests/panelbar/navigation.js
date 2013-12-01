(function() {
    var PanelBar = kendo.ui.PanelBar,
        keys = kendo.keys,
        ul;


    function addItems(count, parent) {
        var panel = ul.data("kendoPanelBar");

        for (var i = 0; i < count; i++) {
            panel.append({
                text: "Item" + i
            }, parent);
        }
    }

    module("PanelBar Navigation", {
        setup: function() {
            kendo.effects.disable();
            ul = $('<ul id="test" />').appendTo(QUnit.fixture);
        },
        teardown: function() {
            if (ul.data("kendoPanelBar")) {
                ul.data("kendoPanelBar").destroy();
            }
            ul.remove();
            kendo.effects.enable();
        }
    });

    test("PanelBar adds tabindex", function() {
        ul.kendoPanelBar();
        equal(ul.attr("tabindex"), 0);
    });

    test("PanelBar selects first item on focus", function() {
        ul.kendoPanelBar();
        addItems(2);

        ul.focus();

        var first = ul.children(":first");
        ok(first.children(":first").hasClass("k-state-focused"));
    });

    test("PanelBar clears focused item on blur", function() {
        ul.kendoPanelBar();
        addItems(2);

        ul.focus();
        ul.blur();

        var first = ul.children(":first");
        ok(!first.children(":first").hasClass("k-state-focused"));
    });

    test("PanelBar selects next item on key DOWN", function() {
        ul.kendoPanelBar();
        addItems(2);

        ul.focus();
        ul.trigger({
            type: "keydown",
            keyCode: keys.DOWN
        });

        ok(ul.children(":last").children(".k-link").hasClass("k-state-focused"));
        ok(!ul.children(":first").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar misses next item if disabled", function() {
        ul.kendoPanelBar();
        addItems(3);

        var panelbar = ul.data("kendoPanelBar");
        panelbar.enable(ul.children().eq(1), false);

        ul.focus();

        ul.trigger({
            type: "keydown",
            keyCode: keys.DOWN
        });

        ok(ul.children(":last").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects first item of group", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        ul.focus();
        ul.data("kendoPanelBar").expand(ul.children(":first"));
        ul.trigger({
            type: "keydown",
            keyCode: keys.DOWN
        });

        ok(ul.children(":first").find("li:first > span.k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects next item if current is last in a group", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));
        panelbar._current(ul.children(":first").find("li:last"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.DOWN
        });

        ok(ul.children(":last").children("span.k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects first if last is selected", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));
        panelbar._current(ul.children(":last"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.DOWN
        });

        ok(ul.children(":first").children("span.k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects first on HOME key", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));
        panelbar._current(ul.children(":last"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.HOME
        });

        ok(ul.children(":first").children("span.k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects last on END key", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.END
        });

        ok(ul.children(":last").children("span.k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects prev item on key UP", function() {
        ul.kendoPanelBar();
        addItems(2);

        ul.focus();
        ul.trigger({
            type: "keydown",
            keyCode: keys.DOWN
        });

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ok(ul.children(":first").children(".k-link").hasClass("k-state-focused"));
        ok(!ul.children(":last").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects prev parent item", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));
        panelbar._current(ul.children(":first").find("li:first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ok(ul.children(":first").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects selects last if no prev", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));
        panelbar._current(ul.children(":first").find("li:first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ok(ul.children(":last").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar selects prev nested and visible item", function() {
        ul.kendoPanelBar();
        addItems(2);
        addItems(2, ul.children(":first"));
        addItems(2, ul.children(":first").children(".k-group").children(":last"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":first"));
        panelbar.expand(ul.children(":first").children(".k-group").children(":last"));
        panelbar._current(ul.children(":last"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ok(ul.children(":first")
             .children(".k-group").children(":last")
             .children(".k-group").children(":last")
             .children("span.k-link")
             .hasClass("k-state-focused"));
    });

    test("PanelBar misses prev item if disabled", function() {
        ul.kendoPanelBar();
        addItems(3);

        var panelbar = ul.data("kendoPanelBar");
        panelbar.enable(ul.children().eq(1), false);

        ul.focus();
        panelbar._current(ul.children(":last"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ok(ul.children(":first").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar moves focus to last element in the last expanded group", function() {
        ul.kendoPanelBar();
        addItems(3);
        addItems(2, ul.children(":last"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar.expand(ul.children(":last"));
        panelbar._current(ul.children(":first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.UP
        });

        ok(ul.children(":last").children(".k-group").children(":last").children(".k-link").hasClass("k-state-focused"));
    });

    test("PanelBar expands current focused item on Enter", function() {
        ul.kendoPanelBar();
        addItems(3);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar._current(ul.children(":first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.ENTER
        });

        ok(ul.children(":first").children(".k-group:visible")[0]);
    });

    test("PanelBar selects item on Enter", function() {
        ul.kendoPanelBar();
        addItems(3);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar._current(ul.children(":first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.ENTER
        });

        ok(ul.children(":first").children(".k-link").hasClass("k-state-selected"));
    });

    test("PanelBar collapses expanded group", function() {
        ul.kendoPanelBar();
        addItems(3);
        addItems(2, ul.children(":first"));

        var panelbar = ul.data("kendoPanelBar");

        ul.focus();
        panelbar._current(ul.children(":first"));

        ul.trigger({
            type: "keydown",
            keyCode: keys.ENTER
        });

        ul.trigger({
            type: "keydown",
            keyCode: keys.ENTER
        });

        ok(!ul.children(":first").children(".k-group").is(":visible"));
    });

    /*
    test("PanelBar makes clicked element focused", function() {
        ul.kendoPanelBar();
        addItems(3);

        var panelbar = ul.data("kendoPanelBar"),
            item = ul.children().eq(1);

        ul.focus();
        panelbar._click(item.find(".k-link"));
        equal(panelbar._focused[0], item[0]);
    });

    test("PanelBar prevents default action even ", function() {
        var panelbarHtml = $('<ul class="k-widget k-panelbar k-reset" id="panelbar"><li class="k-item"><a class="k-link k-header" href="#panelbar-1">My Teammates<span class="k-icon k-i-arrow-n k-panelbar-collapse"></span></a><div class="k-content" id="panelbar-1"><p>Teamead</p></div></li><li class="k-item"><a class="k-link k-header" href="#panelbar-2">My Teammates2<span class="k-icon k-i-arrow-n k-panelbar-collapse"></span></a><div class="k-content" id="panelbar-2"><p>Teamead2</p></div></li></ul>').appendTo(QUnit.fixture);
        panelbarHtml.kendoPanelBar().focus();

        var panelbar = panelbarHtml.data("kendoPanelBar"),
            item = panelbarHtml.find(".k-item").last();

        item.find(".k-content").data("animating", true);

        equal(panelbar._click(item.children(".k-link")), true);

        panelbarHtml.remove();
    });
    */
})();
