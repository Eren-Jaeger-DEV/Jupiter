const colors = require('colors');

module.exports = {
    print: (name) => {
        console.clear();
        console.log(`\n${'   [ MOON STABILIZED: '.bold.bgBlue.white}${name.toUpperCase().bold}${ ' ]   '.bold.bgBlue.white}\n`);
    }
};
