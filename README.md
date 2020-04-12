# Read Later

This is a Node project that uses a combination of [Pocket](https://www.getpocket.com), [Google Sheets](https://www.google.com/sheets/about), and [IFTTT](https://ifttt.com) to create a list of websites to visit later. I don't like to watch tutorials or trailers on my phone, but I often will start off my mornings by browsing Reddit, Twitter, etc. on my phone to see what industry news, new tutorials, articles, and/or trailers have dropped since the last time I checked in. I like the process of gathering resources on my phone, but not going over them, for that I prefer my desktop. So, I came up with this:

🚨⚠️🚨 Obviously this code isn't done, but this is where I'm at now. 🚨⚠️🚨

## Getting Started

### Prerequisites

The are a couple of services you'll need accounts with before you can use this script:

- [Pocket](https://www.getpocket.com)
- [Google Sheets](https://www.google.com/sheets/about)
- [Google Developer](https://developers.google.com) and a Credentials JSON file
- [IFTTT](https://ifttt.com)

#### Pocket [#](https://www.getpocket.com)

You'll need a Pocket account, which you might be wondering why I don't just use Pocket for this whole thing, but I'm wanting to create an API for this to eventually use in a larger project, and, I use Pocket for deep knowledge storage, and I'm only using one `tag` for the sites I want to read later (undramatically, it's `read later`, but you can set it to whatever you want).

#### Google Sheets [#](https://www.google.com/sheets/about) / Google Developer [#](https://developers.google.com)

You'll need a Google Drive account, as well as a Google Devloper account. In the Google Developer Dashboard, you'll need to set up a _Service account_ for the Google Sheets API. I spent some time creating a tutorial, but they keep changing it, so do a Google search and find the most recent way to set it up.

This [video](https://www.youtube.com/watch?v=UGN6EUi4Yio) is what I used to set it up, but it's already out of date, so I had to mess with the different options to get it to work. But, the credentials bit still seems to work correctly, ulitimately you'll need the JSON file with the **Service account credentials**.

Download the _JSON file_, we'll use it later.

#### IFTTT [#](https://ifttt.com)

Once you have a Pocket account and a Google Drive account, you'll need to setup an IFTTT account and connect those services.

Once they're connected you'll want to create a new applet:

1. Click on your avatar and select "Create" from the menu
2. Click "This" and select Pocket
3. Select the "New item tagged" option
4. Type the tag you wish to have indicate you want this site to be added to your read later list, I choose `read later`
5. Click "That" and select "Google Sheets"
6. Select the "Add row to spreadsheet" option
7. Fill out the form:

   1. "Spreadsheet name" can be anything you want, just don't change it once it's created, I chose `Read Later`
   2. "Formatted row" should be the following:

   ```
   {{AddedAt}} ||| {{Title}} ||| {{Excerpt}} ||| {{ImageUrl}} ||| {{Tags}} ||| {{Url}} ||| 0
   ```

   _This is close to the default, but there are a couple of differences:_

   - Remove the additional code around `{{ImageUrl}}`, the code they added makes it so the Google Sheet displays the image, rather than just the URL as a string, we want the string, otherwise we'll get the Spreadsheet code and the URL as a string in our Node app.
   - Add a row `|||` and the number `0` at the end, this is to allow us to mark sites as seen in our Node app.

   3. "Drive folder path" can be anything, you're going to connect the spreadsheet by it's ID, so the hierachy shouldn't matter.
   4. Create the applet and test to make sure it's connecting.

#### Back in Pocket

Add a website using the `read later` (or whatever you made your identifying tag) tag. You can also add whatever additional tags you want here, they will be used in the Node app to add additional sorting.

#### Back in Google Sheets

It might take a minute or so for IFTTT to run and grab the site from Pocket, but once it does, open the spreadsheet you indicated in the IFTTT setup.

In the spreadsheet, you should see an row entry for the site you created above. Right click on row 1, and select "Insert 1 above".

In the newly created row, change the headers to: `date`, `title`, `excerpt`, `image`, `tags`, `url`, and `seen`, like this:

| date                      | title      | excerpt                        | image                             | tags                   | url                     | seen |
| ------------------------- | ---------- | ------------------------------ | --------------------------------- | ---------------------- | ----------------------- | ---- |
| April 09, 2020 at 01:24PM | Title Text | Excerpt text, blah, blah, blah | https://www.example.com/image.png | tag1, tag2, this tag 3 | https://www.example.com | 0    |

#### Make the Google Sheets Spreadsheet Editable by the API

Before you move on, open the JSON file we downloaded from Google Developer, and find the line of code that looks similar to this:

```
"client_email": "sheets@project-name-######.iam.gserviceaccount.com",
```

Copy that email address, then go back to your spreadsheet, and click the `Share` button in the top, right corner. Paste that email address in, as if you were sharing editing permissions of the document with a friend.

Now Google APIs has editing privliages.

And that should be it for the prerequisites!

### Installing

First, clone this repo into the folder you want to put the code, you can use an `[optional]` filename:

**SSH:**

```
git clone git@github.com:coffeepostal/read-later.git [new-name]
```

or

**HTTPS:**

```
git clone https://github.com/coffeepostal/read-later.git [new-name]
```

Once it's cloned, run NPM install to get the dependancies:

```
npm i
```

Next, grab that JSON file we downloaded earlier, copy it into the root, and rename it:

```
client_secret.json
```

Next, go to the spreadsheet you created and grab the URL, it should looks similar to this:

```
https://docs.google.com/spreadsheets/d/#####/edit#gid=0
```

In my example the `#####` is the **spreadsheet ID**, and we need to copy that.

Next, create a file called `.env` in your root, and add the variable `SHEET_ID=#####`. Where the `#####` is, paste the **spreadsheet ID** we just copied from the Google Sheets spreadsheet.

## Running the script

That's bascially it, run:

```
node spreadsheet.js
```

And you'll get a console log result from the spreadsheet.

## Deployment

TODO

## Versioning

We (are trying to) use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/coffeepostal/read-later/tags).

## Authors

- **Adam Farnsworth** - _Initial work_ - [coffeepostal](https://github.com/coffeepostal)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
