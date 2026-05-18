$(document).ready(function() {
  var copyText = function(text) {
    if (navigator.clipboard && window.isSecureContext) {
      var clipboardWrite = $.Deferred();
      navigator.clipboard.writeText(text).then(
        function() {
          clipboardWrite.resolve();
        },
        function(err) {
          clipboardWrite.reject(err);
        }
      );
      return clipboardWrite.promise();
    }

    var $textarea = $("<textarea>")
      .val(text)
      .attr("readonly", "")
      .css({
        position: "fixed",
        top: "-9999px",
        left: "-9999px"
      })
      .appendTo("body");

    $textarea[0].select();

    try {
      var copied = document.execCommand("copy");
      $textarea.remove();
      return copied ? $.Deferred().resolve().promise() : $.Deferred().reject().promise();
    } catch (err) {
      $textarea.remove();
      return $.Deferred().reject(err).promise();
    }
  };

  var resetCopyButton = function($button, label) {
    window.setTimeout(function() {
      $button.removeClass("is-copied").text(label);
    }, 1600);
  };

  $(".bib-reference, div.highlighter-rouge, figure.highlight").each(function() {
    var $block = $(this);
    var $target = $block.find("pre code").first();
    var label = $block.hasClass("bib-reference") ? "Copy BibTeX" : "Copy";

    if (!$target.length) {
      $target = $block.find("pre").first();
    }

    if (!$target.length || $block.find(".code-copy-button").length) {
      return;
    }

    var $button = $("<button>", {
      "class": "code-copy-button",
      "type": "button",
      "aria-label": label,
      "text": label
    });

    if ($block.hasClass("bib-reference") && $block.find(".bib-reference__header").length) {
      $block.find(".bib-reference__header").first().append($button);
    } else {
      $block.addClass("code-block--copyable").prepend($button);
    }

    $button.on("click", function() {
      var text = $target.text().replace(/\s+$/, "\n");

      copyText(text).done(function() {
        $button.addClass("is-copied").text("Copied");
        resetCopyButton($button, label);
      }).fail(function() {
        $button.text("Copy failed");
        resetCopyButton($button, label);
      });
    });
  });
});
