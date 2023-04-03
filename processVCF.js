const fs = require('fs');
const vCardParser = require('vcard-parser');
const {email2webfinger} = require('./email2webfinger.cjs');

async function processVCF(filename) {
    const data = await fs.promises.readFile(filename, 'utf8');
    const vCards = vCardParser.parse(data)
    const addresses = vCards.email.map(rec => rec.value )
    const webfingerURLs = await Promise.all(
        addresses
            .map(async address => {
                try {
                    const webfingerURL = await email2webfinger(address);
                    return webfingerURL;
                } catch (error) {
                    return null;
                }
            })
    );

    return webfingerURLs
        .filter(url => url !== null)
        .filter((value, index, self) => {
            return self.indexOf(value) === index;
        })
}

if (process.argv.length < 3) {
    console.error(`USAGE: processVCF.js <path/to/contacts.vcf>`)
} else {
    processVCF(process.argv[2])
    .then((urls) => {
        urls.forEach((url) => {
            console.log(url)
        })
    })
    .catch((err) => {
        console.error(err)
    })
}