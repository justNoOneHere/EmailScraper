const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {

    let i = 0;

  let baseUrl = await new Promise(resolve => {
    rl.question('Enter the base URL: ', (url) => {
      resolve(url);
      rl.close();
    });
  });

  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    console.error('Error: Please enter a valid URL');
    return;
  }

  let urls = [];
  let done = false;
  let url = baseUrl;

  const getEmailsFromUrl = async (url) => {
    try {
      const html = await request(url);
      const $ = cheerio.load(html);
      const emailElements = $('a[href^="mailto:"]');

      const emails = emailElements.map((i, element) => {
        return $(element).attr('href').replace('mailto:', '');
      }).get();
        let newemail = emails.join(',').replace(/,/g, '\n');
        if (!newemail.includes('\n') && newemail.length > 3) {
            newemail += '\n';
        }          
        fs.appendFileSync('emails.txt', `${newemail}`);
        if(newemail.includes('@')){
            const regex = /@/g;
            const matches = newemail.match(regex);
            i = matches ? matches.length : 0 + i;
        }
    } catch (error) {
      console.error(`Error: Could not fetch emails from ${url}`);
      console.error(error);
    }
  };

  const scrapePage = (html) => {
    const $ = cheerio.load(html);
    const pageLinks = $('a');
    const pageUrls = pageLinks.map((i, link) => {
      let url = $(link).attr('href');
      if (url && !url.includes('https:/')) {
        url = baseUrl + url;
      }

      return url;
    }).get();

    urls.push(...pageUrls.filter((url) => url.includes(baseUrl)));

    const nextPageLink = $('a[rel="next"]').attr('href');

    if (nextPageLink) {
      url = baseUrl + nextPageLink;
    } else {
      done = true;
    }
  };

  function removeDuplicateLines(filePath) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    const uniqueLines = new Set();
  
    lines.forEach(line => uniqueLines.add(line));
  
    fs.writeFileSync(filePath, [...uniqueLines].join('\n'));
  }
  
  const scrapeUrls = async () => {
    try {
      const html = await request(url);
      scrapePage(html);
      if (!done) {
        await scrapeUrls();
      } else {
        console.log("=> Url Crawler :")
        urls.forEach((url) => {
            console.log(`\t${url}`)
            fs.appendFileSync('urls.txt', `${url}\n`);

        });
        const emailAnimation = setInterval(() => {
            process.stdout.write("\r=> Email Scraper " + ["|", "/", "-", "\\"][i++ % 4]);
          }, 100);      
        for (const url of urls) {
          await getEmailsFromUrl(url);
        }
        removeDuplicateLines('emails.txt');
        console.log(`\n\tFinished fetching emails ${i} from ${urls.length} urls`);
        clearInterval(emailAnimation);

      }
    } catch (error) {
      console.error(`Error: Could not fetch page at ${url}`);
      console.error(error);
    }
  };

  await scrapeUrls();
}

main();
