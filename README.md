# Secret Keeper - Security Research Project

## The Assignment
The goal of the Secret Keeper project was to create two versions of the same website: one "not secure" site, with known security vulnerabilities, and one "secure" site, with fixes to the vulnerabilities found in the "not secure" site.

## The Sign-In Process
The Secret Keeper home page appears identical to users of the weak and strong sites.  Central on the page is a place to enter a username and password.  If the user is new to the site, there is a link under the login which links to the user creation page.  Additionally, there is a link to a frequently asked questions (FAQ) page. 

![Alt Image SecretKeeper](/images/secret-keeper.png?raw=true)

Successfully adding a correct username/password combination leads to different scenarios for each site.  The weak site directly opens the user page, while the strong site includes a second two-factor authentication (2FA) step, which must be passed to open the user page.  The 2FA feature includes a button that, on click, sends a randomly-generated, six-digit passcode to the corresponding user’s email.  Correctly entering the passcode into the displayed text box opens the user page.  Note that, for ease of grading, we have chosen to display the emailed PIN on the 2FA page after the button is clicked. In real-word scenarios, this line would be removed.  Users of the strong site may also notice that incorrect combinations of username and passwords will result in login button disablement depending on the rate of incorrect submissions and the username used.

![Alt Image SecretKeeper](/images/otp.png?raw=true)
![Alt Image SecretKeeper](/images/authentication.png?raw=true)


## Creating an Account
The user creation page has a form for username, password, and email in both site versions.  To successfully create a new account in the weak site, only the username must be unique to all saved usernames.  To test if the username is unique, the user clicks on the “Check Form” button, which then searches profiles for the entered username and, if not found, displays a “Sign Up” button.  If the user clicks this new button, a profile is created and the user is redirected to the home page.  

![Alt Image SecretKeeper](/images/username.png?raw=true)

The strong site features more form checks than simply checking for a unique username.  The entered password must include at least one upper-case letter and one lower-case letter.  The password must also contain a number and be at least 12 characters in length.  Finally, no special characters are allowed in the password.  As with the weak site, the user must click on the check form button and pass the checks before they are able to click on the signup button and create a profile.

![Alt Image SecretKeeper](/images/email.png?raw=true)
![Alt Image SecretKeeper](/images/password.png?raw=true)

In the secure site, the password is also hidden from view on the new-user and home pages, as well as the update-account form on the user profile.

## Using the Site
The user page is the location for users to add, edit, and delete their records.  Records are composed of a name, password, and URL.  Saved records are displayed by name in the left table of the page.  Below the list of saved records are three buttons used to enter new records, edit the user profile, and return to the home page.  Selecting to enter a new record opens a form on the center screen with text boxes for each record criteria.  Saving the record reloads the user page with the new record now displayed by name in the left table.

Selecting a saved record name opens the record data on the center screen, with a button at the bottom to edit the record.  Choosing to edit the record turns the displayed record into a form which can be manipulated and saved.  An option to delete the record outright is also displayed when editing the record.  Editing or deleting a record reloads the user page with changes applied.

![Alt Image SecretKeeper](/images/record.png?raw=true)

Selecting the "update account" button opens a form on the center screen with options to change the user's password or email.  Users of the strong site have to pass profile credential checks similar to creating a profile in order to save their changes.  Successfully saving a change reloads the user page.  Users of the weak site will be able to see their password change displayed directly in the URL.  

## Frequently-Asked Questions
The FAQ page serves as a way for users to get in touch with the administrators of Secret Keeper.  Sample questions are listed on the page with sample responses.  Users can enter a question of their own, which is immediately displayed on the page.  Responses to the question will be displayed when saved by the Admin account at a later time.  This feature was a late addition intended to demonstrate a likely HTML injection scenario.

![Alt Image SecretKeeper](/images/faq.png?raw=true)



## Vulnerability Outline
**To exploit the vulnerabilities outlined below, utilize the secret-keeper-not-secure branch**

### Brute-Force Attack
**brutePass.sh**
* BrutePass takes advantage of the PUT login to test username and password combos
* Usernames are provided by the script user
* Passwords are taken from passwords.txt which has the 10000 top passwords

**Directions to use brutePass.sh:**
1. Place brutePass.sh and passwords.txt in the same directory
2. Open a connection to osu servers (do not use flip3, or the same server as the site is hosted if not flip3)
3. Open the directory with brutePass.sh
4. You may need to give yourself permission to run the script: chmod 777 brutePass.sh

**To use the script:** ./brutePass.sh -g username URL

**Examples:**
* ./brutePass.sh -g Kyle flip3.engr.oregonstate.edu:6061
* ./brutePass.sh -g Katie flip3.engr.oregonstate.edu:6061
* ./brutePass.sh -g Admin flip3.engr.oregonstate.edu:6061


### SQL Injection Attack
**HTML SQL Injection:**
* SQL code can be inserted into the URL as placeholders are not used for MySQL credential checks
* Use the following URL to access users' information without their credentials
```
http://flip3.engr.oregonstate.edu:6061/user/*%20OR%20ALL&*%20OR%20ALL
```

### HTML Injection Attack
**To inject a script:**
1. Sign into any existing user account
2. Add a new record, using the following as the value for one field in the form: 
```
>"&amp;gt;<script>alert("Warning: This site is vulnerable to an attack")</script>
```
3. Note the popup alert warning of possible attack

![Alt Image SecretKeeper](/images/xss.png?raw=true)


### Buffer Overflow Attack
**bufferExploit.sh**
* BufferExploit takes advantage of the buffer used on record names when inserting a new record
* A curl POST is sent with a number value, allocating empty space instead of saving a string value
* Overflow memory is then accessed on the user page as a new record with the name being the data

**Directions to use bufferExploit.sh:**
1. The data for the Kyle profile has been hardcoded into the attack code (the attacker needs a profile and their profile ID)
2. Run the script and access memory data at flip3.engr.oregonstate.edu:6061/user/Kyle&12345
3. Repeatly run the script to get chunks of memory to later decode and decipther

**To use the script:** ./bufferExploit.sh


### Denial of Service (DoS) Attack
**Fork Bomb:**
1. Make sure that the active internet browser will not block popups
2. Add a new record, using the following as the value for the record name:
*  Change URL to link to user profile in use
```
>"&amp;gt;<script>
function fork() {
  	const win = window.open("http://flip3.engr.oregonstate.edu:6061/user/Kyle&12345");
	setTimeout(fork(), 1);
}
fork(); </script>
```
3. Select the name of the record from the record table to intitate fork bomb
* **WARNING: This will slow down the user computer**
* This does not bring down the school server (thankfully) rather it illustrates how to slow down a weak server
* The Kyle account has this record already saved and ready to initiate 
