# EmailScraper

This script allows you to scrape email addresses from a website and its linked pages. It does this by performing a breadth-first search on the website, starting from the base URL that you provide. It saves the emails that it finds in a file called emails.txt, and it also saves the URLs of the pages that it visits in a file called urls.txt.

## Dependencies

This script has the following dependencies:

- ```fs```: The fs (File System) module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
- ```request-promise```: The request-promise module is a HTTP request client that supports Promises. It wraps the request module and simplifies the process of making HTTP requests.
- ```cheerio```: The cheerio module is a fast, flexible, and lean implementation of core jQuery designed specifically for the server. It allows you to use the syntax and functions of jQuery to manipulate the HTML of a webpage.
- ```readline```: The readline module provides an interface for reading data from a Readable stream (such as process.stdin) one line at a time.

## Functions

The script has the following functions:

- ```main()``` : This is the entry point of the script. It prompts the user to enter the base URL of the website to be scraped, and then calls the scrapeUrls() function with the base URL as an argument.

- ```getEmailsFromUrl(url)``` : This function fetches the HTML of the page at the given url and uses cheerio to extract all the email addresses that are contained in mailto links on the page. It appends the emails to the emails.txt file, and increments a counter of the total number of emails found.
- ```scrapePage(html)``` : This function takes the HTML of a webpage as an input and uses cheerio to extract all the URLs of the links on the page. It saves the URLs in the urls array, and checks if there is a "next" button on the page. If there is, it updates the url variable with the URL of the next page. If there is no "next" button, it sets the done flag to true.
- ```scrapeUrls()``` : This function makes an HTTP request to the page at the current url and calls the scrapePage() function with the HTML of the page as an input. If the done flag is not true, it calls itself recursively to continue the breadth-first search. If the done flag is true, it iterates over the URLs in the urls array and calls the getEmailsFromUrl() function with each URL as an input. Finally, it calls the removeDuplicateLines() function to remove any duplicate emails from the emails.txt file.
- ```removeDuplicateLines(filePath)``` : This function removes duplicate lines from a file. It reads the file at the given filePath, splits the contents into an array of lines, and uses a Set to eliminate duplicates. It then overwrites the file with the unique lines.

## Example

To use the script, run the following command in your terminal:

```
node email-scraper.js
```

You will be prompted to enter the base URL of the website that you want to scrape. After you enter the URL, the script will start running. It will print out the URLs of the pages that it visits, and it will show an animation while it is fetching emails from each page. When it is finished, it will print out the total number of emails that it found. The emails will be saved in the emails.txt file, and the URLs will be saved in the urls.txt file.

## Limitations

There are a few limitations to this script:

- It only scrapes email addresses that are contained in mailto links on the pages that it visits. Email addresses that are not contained in mailto links will not be scraped.
- It only follows links that are contained within the same domain as the base URL. Links to external websites will not be followed.
- It only searches through the pages that are linked to from the base URL. It will not search through pages that are not linked to from the base URL.
- It may not be able to scrape email addresses from websites that use JavaScript to dynamically generate their content, because it relies on static HTML.
- It may not be able to scrape emails from websites that use CAPTCHAs or other measures to block web scraping.

<div align="center">
"Please note that this script is for educational purposes only and should not be used for any malicious or unethical activities."
</div>
