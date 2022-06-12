const cli_progress = require('cli-progress');
const multi_bar = new cli_progress.MultiBar({format: "[{bar}] {percentage}% | {value}/{total}"}, cli_progress.Presets.shades_grey);

module.exports = {
    multi_bar: multi_bar
};