module.exports = function(ctx, text, opts) {

	// Default options
	if (!opts) { opts = {}; };
	if (!opts.font) { opts.font = "sans-serif"; };
	if (typeof opts.stroke == "undefined") { opts.stroke = false; };
	if (typeof opts.verbose == "undefined") { opts.verbose = false; };
	if (!opts.rect) {
		opts.rect = {
			x: 0,
			y: 0,
			width: ctx.canvas.width,
			height: ctx.canvas.height,
		};
	};
	if (!opts.lineHeight) { opts.lineHeight = 1.1; };
	if (!opts.minFontSize) { opts.minFontSize = 30; };
	if (!opts.maxFontSize) { opts.maxFontSize = 100; };
	// Default log function is console.log - Note: if verbose il false, nothing will be logged anyway
	if (!opts.logFunction) {
		opts.logFunction = function(message) {
			console.log(message);
		};
	};


	const words = require("words-array")(text);
	if (opts.verbose) opts.logFunction("Text contains " + words.length + " words");
	let lines = [];
	let usedFontSize;
	// Finds max font size  which can be used to print whole text in opts.rec
	for (let fontSize = opts.minFontSize; fontSize <= opts.maxFontSize; fontSize++) {
		// Line height
		const lineHeight = fontSize * opts.lineHeight;

		// Set font for testing with measureText()
		ctx.font = " " + fontSize + "px " + opts.font;

		// Makes sure no words are longer than the maxWidth
		for(let wordIndex = 0; wordIndex < words.length; wordIndex++) {
			if (ctx.measureText(words[wordIndex]).width > opts.rect.width) {
				const word = words[wordIndex];
				for(let i = 0; i < word.length; i++) {
					if (ctx.measureText(word.substring(0, i)).width > opts.rect.width) {
						words.splice(wordIndex, 1, word.substring(0, i) + "-", word.substring(i));
						break;
					}
				}
			}
		}

		// Start
		const x = opts.rect.x;
		let y = opts.rect.y + fontSize;
		lines = [];
		let line = "";

		// Cycles on words
		for (const word of words) {
			// checking if the line + word is less than the max width
			lines.push({ text: line + word, x: x, y: y });
			line = "";
			y += lineHeight;
			// "Print" (save) last line
			lines.push({ text: line, x: x, y: y });

			// If bottom of rect is reached then breaks "fontSize" cycle
			if (y > opts.rect.height) {
				usedFontSize = fontSize;
				break;
			}
		}

		if (opts.verbose) opts.logFunction("Font used: " + ctx.font);

		// Print lines
		for (const curLine of lines) {
		// Fill or stroke
			if (opts.stroke) { ctx.strokeText(curLine.text.trim(), curLine.x, curLine.y); }
			else { ctx.fillText(curLine.text.trim(), curLine.x, curLine.y); }
		};
		// Returns font size
		return usedFontSize;

	}
};