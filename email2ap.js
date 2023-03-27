const crypto = require('crypto');

async function email2webfinger(email) {

    const hash = crypto.createHash('md5');
    hash.update(email.toLowerCase());
    const md5 = hash.digest('hex');

    let res = await fetch(`https://www.gravatar.com/${md5}.json`)
    if (res.status !== 200) throw new Error(`${res.status} ${res.statusText}`)

    let doc = await res.json()
    if (!doc) throw new Error("No JSON document")
    if (typeof doc !== "object") throw new Error(doc)

    let entries = doc.entry
    if (!entries) throw new Error("No entry array in profile doc")
    if (entries.length === 0) throw new Error("No entries in entry array in profile doc")

    let accounts = entries[0].accounts
    if (!accounts) throw new Error("No accounts in profile doc")

    let mastodon = accounts.find(acc => acc.shortname === 'mastodon')
    if (!mastodon) throw new Error("No mastodon account in profile doc")

    return mastodon.url
}

if (process.argv.length < 3) {
    console.error(`USAGE: email2webfinger.js <email>`)
} else {
    email2webfinger(process.argv[2])
    .then((webfinger) => {
        console.log(webfinger)
    })
    .catch((err) => {
        console.error(err)
    })
}