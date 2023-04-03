
const {email2webfinger} = require('./email2webfinger.cjs');

if (process.argv.length < 3) {
    console.error(`USAGE: email2ap.js <email>`)
} else {
    email2webfinger(process.argv[2])
    .then((webfinger) => {
        console.log(webfinger)
    })
    .catch((err) => {
        console.error(err)
    })
}